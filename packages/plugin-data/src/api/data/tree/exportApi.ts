/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as path from 'path';
import { fs, Logger, Messages, Org, SfdxError } from '@salesforce/core';
import { AnyArray, AnyJson, Dictionary, get, getNumber, getString, has, isArray } from '@salesforce/ts-types';
import { UX } from '@salesforce/command';
import { QueryResult } from 'jsforce';
import { sequentialExecute } from './executors';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-data', 'exportApi');

const DATA_PLAN_FILENAME_PART = '-plan.json';

const describe: Dictionary<any> = {}; // holds metadata result for object type describe calls

interface DataPlanPart {
  sobject: string;
  saveRefs: boolean;
  resolveRefs: boolean;
  files: string[];
}

export interface ExportConfig {
  query: string;
  outputDir?: string;
  plan?: boolean;
  prefix?: string;
}

/**
 * Exports data from an org into sObject tree format.
 */
export class ExportApi {
  private logger: Logger;

  private objectTypeRegistry: any = {}; // registry for object type data plan descriptor
  private referenceRegistry: any = {}; // registry of object type-specific id-to-ref mappings
  private typeRefIndexes: any = {}; // registry for object type-specific ref counters

  private config!: ExportConfig;

  public constructor(private readonly org: Org, private readonly ux: UX) {
    this.logger = Logger.childFromRoot(this.constructor.name);
  }

  /**
   * Invokes the provided SOQL query against a target Org.  Results
   * are converted into SObject Tree format.
   *
   * @param config
   */
  public async export(config: ExportConfig): Promise<AnyJson> {
    this.config = this.validate(config);

    const { outputDir, plan, query } = this.config;

    if (outputDir) {
      this.setupOutputDirectory(outputDir);
    }

    let queryResults: QueryResult<unknown>;
    try {
      queryResults = await this.org.getConnection().query(query);
    } catch (err) {
      if ((err as Error).name === 'MALFORMED_QUERY') {
        const errMsg = messages.getMessage('soqlMalformed');
        const errMsgAction = messages.getMessage('soqlMalformedAction');
        throw new SfdxError(errMsg, 'MalformedQuery', [errMsgAction]);
      } else {
        throw err;
      }
    }

    const sobjectTree = (await this.processQueryResults(queryResults)) as Dictionary<any>;

    if (!sobjectTree.records?.length) {
      return sobjectTree;
    }
    if (plan) {
      return this.generateDataPlan(sobjectTree);
    } else {
      const fileName = `${Object.keys(this.objectTypeRegistry).join('-')}.json`;
      return this.writeDataFileSync(fileName, sobjectTree);
    }
  }

  //   P R I V A T E   M E T H O D S

  /**
   * Ensures a valid query is defined in the export configuration,
   * which can be either a soql query or a path to a file containing
   * a soql query.
   *
   * @param config - The export configuration.
   */
  private validate(config: ExportConfig): ExportConfig {
    if (!config.query) {
      throw SfdxError.create('@salesforce/plugin-data', 'exportApi', 'queryNotProvided');
    }

    const filepath = path.resolve(process.cwd(), config.query);
    if (fs.existsSync(filepath)) {
      config.query = fs.readFileSync(filepath, 'utf8');

      if (!config.query) {
        throw SfdxError.create('@salesforce/plugin-data', 'exportApi', 'queryNotProvided');
      }
    }

    config.query = config.query.trim();
    if (!/^select/i.test(config.query)) {
      throw SfdxError.create('@salesforce/plugin-data', 'exportApi', 'soqlInvalid', [config.query]);
    }

    return config;
  }

  private setupOutputDirectory(outputDir: string): void {
    try {
      fs.mkdirpSync(outputDir);
    } catch (err) {
      // It is ok if the directory already exist
      if (err.name !== 'EEXIST') {
        throw err;
      }
    }
  }

  // Process query results generating SObject Tree format
  private async processQueryResults(recordList: any): Promise<any> {
    await this.recordObjectTypes(recordList);

    const { plan, query } = this.config;

    const processedRecordList = (await this.processRecordList(recordList)) as Dictionary<any>;
    // log record count; warn if > 200 and !options.plan
    const recordCount = getNumber(processedRecordList, 'records.length', 0);
    this.logger.debug(messages.getMessage('dataExportRecordCount', [recordCount, query]));
    if (recordCount > 200 && !plan) {
      this.ux.warn(messages.getMessage('dataExportRecordCountWarning', [recordCount, query]));
    }
    return this.finalApplyRefs(processedRecordList.records as any[]);
  }

