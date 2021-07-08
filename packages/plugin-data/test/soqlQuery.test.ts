/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import sinon = require('sinon');
import { Logger } from '@salesforce/core';
import { SoqlQuery } from '../src/commands/force/data/soql/query';
import * as TestUtil from './testUtil';
import { soqlQueryExemplars } from './test-files/soqlQuery.exemplars';
import { queryFieldsExemplars } from './test-files/queryFields.exemplars';

chai.use(chaiAsPromised);

describe('soqlQuery tests', () => {
  const fakeConnection = TestUtil.createFakeConnection();
  const logger = Logger.childFromRoot('soqlQuery.test');
  const sandbox = sinon.createSandbox();
  let querySpy: any;
  let requestSpy: any;
  afterEach(() => {
    sandbox.restore();
  });

  it('should handle a simple query with all records returned in single call', async () => {
    sandbox
      .stub(fakeConnection, 'request')
      .resolves({ columnMetadata: queryFieldsExemplars.simpleQuery.columnMetadata });
    querySpy = sandbox.stub(fakeConnection, 'autoFetchQuery').resolves(soqlQueryExemplars.simpleQuery.queryResult);
    const soqlQuery = new SoqlQuery();
    const results = await soqlQuery.runSoqlQuery(fakeConnection, 'SELECT id, name FROM Contact', logger);
    sinon.assert.calledOnce(querySpy);
    expect(results).to.be.deep.equal(soqlQueryExemplars.simpleQuery.soqlQueryResult);
  });
  it('should handle a query with a subquery', async () => {
    sandbox.stub(fakeConnection, 'request').resolves({ columnMetadata: queryFieldsExemplars.subquery.columnMetadata });
    querySpy = sandbox.stub(fakeConnection, 'autoFetchQuery').resolves(soqlQueryExemplars.subQuery.queryResult);
    const soqlQuery = new SoqlQuery();
    const results = await soqlQuery.runSoqlQuery(
      fakeConnection,
      'SELECT Name, ( SELECT LastName FROM Contacts ) FROM Account',
      logger
    );
    sinon.assert.calledOnce(querySpy);
    expect(results).to.be.deep.equal(soqlQueryExemplars.subQuery.soqlQueryResult);
  });
  it('should handle empty query', async () => {
    requestSpy = sandbox.stub(fakeConnection, 'request');
    querySpy = sandbox
      .stub(fakeConnection, 'autoFetchQuery')
      .callsFake(() => Promise.resolve(soqlQueryExemplars.emptyQuery.queryResult));
    const soqlQuery = new SoqlQuery();
    const results = await soqlQuery.runSoqlQuery(
      fakeConnection,
      "SELECT Name FROM Contact where name = 'some nonexistent name'",
      logger
    );
    sinon.assert.calledOnce(querySpy);
    sinon.assert.notCalled(requestSpy);
    expect(results).to.be.deep.equal(soqlQueryExemplars.emptyQuery.soqlQueryResult);
  });
  it('should preserve case sensitivity for query filter Ids', async () => {
    sandbox
      .stub(fakeConnection, 'request')
      .resolves({ columnMetadata: queryFieldsExemplars.queryWithIdFilters.columnMetadata });

    querySpy = sandbox
      .stub(fakeConnection, 'autoFetchQuery')
      .resolves(soqlQueryExemplars.queryWithIdFilters.queryResult);

    const soqlQuery = new SoqlQuery();
    const results = await soqlQuery.runSoqlQuery(
      fakeConnection,
      "SELECT Id, Name FROM Contact where Id = '003B000000DkDswIAF'",
      logger
    );

    sinon.assert.calledOnce(querySpy);
    expect(results).to.be.deep.equal(soqlQueryExemplars.queryWithIdFilters.soqlQueryResult);
  });
});
