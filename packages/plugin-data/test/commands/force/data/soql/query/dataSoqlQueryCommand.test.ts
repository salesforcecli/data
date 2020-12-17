/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect, test } from '@salesforce/command/lib/test';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import sinon = require('sinon');
import { SinonSandbox } from 'sinon';
import { SoqlQuery } from '../../../../../../src/api/data/soql/soqlQuery';
import { soqlQueryExemplars } from '../../../../../api/data/soql/test-files/soqlQuery.exemplars';

/* eslint-disable @typescript-eslint/no-explicit-any */

chai.use(chaiAsPromised);

const QUERY_COMMAND = 'force:data:soql:query';

describe('Execute a SOQL statement', function (): void {
  let sandbox: SinonSandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  describe('handle query results', () => {
    let soqlQuerySpy: any;
    describe('handle empty results', () => {
      beforeEach(() => {
        soqlQuerySpy = sandbox
          .stub(SoqlQuery.prototype, 'runSoqlQuery')
          .callsFake(() => Promise.resolve(soqlQueryExemplars.emptyQuery.soqlQueryResult));
      });
      afterEach(() => {
        sandbox.restore();
      });
      test
        .withOrg({ username: 'test@org.com' }, true)
        .stdout()
        .stderr()
        .command([QUERY_COMMAND, '--targetusername', 'test@org.com', '--query', 'select '])
        .it('should have empty results', (ctx) => {
          sinon.assert.calledOnce(soqlQuerySpy);
          expect(ctx.stdout).to.include('records retrieved: 0');
        });
      test
        .withOrg({ username: 'test@org.com' }, true)
        .stdout()
        .stderr()
        .command([QUERY_COMMAND, '--targetusername', 'test@org.com', '--query', 'select ', '--resultformat', 'json'])
        .it('should have 0 totalSize and 0 records for empty result with json reporter', (ctx) => {
          sinon.assert.calledOnce(soqlQuerySpy);
          const jsonResults = JSON.parse(ctx.stdout);
          expect(jsonResults).to.have.property('status', 0);
          expect(jsonResults.result.data).to.have.property('totalSize', 0);
          expect(jsonResults.result.data.records.length).to.be.equal(jsonResults.result.data.totalSize);
        });
    });
    describe('reporters produce the correct results for subquery', () => {
      beforeEach(() => {
        soqlQuerySpy = sandbox
          .stub(SoqlQuery.prototype, 'runSoqlQuery')
          .callsFake(() => Promise.resolve(soqlQueryExemplars.subqueryAccountsAndContacts.soqlQueryResult));
      });
      afterEach(() => {
        sandbox.restore();
      });
      test
        .withOrg({ username: 'test@org.com' }, true)
        .stdout()
        .command([QUERY_COMMAND, '--targetusername', 'test@org.com', '--query', 'select ', '--resultformat', 'csv'])
        .it('should have csv results', (ctx) => {
          sinon.assert.calledOnce(soqlQuerySpy);
          // test for expected snippet in output
          expect(ctx.stdout).to.include(
            'Contacts.totalSize,Contacts.records.3.LastName\n"Cisco Systems, Inc.",,,,,,,,\nASSMANN Electronic GmbH,,,,,,,,\n'
          );
        });
      test
        .withOrg({ username: 'test@org.com' }, true)
        .stdout()
        .stderr()
        .command([QUERY_COMMAND, '--targetusername', 'test@org.com', '--query', 'select ', '--resultformat', 'json'])
        .it('should have json results', (ctx) => {
          sinon.assert.calledOnce(soqlQuerySpy);
          const jsonResults = JSON.parse(ctx.stdout);
          expect(jsonResults).to.have.property('status', 0);
          expect(jsonResults.result.data).to.have.property('totalSize', 50);
          expect(jsonResults.result.data.records.length).to.be.equal(jsonResults.result.data.totalSize);
        });
      test
        .withOrg({ username: 'test@org.com' }, true)
        .stdout()
        .stderr()
        .command([QUERY_COMMAND, '--targetusername', 'test@org.com', '--query', 'select ', '--resultformat', 'human'])
        .it('should have json results', (ctx) => {
          sinon.assert.calledOnce(soqlQuerySpy);
          // test for expected snippet in output
          expect(ctx.stdout).to.include('records retrieved: 50');
        });
    });
    describe('reporters produce the correct aggregate query', () => {
      beforeEach(() => {
        soqlQuerySpy = sandbox
          .stub(SoqlQuery.prototype, 'runSoqlQuery')
          .callsFake(() => Promise.resolve(soqlQueryExemplars.queryWithAgregates.soqlQueryResult));
      });
      afterEach(() => {
        sandbox.restore();
      });
      test
        .withOrg({ username: 'test@org.com' }, true)
        .stdout()
        .stderr()
        .command([QUERY_COMMAND, '--targetusername', 'test@org.com', '--query', 'select ', '--resultformat', 'json'])
        .it('should have json results', (ctx) => {
          sinon.assert.calledOnce(soqlQuerySpy);
          const jsonResults = JSON.parse(ctx.stdout);
          expect(jsonResults).to.have.property('status', 0);
          expect(jsonResults.result.data).to.have.property('totalSize', 16);
          expect(jsonResults.result.data.records.length).to.be.equal(jsonResults.result.data.totalSize);
        });
      test
        .withOrg({ username: 'test@org.com' }, true)
        .stdout()
        .stderr()
        .command([QUERY_COMMAND, '--targetusername', 'test@org.com', '--query', 'select ', '--resultformat', 'human'])
        .it('should have human results', (ctx) => {
          sinon.assert.calledOnce(soqlQuerySpy);
          expect(ctx.stdout).to.include('records retrieved: 16');
        });
    });
  });
});