  // Register object types and type hierarchy for plan generation
  private async recordObjectTypes(recordList: any): Promise<any> {
    const records = recordList.records as any[];

    if (!records.length) {
      // TODO: should be on the command
      this.ux.log('Query returned no results');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return recordList;
    }

    // top level object type
    const topLevelType = getString(records[0], 'attributes.type') as string;
    this.objectTypeRegistry[topLevelType] = {
      order: 0,
      type: topLevelType,
      saveRefs: true, // post-save, record reference-to-id to be used for child reference resolution
      resolveRefs: false, // pre-save, don't resolve relationship references to parent ids (from previous save)
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    records.forEach((record: any) => {
      Object.keys(record).map((key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const value = record[key];
        if (value && getNumber(value, 'records.length')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const firstRec = value.records[0];
          const type = getString(firstRec, 'attributes.type');
          // found a related object, add to map
          if (type && !this.objectTypeRegistry[type]) {
            this.objectTypeRegistry[type] = {
              order: 1,
              type,
              saveRefs: false, // assume child records will not be parents (may be changed later)
              resolveRefs: true, // resolve relationship references to parent ids
            };
          }
        }
        return key;
      });
    });

    // pre-load object metadata
    const promises = Object.keys(this.objectTypeRegistry).map((key) => this.loadMetadata(key));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Promise.all(promises).then(() => recordList);
  }

  private async processRecordList(recordList: any, parentRef?: any): Promise<any> {
    // holds transformed sobject tree
    const sobjectTree = { records: [] };

    // visit each record in the list
    const processRecordsFn = (record: any) => (): Promise<any> => this.processRecords(parentRef, record, sobjectTree);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const recordFns = recordList.records.map((record: any) => processRecordsFn(record));

    // TODO: do we really need sequentialExecute?  Can't we just use Promise.all()?
    await sequentialExecute(recordFns);
    this.logger.debug(JSON.stringify(sobjectTree, null, 4));
    return sobjectTree;
  }

  private async processRecords(parentRef: any, record: any, sobjectTree: any): Promise<any> {
    // incremented every time we visit another record
    const objRefId = this.incrementTypeRefIndex(record.attributes.type);

    // add the attributes for this record, setting the type and reference
    const treeRecord: any = {
      attributes: {
        type: record.attributes.type as string,
        referenceId: objRefId,
      },
    };

    // store the reference in a map with the record id
    this.saveRecordRef(record, objRefId);

    // handle each record attribute
    await this.processRecordAttributes(record, treeRecord, objRefId);

    if (parentRef && this.config.plan) {
      const parentFieldName = getString(parentRef, 'fieldName', '');
      if (!treeRecord[parentFieldName]) {
        treeRecord[parentFieldName] = parentRef.id as string;
      }
    }
    // add record to tree
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    sobjectTree.records.push(treeRecord);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return sobjectTree;
  }

  // Generate object type reference (<ObjectType>Ref<Counter>)
  private incrementTypeRefIndex(type: string): string {
    if (!this.typeRefIndexes[type]) {
      this.typeRefIndexes[type] = 0;
    }

    return `${type}Ref${++this.typeRefIndexes[type]}`;
  }

  private async processRecordAttributes(record: any, treeRecord: any, objRefId: string): Promise<any> {
    const promises = Object.keys(record).map((key) => this.processRecordAttribute(record, key, treeRecord, objRefId));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Promise.all(promises).then(() => treeRecord);
  }

  private async processRecordAttribute(record: any, key: string, treeRecord: any, objRefId: string): Promise<any> {
    return Promise.resolve().then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const field = record[key];

      // skip attributes and id.  Data import does not accept records with IDs.
      if (key === 'attributes' || key === 'Id') {
        // If this is an attributes section then we need to add an object reference
        this.saveRecordRef(record, objRefId);
      } else {
        return this.loadMetadata(record.attributes.type)
          .then((metadata) => {
            if (this.isQueryResult(metadata, key)) {
              if (!field) {
                // The parent has no child records, so return an empty records array
                return { records: [] };
              }
              // handle child records
              return this.loadMetadata(field.records[0].attributes.type).then((childMetadata) =>
                this.processRecordList(field, {
                  id: `@${objRefId}`,
                  fieldName: this.getRelationshipFieldName(childMetadata, record.attributes.type),
                })
              );
            } else {
              // see if this is a relationship field
              if (this.isRelationshipWithMetadata(metadata, key)) {
                // related to which field?
                const relTo = this.getRelatedToWithMetadata(metadata, key);
                if (this.config.plan) {
                  // find reference in record result
                  if (this.objectTypeRegistry[relTo]) {
                    // add ref to replace the value
                    const id: string = record[key] as string;
                    const relatedObject = this.referenceRegistry[relTo] as Dictionary<any>;
                    if (relatedObject) {
                      const ref: string = relatedObject[id] as string;
                      // If ref is not found, then leave intact because we may not have processed
                      // this parent fully. We'll go back through the sObject tree
                      // later and replace the id with a reference.
                      return ref ? `@${ref}` : id;
                    } else {
                      // again, this will just be the id for now and replaced with a ref later.
                      return id;
                    }
                  } else {
                    // TODO: what to do if ref not found?
                    const recordId: string = record['Id'] as string;
                    this.logger.error(`Reference ${relTo} not found for ${key}.  Skipping record ${recordId}.`);
                  }
                }
              } else {
                // not a relationship field, simple key/value insertion
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return record[key];
              }
            }

            return null;
          })
          .then((processedAttribute) => {
            if (processedAttribute !== null) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              treeRecord[key] = processedAttribute;
            }

            return Promise.resolve(null);
          })
          .catch((e) => {
            throw e;
          });
      }

      return Promise.resolve(null);
    });
  }

  // Get sObject description and cache for given object type
  private async loadMetadata(objectName: string): Promise<any> {
    if (!describe[objectName]) {
      const sObject = this.org.getConnection().sobject(objectName);
      describe[objectName] = await sObject.describe();
    }

    return describe[objectName] as Dictionary;
  }

  private isQueryResult(metadata: any, fieldName: string): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return metadata.childRelationships.some((cr: any) => cr.relationshipName === fieldName);
  }

  private isSpecificTypeWithMetadata(metadata: any, fieldName: string, fieldType: string): boolean {
    for (let i = 0, fld; i < metadata.fields.length; i++) {
      fld = metadata.fields[i] as { name: string; type: string };
      /* eslint-disable @typescript-eslint/no-unsafe-call */
      if (fld.name.toLowerCase() === fieldName.toLowerCase()) {
        if (fld.type.toLowerCase() === fieldType.toLowerCase()) {
          return true;
        }
      }
      /* eslint-enable @typescript-eslint/no-unsafe-call */
    }

    return false;
  }

  private getRelationshipFieldName(metadata: any, parentName: string): string {
    const result = (metadata.fields as [{ name: string; type: string; referenceTo: string[] }]).find((field: any) => {
      if (field.type === 'reference') {
        for (const refTo of field.referenceTo) {
          if (refTo === parentName) {
            return true;
          }
        }
      }
      return false;
    });

    if (!result) {
      throw new SfdxError(`Unable to find relationship field name for ${metadata.name as string}`);
    }

    return result.name;
  }

  private isRelationship(objectName: string, fieldName: string): boolean {
    const metadata = describe[objectName] as Dictionary<any>;
    if (!metadata) {
      throw new SfdxError(`Metadata not found for ${objectName}`);
    }

    return this.isRelationshipWithMetadata(metadata, fieldName);
  }

  private isRelationshipWithMetadata(metadata: any, fieldName: string): boolean {
    return this.isSpecificTypeWithMetadata(metadata, fieldName, 'reference');
  }

  private getRelatedTo(objectName: string, fieldName: string): string {
    const metadata = describe[objectName] as Dictionary<any>;
    if (!metadata) {
      throw new SfdxError(`Metadata not found for ${objectName}`);
    }

    return this.getRelatedToWithMetadata(metadata, fieldName);
  }

  private getRelatedToWithMetadata(metadata: any, fieldName: string): string {
    const result = (metadata.fields as [{ name: string; type: string; referenceTo: string[] }]).find((field) => {
      if (field.name === fieldName) {
        if (field.referenceTo.length) {
          return true;
        }
        return false;
      }
      return false;
    });

    if (!result) {
      throw new SfdxError(`Unable to find relation for ${metadata.name as string}`);
    }

    return result.referenceTo[0];
  }

  // Register object type's id to reference mapping
  private saveRecordRef(obj: any, refId: string): void {
    const id = path.basename(obj.attributes.url);
    const ref = refId;

    const type = obj.attributes.type as string;
    if (typeof this.referenceRegistry[type] === 'undefined') {
      this.referenceRegistry[type] = {};
    }

    // ensure no existing reference
    const refEntry = this.referenceRegistry[type][id] as string;
    if (refEntry && refEntry !== ref) {
      throw new SfdxError(`Overriding ${type} reference for ${id}: existing ${refEntry}, incoming ${ref}`);
    }

    this.referenceRegistry[type][id] = ref;
  }

  /**
   * Walk the final data set and split out into files.  The main queried
   * object is the parent, and has a different saveRefs and resolveRefs
   * values.  All the references have been created at this point.
   */
  private generateDataPlan(sobjectTree: any): AnyJson {
    const objects: any = {};
    const dataPlan: DataPlanPart[] = [];
    let topLevelObjectType: string;

    // loop thru object tree extracting type-specific records into separate tree structure
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    sobjectTree.records.forEach((record: any) => {
      topLevelObjectType = record.attributes.type as string;
      if (!objects[topLevelObjectType]) {
        objects[topLevelObjectType] = { records: [] };
      }

      Object.keys(record).map((key) => {
        const childRecords: any = get(record, `${key}.records`);
        if (childRecords) {
          // found child records, add to type-specific registry
          if (childRecords.length) {
            const childObjectType = childRecords[0].attributes.type as string;
            if (!objects[childObjectType]) {
              objects[childObjectType] = { records: [] };
            }

            /* eslint-disable @typescript-eslint/no-unsafe-call */
            childRecords.forEach((child: any) => {
              objects[childObjectType].records.push(child);
            });
            /* eslint-enable @typescript-eslint/no-unsafe-call */
          }

          // remove child from top-level object structure
          delete record[key];
        }

        return key;
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      objects[topLevelObjectType].records.push(record);
    });

    // sort object types based on insertion dependence
    const objectsSorted = Object.keys(this.objectTypeRegistry).sort(
      (a, b) => this.objectTypeRegistry[a].order - this.objectTypeRegistry[b].order
    );

    // write data files and update data plan
    objectsSorted.forEach((key) => {
      const dataPlanPart = this.writeObjectTypeDataFile(
        key,
        this.objectTypeRegistry[key].saveRefs,
        this.objectTypeRegistry[key].resolveRefs,
        `${key}s.json`,
        objects[key]
      );
      dataPlan.push(dataPlanPart);
    });

    // write data plan file
    const dataPlanFile = Object.keys(this.objectTypeRegistry).join('-') + DATA_PLAN_FILENAME_PART;

    return this.writeDataFileSync(dataPlanFile, dataPlan as any);
  }

  // generate data plan stanza referencing written object type file
  private writeObjectTypeDataFile(
    type: string,
    saveRefs: boolean,
    resolveRefs: boolean,
    fileName: string,
    sObject: any
  ): DataPlanPart {
    let finalFilename = fileName;
    if (this.config.prefix) {
      finalFilename = `${this.config.prefix}-${fileName}`;
    }
    const dataPlanPart = {
      sobject: type,
      saveRefs,
      resolveRefs,
      files: [finalFilename],
    };

    this.writeDataFileSync(fileName, sObject);

    return dataPlanPart;
  }

  /**
   * This method is used as a second pass to establish references that couldn't be determined
   * in the initial pass done by processRecordList. It looks for relationship fields that
   * contain an id.
   */
  private finalApplyRefs(sobjectTree: any[]): { records: any } {
    sobjectTree.forEach((record: any) => {
      Object.keys(record).map((field) => {
        if (record[field].records) {
          // These are children
          this.finalApplyRefs(record[field].records as any[]);
        } else {
          const objType = record.attributes.type as string;

          if (this.isRelationship(objType, field)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const id = record[field].toString() as string;
            if (!id.startsWith('@')) {
              const refTo = this.getRelatedTo(objType, field);
              const ref = this.referenceRegistry[refTo][id] as string;

              if (!ref) {
                throw new SfdxError(`${objType} reference to ${refTo} (${id}) not found in query results.`);
              }

              record[field] = `@${ref}`;

              // Setup dependency ordering for later output
              if (this.objectTypeRegistry[objType].order <= this.objectTypeRegistry[refTo].order) {
                this.objectTypeRegistry[objType].order = Number(this.objectTypeRegistry[refTo].order) + 1;
                this.objectTypeRegistry[refTo].saveRefs = true;
                this.objectTypeRegistry[objType].resolveRefs = true;
              }
            }
          }
        }

        return field;
      });
    });

    return { records: sobjectTree };
  }

  private countRecords(records: AnyArray, count = 0): number {
    count += records.length;
    records.forEach((record: any) => {
      Object.values(record).forEach((val: any) => {
        if (val?.records) {
          this.countRecords(val.records, count);
        }
      });
    });
    return count;
  }

  private writeDataFileSync(fileName: string, jsonObject: AnyJson): AnyJson {
    let recordCount = 0;
    const { outputDir, prefix } = this.config;

    if (prefix) {
      fileName = `${prefix}-${fileName}`;
    }

    if (outputDir) {
      fileName = path.join(outputDir, fileName);
    }

    if (has(jsonObject, 'records') && isArray(jsonObject.records)) {
      recordCount = this.countRecords(jsonObject.records);
    }

    fs.writeFileSync(fileName, JSON.stringify(jsonObject, null, 4));

    // TODO: move this to the command
    this.ux.log(`Wrote ${recordCount} records to ${fileName}`);

    return jsonObject;
  }
}
