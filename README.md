bobbuzz
=======

SFDX plugin from Bob Buzzard

[![Version](https://img.shields.io/npm/v/bobbuzz.svg)](https://npmjs.org/package/bobbuzz)
[![Downloads/week](https://img.shields.io/npm/dw/bobbuzz.svg)](https://npmjs.org/package/bobbuzz)
[![License](https://img.shields.io/npm/l/bobbuzz.svg)](https://github.com/keirbowden/sfdx-bobbuzz/blob/master/package.json)

# Installation
`sfdx plugins:install bobbuzz`

# Commands
* [`sfdx bbuzz:gitstamp`](#bobbuzz-bbuzzgitstamp)

## `sfdx bbuzz:gitstamp`

Writes the current Git commit id to a hierarchical custom setting. The custom setting information defined in the `sfdx-project.json` file as follows:

```
"plugins": {
    "bb": {
          "gitSetting" : {
              "settingName" : "Git_Info__c",
              "commitIdField" : "Commit_Id__c"
          }
    }
}
```
where `settingName` defines the name of the custom setting (default is `Git_Info__c`) and `commitIdField` defines the custom setting field to write the commit id to (default is `Commit_Id__c`)

```
USAGE
  $ sfdx bbuzz:gitstamp

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx bbuzz:gitstamp --targetusername myOrg@example.com
     Stamped the Git commit id in the org
```

_See code: [src/commands/bbuzz/gitstamp.ts](https://github.com/keirbowden/sfdx-bobbuzz/blob/v0.0.1/src/commands/bbuzz/gitstamp.ts)_

# License
MIT
