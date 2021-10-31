
var express = require('express');
var router = require('./routes/index')
const {token} = require('./src/controller/Tools/token')
var path = require('path');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*') //允许所有不同源的地址访问
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization') //Content-Type必须要设置，Authorization是用户登录注册时存入的token值，可根据需求来设置，还有其他的都需要用逗号隔开
	res.header('Access-Control-Allow-Credentials', true) // 这个必须要设置，否则解决跨域无效，注意true是字符串
	next()
})
app.use((req,res,next)=>{
    let responce={}
	let meta={} 
	console.log(req.url);
	//如果携带了authorization参数，检查token是否正确
    if(req.headers.authorization){
        console.log("携带了token参数");
        let tokenData = token.decrypt(req.headers.authorization)
        if(tokenData.token){
				next()
        }else{
            meta['status'] = 200
            meta['msg'] = 'token不正确' 
            responce['meta']=meta
            res.send(responce)
        }
    }else{
        console.log("未携带token参数");
        if(req.url == '/login'){
            next()
        }else{
            meta['status'] = 200
            meta['msg'] = '未登录' 
            responce['meta']=meta
            res.send(responce)
        }
      
    }
}
)


router.route(app)

var server = app.listen(9001, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("Node.JS 服务器已启动，访问地址： http://%s:%s", host, port)

})

module.exports = app;
