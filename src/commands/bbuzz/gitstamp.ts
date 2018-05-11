import {flags} from '@oclif/command';
import {SfdxCommand, core} from '@salesforce/command';
import * as _ from 'lodash';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('bobbuzz', 'gitstamp');

export default class Org extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx bbuzz:gitstamp --targetusername myOrg@example.com
  Stamped the Git commit id in the org
  `
  ];

  public static args = [];

  protected static flagsConfig = {
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  //protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const projectJson = await this.project.retrieveSfdxProjectJson();
    const settingConfig = _.get(projectJson.get('plugins'),'bb.gitSetting');
    const settingName=settingConfig.settingName || 'Git_Info__c';
    const commitIdField=settingConfig.commitIdField || 'Commit_Id__c';

    const conn = this.org.getConnection();
    const orgId=this.org.getOrgId();

    const query = 'Select Id, SetupOwnerId, ' + commitIdField + ' from ' + settingName + ' where SetupOwnerId = \'' + orgId + '\'';

    interface Setting{
      Id? : string,
      SetupOwnerId : string,
      [key: string] : string
    }

    this.ux.log('Querying the current setting');

    // Query the setting to see if we need to insert or update
    const result = await conn.query<Setting>(query);

    let settingInstance : Setting;
    settingInstance={"SetupOwnerId": orgId};

    if (result.records && result.records.length > 0) {
      settingInstance.Id=result.records[0].Id
    }
    
    this.ux.log('Done');

    const util=require('util');
    const exec=util.promisify(require('child_process').exec);

    const {error, stdout, stderr} = await exec('git rev-parse HEAD');

    const commitId=stdout.trim();
        
    settingInstance[commitIdField]=commitId;

    this.ux.log('Writing the commit id');

    let opResult;
    if (settingInstance.Id) {
      opResult=await conn.sobject(settingName).update(settingInstance);
    }
    else {
      opResult=await conn.sobject(settingName).insert(settingInstance);
    }

    this.ux.log('Done');

    if (!opResult.success) {
      this.ux.log('Error updating commit id' + JSON.stringify(opResult.errors));
    }
    else {
      this.ux.log('Stamped the Git commit id in the org');
    }
    
    // Return an object to be displayed with --json

    return { orgId: this.org.getOrgId(), commitId: commitId, success: opResult.success, errors: opResult.errors };
  }
}
