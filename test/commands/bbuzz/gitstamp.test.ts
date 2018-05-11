import { expect, test } from '@salesforce/command/dist/test';

describe('bbuzz:gitstamp', () => {
  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(function() {
      return Promise.resolve({ records: [ { SetupOwnerId: '00D80000000bSy0EAE', Git_Commit_Id__c: '77777777788888666668d5b0f7031979f2d2919b'} ]});
    })
    .stdout()
    .command(['hello:org', '--targetusername', 'test@org.com'])
    .it('runs hello:org --targetusername test@org.com', (ctx) => {
      expect(ctx.stdout).to.contain('Hello world! This is org: Super Awesome Org and I will be around until Tue Mar 20 2018!');
    });
});
