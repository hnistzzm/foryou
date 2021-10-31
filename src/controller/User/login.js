var toHumpFun = require('../../Tools/toHump')
const {exec} = require('../../db/mysql')
const {token} = require('../Tools/token')
const login =async function(req,res){
    console.log("请求登录",req.url);
    console.log("*********************************");
    req.on("data",async function(loginInfo){
        const responce = {}
        const data = {}
        const meta = {}
        const LoginInfo =JSON.parse(loginInfo)
        console.log("logininfo",LoginInfo);
        const loginSql = `select user_id,user_name,integral from user where user_name = '${LoginInfo.userName}' and pass_word = '${LoginInfo.passWord}' `
        const userInfo = await exec(loginSql)
        console.log("获取到的用户信息",userInfo);
        if(userInfo.length){
            let Token =token.encrypt({id:userInfo[0].user_id},'15d')//设置token令牌有效时间为15天
            data['userInfo'] = toHumpFun(userInfo[0])
            data['Token'] = Token
            meta['status'] = 201
            responce['data'] = data
            responce['meta'] = meta
            res.send(responce)
        }else{
            meta['status'] = 200
            responce['meta'] = meta
            res.send(responce)
        }
        
    })

}
module.exports = login