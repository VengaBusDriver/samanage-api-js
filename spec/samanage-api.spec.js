jest.setTimeout(120000)
process.on('unhandledRejection', function(error, promise) {
    console.error('UNHANDLED REJECTION - Promise: ', promise, ', Error: ', error, ').');
});
SamanageAPI = require('../samanage-api.js')
if (typeof process.env.TOKEN == 'undefined') throw 'Error: for tests api token must be set using "export TOKEN=" shell command to account #5 in production'

var connection = new SamanageAPI.Connection(process.env.TOKEN, 'https://api.samanage.com')

//SamanageAPI.debug = true
var get_incidents = SamanageAPI.get('incident')
var Users = connection.getter('user')
var ItsmStates = connection.getter('itsm_state')
/*
Users.then(function(users) {
  console.log(Object.keys(users).map(x=>(users[x].email)))
})
*/

test('Users & States', () => {
  return Promise.all([ItsmStates, Users]).then(function([states, users]) {
    expect(states['15']).toHaveProperty('value', 'Awaiting Input')
    expect(states['15']).toHaveProperty('itsm_type', 'Incident')
    expect(users['3108123']).toHaveProperty('email', 'aviran.hayun+1@samanage.com')
  })
})

test('create Incident', ()=>{
  const name = 'opened with samanage-api-js library promises ' + Date.now()
  return expect(connection.callSamanageAPI(
    SamanageAPI.create('incident')({ name: name })
  )).resolves.toHaveProperty('data.name', name)
})

test('Incident which does not exist return 404', ()=>{
  return expect(connection.callSamanageAPI(
    SamanageAPI.update('incident')(3, {
      name:'opened with samanage-api-js library'
    })
  )).rejects.toHaveProperty('httpStatus', 404)
})


var get_incidents = SamanageAPI.get('incident')

test('Get incidents created between dates', ()=>{
  return expect(connection.callSamanageAPI(
    get_incidents(
      new SamanageAPI.Filters().add({
        sort_order: 'ASC',
        sort_by: 'created_at',
        created: ['2018-01-01','2018-01-02']
      })
    )
  )).resolves.toHaveProperty('data')
})

test('Get incidents created between dates with pagination', ()=>{
  return connection.callSamanageAPI(
    get_incidents(
      new SamanageAPI.Filters().
        sort_by('name').
        sort_order(SamanageAPI.Filters.DESC).
        between_dates('created','2018-01-01','2018-01-02').
        per_page(25).
        page(1)
    ),
    'REF'
  ).then(function(data) {
    //console.log(data)
    expect(data).toEqual(
      expect.objectContaining({
        'ref': expect.stringContaining('REF'),
        'data': expect.arrayContaining([
          expect.objectContaining({'id':expect.anything()})
         ])
      })
    )
  })
})

test('Users', (done) => {
  Users.then(function(users) {
    //console.log(Object.keys(users).map(x=>(users[x].email)))
    expect(users['81']).toHaveProperty('email', 'michael@samanage.com')
    done()
  })
})

/*
describe('help', function() {
  console.log(SamanageAPI.help)
  console.log(SamanageAPI.Filters.help)
  console.log(SamanageAPI.Connection.help)
})
*/
