const jwt = require('jsonwebtoken');
const token = {
    encrypt:function(data,time){
        return jwt.sign(data,'token',{expiresIn:time})
    },
    decrypt:function(token){
        try{
            let data = jwt.verify(token,'token');
            console.log("data",data);
            return{
                token:true,
                id:data.id
            };
        } catch(e){
            return{
                token:false,
                data:e
            }
        }
    }

}
module.exports = {token}