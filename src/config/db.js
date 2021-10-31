const env = process.env.NODE_ENV
let MYSQL_CONF
MYSQL_CONF = {
    host:'localhost',
    user:'root',
    password: 'zzm20020615',
    database: 'foryousql',
    port: 3306
}
module.exports = {
    MYSQL_CONF
}