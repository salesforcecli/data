/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as os from 'os';
import { flags, FlagsConfig, SfdxCommand, SfdxResult } from '@salesforce/command';
import { Connection, Logger, Messages, Org } from '@salesforce/core';
import {
  asPlainObject,
  ensureJsonArray,
  ensureJsonMap,
  ensureString,
  isJsonArray,
  toJsonMap,
} from '@salesforce/ts-types';
import { Tooling } from '@salesforce/core/lib/connection';
import { CsvReporter, FormatTypes, HumanReporter, JsonReporter } from '../../../../reporters';
import { DataSoqlQueryResult, Field, FieldType, SoqlQueryResult } from '../../../../dataSoqlQueryTypes';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-data', 'soql.query');

/**
 * Class to handle a soql query
 *
 * Will collect all records and the column metadata of the query
 */
export class SoqlQuery {
  public async runSoqlQuery(connection: Connection | Tooling, query: string, logger: Logger): Promise<SoqlQueryResult> {
    let columns: Field[] = [];
    logger.debug('running query');

    const result = await connection.autoFetchQuery(query, { autoFetch: true, maxFetch: 50000 });
    logger.debug(`Query complete with ${result.totalSize} records returned`);
    if (result.totalSize) {
      logger.debug('fetching columns for query');
      columns = await this.retrieveColumns(connection, query);
    }

    // remove nextRecordsUrl and force done to true
    delete result.nextRecordsUrl;
    result.done = true;
    return {
      query,
      columns,
      result,
    };
  }
  /**
   * Utility to fetch the columns involved in a soql query.
   *
   * Columns are then transformed into one of three types, Field, SubqueryField and FunctionField. List of
   * fields is returned as the product.
   *
   * @param connection
   * @param query
   */

  public async retrieveColumns(connection: Connection | Tooling, query: string): Promise<Field[]> {
    // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/unbound-method,@typescript-eslint/restrict-template-expressions
    const columnUrl = `${connection._baseUrl()}/query?q=${encodeURIComponent(query)}&columns=true`;
    const results = toJsonMap(await connection.request(columnUrl));
    const columns: Field[] = [];
    for (let column of ensureJsonArray(results.columnMetadata)) {
      column = ensureJsonMap(column);
      const name = ensureString(column.columnName);

      if (isJsonArray(column.joinColumns) && column.joinColumns.length > 0) {
        if (column.aggregate) {
          const field: Field = {
            fieldType: FieldType.subqueryField,
            name,
            fields: [],
          };
          for (const subcolumn of column.joinColumns) {
            const f: Field = {
              fieldType: FieldType.field,
              name: ensureString(ensureJsonMap(subcolumn).columnName),
            };
            if (field.fields) field.fields.push(f);
          }
          columns.push(field);
        } else {
          for (const subcolumn of column.joinColumns) {
            const f: Field = {
              fieldType: FieldType.field,
              name: `${name}.${ensureString(ensureJsonMap(subcolumn).columnName)}`,
            };
            columns.push(f);
          }
        }
      } else if (column.aggregate) {
        const field: Field = {
          fieldType: FieldType.functionField,
          name: ensureString(column.displayName),
        };
        // If it isn't an alias, skip so the display name is used when messaging rows
        if (!/expr[0-9]+/.test(name)) {
          field.alias = name;
        }
        columns.push(field);
      } else {
        columns.push({ fieldType: FieldType.field, name } as Field);
      }
    }
    return columns;
  }
}

export class DataSoqlQueryCommand extends SfdxCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly requiresProject = false;
  public static readonly requiresUsername = true;
  public static readonly examples = messages.getMessage('examples').split(os.EOL);

  public static readonly flagsConfig: FlagsConfig = {
    query: flags.string({
      char: 'q',
      required: true,
      hidden: false,
      description: messages.getMessage('queryToExecute'),
      longDescription: messages.getMessage('queryLongDescription'),
    }),
    usetoolingapi: flags.boolean({
      char: 't',
      required: false,
      hidden: false,
      default: false,
      description: messages.getMessage('queryToolingDescription'),
    }),
    resultformat: flags.enum({
      char: 'r',
      description: messages.getMessage('resultFormatDescription'),
      longDescription: messages.getMessage('resultFormatLongDescription'),
      options: ['human', 'csv', 'json'],
      default: 'human',
    }),
  };

  /**
   * Define display function that will produce the desired output based on flag resultformat selection
   *
   * @protected
   */
  protected static readonly result: SfdxResult = {
    display(): void {
      const results = asPlainObject(this.data) as DataSoqlQueryResult;
      let reporter;
      switch (results.resultFormat as keyof typeof FormatTypes) {
        case 'human':
          reporter = new HumanReporter(results, results.columns, this.ux, results.logger);
          break;
        case 'json':
          reporter = new JsonReporter(results, results.columns, this.ux, results.logger);
          break;
        case 'csv':
          reporter = new CsvReporter(results, results.columns, this.ux, results.logger);
          break;
        default:
          throw new Error(`result format is invalid: ${results.resultFormat}`);
      }
      // delegate to selected reporter
      reporter.display();
    },
  };

  // Overrides SfdxCommand.  This is ensured since requiresUsername == true
  protected org!: Org;

  /**
   * Command run implementation
   *
   * Returns either a DataSoqlQueryResult or a SfdxResult.
   * When the user is using global '--json' flag an instance of SfdxResult is returned.
   * This is necessary since '--json' flag reports results in the form of SfdxResult
   * and bypasses the definition of start result. The goal is to have the output
   * from '--json' and '--resulformat json' be the same.
   *
   * The DataSoqlQueryResult is necessary to communicate user selections to the reporters.
   * The 'this' object available during display() function does not include user input to
   * the command, which are necessary for reporter selection.
   *
   */
  public async run(): Promise<DataSoqlQueryResult | SfdxResult> {
    try {
      if (this.flags.resultformat !== 'json') this.ux.startSpinner(messages.getMessage('queryRunningMessage'));
      const query = new SoqlQuery();
      const queryResult: SoqlQueryResult = await query.runSoqlQuery(
        this.flags.usetoolingapi ? this.org.getConnection().tooling : this.org.getConnection(),
        this.flags.query,
        this.logger
      );
      const results = {
        ...queryResult,
        resultFormat: this.flags.resultformat,
        json: this.flags.json,
        logger: this.logger,
      };
      return this.normalizeIfJson(results);
    } finally {
      if (this.flags.resultformat !== 'json') this.ux.stopSpinner();
    }
  }

  /**
   * This function maps the DataSoqlQueryResult instance to the the well known 'data' property in
   * SfdxResult class when the user has selected '--json' flag.
   *
   * @param results
   * @private
   */
  private normalizeIfJson(results: DataSoqlQueryResult): DataSoqlQueryResult | SfdxResult {
    if (this.flags.json) {
      return {
        data: toJsonMap(results.result),
      };
    }
    return results;
  }
}
