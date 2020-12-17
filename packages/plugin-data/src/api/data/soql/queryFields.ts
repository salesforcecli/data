/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ensureJsonArray, ensureJsonMap, ensureString, isJsonArray, toJsonMap } from '@salesforce/ts-types';
import { Connection } from '@salesforce/core';
import { Tooling } from '@salesforce/core/lib/connection';

/**
 * Class to represent a field when describing the fields that make up a query result
 */
export class Field {
  public name: string;

  public constructor(name: string) {
    this.name = name;
  }
}
/**
 * Class to represent a subquery field when describing the fields that make up a query result
 */
export class SubqueryField extends Field {
  public fields: Field[] = [];
}

/**
 * Class to represent function fields, i.e. result of using aggregation function, like avg.
 */
export class FunctionField extends Field {
  public alias: string | undefined;
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
export const retrieveColumns = async (connection: Connection | Tooling, query: string): Promise<Field[]> => {
  // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/unbound-method,@typescript-eslint/restrict-template-expressions
  const columnUrl = `${connection._baseUrl()}/query?q=${encodeURIComponent(query)}&columns=true`;
  const results = toJsonMap(await connection.request(columnUrl));
  const columns: Field[] = [];
  for (let column of ensureJsonArray(results.columnMetadata)) {
    column = ensureJsonMap(column);
    const name = ensureString(column.columnName);

    if (isJsonArray(column.joinColumns) && column.joinColumns.length > 0) {
      if (column.aggregate) {
        const field = new SubqueryField(name);
        for (const subcolumn of column.joinColumns) {
          field.fields.push(new Field(ensureString(ensureJsonMap(subcolumn).columnName)));
        }
        columns.push(field);
      } else {
        for (const subcolumn of column.joinColumns) {
          columns.push(new Field(`${name}.${ensureString(ensureJsonMap(subcolumn).columnName)}`));
        }
      }
    } else if (column.aggregate) {
      const field = new FunctionField(ensureString(column.displayName));
      // If it isn't an alias, skip so the display name is used when messaging rows
      if (!/expr[0-9]+/.test(name)) {
        field.alias = name;
      }
      columns.push(field);
    } else {
      columns.push(new Field(name));
    }
  }
  return columns;
};