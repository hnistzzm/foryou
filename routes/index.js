var Login = require('../src/controller/User/login')
var Clock = require('../src/controller/User/punchClock')
var exchange = require('../src/controller/Home/exchange')
var route = function(app){
  app.post('/login',Login)
  app.post('/punchClock',Clock.clock)
  app.post('/getClockInfo',Clock.getClockInfo)
  app.post('/getClockState',Clock.getClockStateToday)
  app.post('/exchange',exchange)
}
exports.route = route;
