/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as os from 'os';

import { flags, FlagsConfig } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { SObject, SObjectResult } from '@salesforce/data';
import { DataCommand } from '../../../../dataCommand';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-data', 'record.create');
const commonMessages = Messages.loadMessages('@salesforce/plugin-data', 'messages');

export default class Create extends DataCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);
  public static readonly requiresUsername = true;

  public static readonly flagsConfig: FlagsConfig = {
    sobjecttype: flags.string({
      char: 's',
      required: true,
      hidden: false,
      description: messages.getMessage('sObjectType'),
    }),
    values: flags.string({
      char: 'v',
      required: true,
      hidden: false,
      description: messages.getMessage('values'),
    }),
    usetoolingapi: flags.boolean({
      char: 't',
      required: false,
      hidden: false,
      description: messages.getMessage('useToolingApi'),
    }),
    perflog: flags.boolean({
      description: commonMessages.getMessage('perfLogLevelOption'),
      longDescription: commonMessages.getMessage('perfLogLevelOptionLong'),
    }),
  };

  public async run(): Promise<SObjectResult> {
    this.ux.startSpinner(`Creating record for ${this.flags.sobjecttype as string}`);
    const sobject = new SObject({
      connection: await this.getConnection(),
      sObjectType: this.flags.sobjecttype,
      useToolingApi: this.flags.usetoolingapi,
    });
    const result = await sobject.insert(this.flags.values);
    if (result.success) {
      this.ux.log(messages.getMessage('createSuccess', [result.id || 'unknown id']));
    } else {
      const errors = this.collectErrorMessages(result);
      this.ux.error(messages.getMessage('createFailure', [errors]));
    }
    this.ux.stopSpinner();
    return result;
  }
}
