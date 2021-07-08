/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString, isString, AnyJson } from '@salesforce/ts-types';
import { fs as fsCore } from '@salesforce/core';

const query = 'SELECT Id, Name from Account';

// Query response used by the connection stub.
const queryResponse = {
  totalSize: 1,
  done: true,
  records: [
    {
      attributes: {
        type: 'Account',
        url: '/services/data/v51.0/sobjects/Account/0019A00000GNvvAQAT',
      },
      Id: '0019A00000GNvvAQAT',
      Name: 'Sample Account for Entitlements',
    },
  ],
};

// Abbreviated response of Account SObject metadata used by the connection stub.
const ACCOUNT_META = {
  name: 'Account',
  childRelationships: [
    { childSObject: 'Case', field: 'AccountId', relationshipName: 'Cases' },
    {
      childSObject: 'Contact',
      field: 'AccountId',
      relationshipName: 'Contacts',
    },
  ],
  fields: [
    { name: 'Name', referenceTo: [], type: 'string' },
    { name: 'Type', referenceTo: [], type: 'picklist' },
    { name: 'Industry', referenceTo: [], type: 'picklist' },
  ],
};

interface ExportResult {
  status: string;
  message?: string;
  result: AnyJson;
}

describe('force:data:tree:export', () => {
  test
    .stub(fsCore, 'writeFileSync', () => null)
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest((request) => {
      if (isString(request) && request.includes('sobjects/Account/describe')) {
        return Promise.resolve(ACCOUNT_META);
      } else {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).toLowerCase().includes('query?q=select')) {
          return Promise.resolve(queryResponse);
        }
      }
      return Promise.resolve({});
    })
    .stdout()
    .command(['force:data:tree:export', '--targetusername', 'test@org.com', '--query', query, '--json'])
    .it('returns Account record', (ctx) => {
      const result = JSON.parse(ctx.stdout) as ExportResult;
      expect(result.status).to.equal(0);
      expect(result.result).to.deep.equal({
        records: [
          {
            attributes: {
              type: 'Account',
              referenceId: 'AccountRef1',
            },
            Name: 'Sample Account for Entitlements',
          },
        ],
      });
    });

  test
    .withOrg({ username: 'test@org.com' }, true)
    .stdout()
    .command(['force:data:tree:export', '--targetusername', 'test@org.com', '--json'])
    .it('should throw an error if --query is not provided', (ctx) => {
      const result = JSON.parse(ctx.stdout) as ExportResult;
      expect(result.status).to.equal(1);
      expect(result.message).to.include('Missing required flag');
    });
});
