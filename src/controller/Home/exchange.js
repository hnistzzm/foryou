var toHumpFun = require('../../Tools/toHump')
const {exec} = require('../../db/mysql')
const {token} = require('../Tools/token')
const exchange =async function(req,res){
    console.log("请求兑换礼品",req.url);
    console.log("*********************************");
    req.on("data",async function(data){
        const responce = {}
        const Data = {}
        const meta = {}
        let tokenData = token.decrypt(req.headers.authorization)
        const giftIntegral = JSON.parse(data).currentGiftIntegral
        console.log("giftIntegral",giftIntegral);
        console.log(tokenData.id);
        const exchangeQuerySql = `SELECT integral FROM user
                                  WHERE user_id=${tokenData.id}`
        const userIntegral = (await exec(exchangeQuerySql))[0].integral
        console.log("userIntegral",JSON.stringify(userIntegral));
        if(userIntegral>=giftIntegral){//如果积分足够
            const exchangeGiftSql = `UPDATE user SET integral=integral-${giftIntegral}
                                     WHERE user_id=${tokenData.id}`
            await exec(exchangeGiftSql)
            Data['userIntegral'] = userIntegral-giftIntegral
            Data['exchangeStatus'] = 1
        }else{
            
            Data['userIntegral'] = userIntegral
            Data['exchangeStatus'] = 0
        }
        meta['status'] = 201
        responce['data'] = Data
        responce['meta'] = meta
        res.send(responce)
        
    })

}
module.exports = exchange