# samanage-api

This is my personal helper code for performing API calls to Samanage Helpdesk Service. The code is provided as-is, without any warrenty.
It is a work in progress and may not support all the options offered by the Samanage API
Feel free to contact me with requests, issues or questions.

## Installation
```sh
npm install samanage-api
```

## Making a call
```javascrip
var success = function({data}) {...}
var failure = function({error}) {...}
var SamanageAPI = require('samanage-api')
var connection = new SamanageAPI.Connection(process.env.TOKEN)
var request = ...
var success = function(data) {...}
var failure = function(error) {...}
connection.callSamanageAPI(request).then(success).catch(failure)
```

## Retrieval with filters
```javascript
var get_incidents = SamanageAPI.get('incident')
var request = get_incidents(
  new SamanageAPI.Filters().add({
    sort_order: 'ASC',
    sort_by: 'created_at',
    created: ['2018-01-01','2018-01-02']
  })
)
SamanageAPI.callSamanageAPI(...)
```

### Building filters
```javascript
var get_incidents = SamanageAPI.get('incident')
var filters = new SamanageAPI.Filters().
  sort_by('name').
  sort_order(SamanageAPI.Filter.DESC).
  between_dates('created','2018-01-01','2018-01-02').
  per_page(100).
  page(3)
var request = get_incidents(filters)
```

## Update
```javascript
var request = SamanageAPI.update('incident')(3, {
  name:'opened with samanage-api-js library'
})
```

## Create
```javascript
var request = SamanageAPI.create('incident')({
  name:'opened with samanage-api-js library'
})
```

## help

```javascript
console.log(SamanageAPI.help)
console.log(SamanageAPI.Filters.help)
console.log(SamanageAPI.ItsmStates.help)
console.log(SamanageAPI.Connection.help)
```

## ItsmStates and additional Metadata objects
connection.ItsmStates.init()
connection.ItsmStates.then(function(states) {...})

### define additional metadata objects
connection.addMetadata('Users','user')
connection.Users.init()

### do something when Users and States are both available
Promise.all([connection.ItsmStates, connection.Users]).then(
  function([states, users]) {...}
)



## Migrating from 1.x to 2.x
Changes in version 2.0
- works with promises
- conenction is now instantiated (you can open connections to multiple accounts or mulitple users in same account)
- support for ItsmStates

```javascript
var connection = new SamanageAPI.connection(process.env.TOKEN)
SamanageAPI.callSamanageAPI(connection, request, success, failure)
```
=>
```javascript
var connection = new SamanageAPI.Connection(process.env.TOKEN)
connection.callSamanageAPI(request).then(success).catch(failure)
```
