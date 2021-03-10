/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as path from 'path';
import { expect } from 'chai';
import { execCmd, genUniqueString, TestSession } from '@salesforce/cli-plugins-testkit';

interface RecordCrudResult {
  id: string;
  success: boolean;
  errors: [];
}

interface AccountRecord {
  Id: string;
  Name: string;
  Phone: string;
}

const validateAccount = (
  accountRecord: string,
  recordId: string,
  accountName: string,
  phoneNumber: string
): boolean => {
  const id = new RegExp(`Id:.*?${recordId}`, 'g');
  const name = new RegExp(`Name:.*?${accountName}`, 'g');
  const phone = new RegExp(`Phone:.*?${phoneNumber}`, 'g');
  return id.test(accountRecord) && name.test(accountRecord) && phone.test(accountRecord);
};

describe('data:record commands', () => {
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

  describe('verify json results', () => {
    it('should create, update, and delete a data record', () => {
      const uniqueString = genUniqueString();
      const accountNameBefore = `MyIntTest${uniqueString}`;
      const accountNameAfter = `MyIntTestUpdated${uniqueString}`;
      const phoneNumber = '1231231234';
      const updatedPhoneNumber = '0987654321';

      // Create a record
      const createRecordResponse = execCmd<RecordCrudResult>(
        `force:data:record:create --sobjecttype Account --values "name=${accountNameBefore} phone=${phoneNumber}" --json`,
        { ensureExitCode: 0 }
      ).jsonOutput;
      expect(createRecordResponse?.result).to.have.property('success', true);
      expect(createRecordResponse?.result).to.have.property('id');

      // Get a record
      let getRecordResponse = execCmd<AccountRecord>(
        `force:data:record:get --sobjecttype Account --sobjectid ${createRecordResponse?.result.id} --json`,
        { ensureExitCode: 0 }
      ).jsonOutput;
      expect(getRecordResponse?.result).to.have.property('Id', createRecordResponse?.result.id);
      expect(getRecordResponse?.result).to.have.property('Name', accountNameBefore);
      expect(getRecordResponse?.result).to.have.property('Phone', phoneNumber);

      // Update a record
      execCmd<RecordCrudResult>(
        `force:data:record:update --sobjectid ${createRecordResponse?.result.id} --sobjecttype Account --values "name=${accountNameAfter} phone=${updatedPhoneNumber}" --json`,
        { ensureExitCode: 0 }
      );

      // Get a record
      getRecordResponse = execCmd<AccountRecord>(
        `force:data:record:get --sobjecttype Account --sobjectid ${createRecordResponse?.result.id} --json`,
        { ensureExitCode: 0 }
      ).jsonOutput;
      expect(getRecordResponse?.result).to.have.property('Id', createRecordResponse?.result.id);
      expect(getRecordResponse?.result).to.have.property('Name', accountNameAfter);
      expect(getRecordResponse?.result).to.have.property('Phone', updatedPhoneNumber);

      // Delete a record
      const deleteRecordResponse = execCmd<RecordCrudResult>(
        `force:data:record:delete --sobjecttype Account --sobjectid ${createRecordResponse?.result.id} --json`,
        { ensureExitCode: 0 }
      ).jsonOutput;
      expect(deleteRecordResponse?.result).to.have.property('id', createRecordResponse?.result.id);
      expect(deleteRecordResponse?.result).to.have.property('success', true);
    });
  });
  describe('verify human results', () => {
    it('should create, update, and delete a data record', () => {
      const uniqueString = genUniqueString();
      const accountNameBefore = `MyIntTest${uniqueString}`;
      const accountNameAfter = `MyIntTestUpdated${uniqueString}`;
      const phoneNumber = '1231231234';
      const updatedPhoneNumber = '0987654321';

      // Create a record
      const createRecordResponse = execCmd(
        `force:data:record:create --sobjecttype Account --values "name=${accountNameBefore} phone=${phoneNumber}"`,
        { ensureExitCode: 0 }
      ).shellOutput.stdout;
      const match = createRecordResponse.match('Successfully created record: (001.{15})\\.');
      expect(match).to.have.lengthOf(
        2,
        `could not locate success message in results: "${createRecordResponse as string}`
      );
      const recordId = match[1] as string;

      // Get a record
      let getRecordResponse = execCmd(`force:data:record:get --sobjecttype Account --sobjectid ${recordId}`, {
        ensureExitCode: 0,
      }).shellOutput.stdout;
      expect(validateAccount(getRecordResponse, recordId, accountNameBefore, phoneNumber)).to.be.true;

      // Update a record
      const updateRecordResponse = execCmd(
        `force:data:record:update --sobjectid ${recordId} --sobjecttype Account --values "name=${accountNameAfter} phone=${updatedPhoneNumber}"`,
        { ensureExitCode: 0 }
      ).shellOutput.stdout;
      expect(updateRecordResponse).to.include('Successfully updated record: 001');

      // Get a record
      getRecordResponse = execCmd(`force:data:record:get --sobjecttype Account --sobjectid ${recordId}`, {
        ensureExitCode: 0,
      }).shellOutput.stdout;
      expect(validateAccount(getRecordResponse, recordId, accountNameAfter, updatedPhoneNumber)).to.be.true;

      // Delete a record
      const deleteRecordResponse = execCmd(`force:data:record:delete --sobjecttype Account --sobjectid ${recordId}`, {
        ensureExitCode: 0,
      }).shellOutput.stdout;
      expect(deleteRecordResponse).to.include('Successfully deleted record: 001');
    });
  });
});
