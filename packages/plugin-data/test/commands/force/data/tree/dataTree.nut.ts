/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as path from 'path';
import { expect } from 'chai';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { SfdxResult } from '@salesforce/command';
import { Dictionary, get } from '@salesforce/ts-types';
import { QueryResult } from '../soql/query/dataSoqlQuery.nut';

describe('data:tree commands', () => {
  let testSession: TestSession;

  before(() => {
    testSession = TestSession.create({
      setupCommands: [
        'sfdx force:org:create -f config/project-scratch-def.json --setdefaultusername --wait 10 --durationdays 1',
        'sfdx force:org:create -f config/project-scratch-def.json --setalias importOrg --wait 10 --durationdays 1',
      ],
      project: { sourceDir: path.join('test', 'test-files', 'data-project') },
    });
  });

  after(async () => {
    await testSession?.clean();
  });

  it('should error with invalid soql', () => {
    const result = execCmd(
      `force:data:tree:export --query 'SELECT' --prefix INT --outputdir ${path.join('.', 'export_data')}`
    );
    const stdError = result?.shellOutput.stderr.toLowerCase() as string;
    expect(stdError).to.include('soql');
    expect(stdError).to.include('malformed');
    expect(stdError).to.include('check the soql');
  });

  it('import -> export -> import round trip should succeed', () => {
    const query =
      "SELECT Id, Name, Phone, Website, NumberOfEmployees, Industry, (SELECT Lastname, Title, Email FROM Contacts) FROM Account  WHERE Name LIKE 'SampleAccount%'";

    // Import data to the default org.
    execCmd<SfdxResult>(
      `force:data:tree:import --plan ${path.join('.', 'data', 'accounts-contacts-plan.json')} --json`,
      {
        ensureExitCode: 0,
      }
    );

    execCmd<SfdxResult>(
      `force:data:tree:export --query "${query}" --prefix INT --outputdir ${path.join(
        '.',
        'export_data'
      )} --plan --json`,
      { ensureExitCode: 0 }
    );

    // Import data to the default org.
    execCmd<SfdxResult>(
      `force:data:tree:import --targetusername importOrg --plan ${path.join(
        '.',
        'export_data',
        'INT-Account-Contact-plan.json'
      )} --json`,
      {
        ensureExitCode: 0,
      }
    );

    // query the new org for import verification
    const queryResults = execCmd<QueryResult>(
      `force:data:soql:query --targetusername importOrg --query "${query}" --json`,
      {
        ensureExitCode: 0,
      }
    ).jsonOutput;

    expect(queryResults?.result.totalSize).to.equal(
      2,
      'Expected 2 Account objects returned by the query to org: importOrg'
    );

    const records = queryResults?.result.records ?? [];
    const sampleAccountRecord = records.find((account) => account.Name === 'SampleAccount');
    const sampleAccount2Record = records.find((account) => account.Name === 'SampleAccount2');

    // verify data is imported
    expect(sampleAccountRecord).to.have.property('Phone', '1234567890');
    expect(sampleAccountRecord).to.have.property('Website', 'www.salesforce.com');
    expect(sampleAccountRecord).to.have.property('NumberOfEmployees', 100);
    expect(sampleAccountRecord).to.have.property('Industry', 'Banking');
    expect(sampleAccountRecord?.Contacts).to.have.property('totalSize', 3);

    expect(sampleAccount2Record).to.have.property('Phone', '1234567890');
    expect(sampleAccount2Record).to.have.property('Website', 'www.salesforce2.com');
    expect(sampleAccount2Record).to.have.property('NumberOfEmployees', 100);
    expect(sampleAccount2Record).to.have.property('Industry', 'Banking');
    const contactRecords = get(sampleAccount2Record, 'Contacts.records') as Dictionary[];
    expect(contactRecords[0]).to.have.property('LastName', 'Woods');
  });
});
