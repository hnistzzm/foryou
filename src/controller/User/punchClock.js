var toHumpFun = require('../../Tools/toHump')
const {exec} = require('../../db/mysql')
var dayjs = require('dayjs')
const {token} = require('../Tools/token')
var dayOfYear = require('dayjs/plugin/dayOfYear')
dayjs.extend(dayOfYear)

const clock =async function(req,res){
    console.log("请求打卡",req.url);
    console.log("*********************************");
    let tokenData = token.decrypt(req.headers.authorization)
    const nowDayInfo  = getNowDayInfo()//获取今天的信息
    const nowMonthInfo = getMonthInfo(nowDayInfo.year,nowDayInfo.month)//获取用户打卡的月份信息
    req.on("data",async function(data){
        const responce = {}
        const Data = {}
        const meta = {}
        const dateMonth = nowDayInfo.year+'-'+nowDayInfo.month
        let mask = [] //每日打卡情况
        let blockTime = []//每日打卡时间
        const querySql = `SELECT user_id
                          FROM clock
                          WHERE
                          user_id='${tokenData.id}' and date_month='${dateMonth}'`       
        /*
            1.如果当前月份不存在签到信息,在数据库中添加此月份的签到数据 
            2.如果当前月份存在签到信息,则只需更新此月份在数据库中的对应签到数据    
        */    
        if(!(await exec(querySql)).length){
            console.log("此用户本月不存在签到信息");
            console.log("*****************************");
            mask = new Array(nowMonthInfo.monthDays).fill(0);
            mask[nowDayInfo.day-1] = '1'
            blockTime = new Array(nowMonthInfo.monthDays).fill(0);
            blockTime[nowDayInfo.day-1] = dayjs().format('H:mm')+''
            const addClockSql = `INSERT INTO clock (user_id,date_month,mask,block_time)
                                 VALUES
                                 ('${tokenData.id}','${dateMonth}','${mask}','${blockTime}')`

            await exec(addClockSql)
        }else{
            console.log("此用户本月存在签到信息");
            console.log("*****************************");
            const getMaskSql = `SELECT mask,block_time,id FROM clock
                                WHERE
                                user_id='${tokenData.id}' and date_month='${dateMonth}'`

            const clockInfo = (await exec(getMaskSql))[0]
            mask = clockInfo.mask.split(',')
            blockTime=clockInfo.block_time.split(',')
            const clockId = clockInfo.id
            mask[nowDayInfo.day-1] = '1'
            blockTime[nowDayInfo.day-1] = dayjs().format('H:mm')+''
            const updateClockSql = `UPDATE clock SET mask='${mask}',block_time='${blockTime}'
                                    WHERE id='${clockId}'`

            await exec(updateClockSql)
        }
        const addIntegralSql = `UPDATE user SET integral=integral+100
                                WHERE user_id='${tokenData.id}'`

        await exec(addIntegralSql)
        //将本月信息push进数组
        const monthClockInfo = []
        for (let i = 0; i <nowMonthInfo.firstDayOfMonth ; i++) {
            monthClockInfo.push({year:'',month:'',day:'',isClock:''})
        }
        mask.forEach((item,index)=> {
            monthClockInfo.push({year:nowDayInfo.year,month:nowDayInfo.month,day:index+1,isClock:item})
        });
        Data['monthClockInfo'] = monthClockInfo
        meta['status'] = 201
        responce['data'] = Data
        responce['meta'] = meta
        res.send(responce)   
    })
}
const getClockInfo = (req,res)=>{
    console.log("请求获取当月打卡信息",req.url)
    console.log("***************************");    
    req.on("data",async function(data){ 
        const responce = {}
        const Data = {}
        const meta = {}
        let tokenData = token.decrypt(req.headers.authorization)
        const currentMonth = JSON.parse(data).currentMonth
        const nowDayInfo  = getNowDayInfo()//获取今天的信息
        nowDayInfo['isClockToday'] = 0
        const nowMonthInfo = getMonthInfo(currentMonth.year,currentMonth.month)//获取用户选中的月份的信息
        const dateMonth = currentMonth.year+'-'+currentMonth.month //用于向数据库查找符合当前日期的数据
        let mask = [] //每日打卡情况
        const monthClockInfo = []
        
        const querySql =   `SELECT mask
                            FROM clock
                            WHERE
                            user_id='${tokenData.id}' and date_month='${dateMonth}'`

        //如果当前月份不存在签到信息          
        if(!(await exec(querySql)).length){
            console.log("此用户本月不存在签到信息");
            console.log("*****************************");
            for (let i = 0; i <nowMonthInfo.firstDayOfMonth; i++) {
                monthClockInfo.push({year:'',month:'',day:'',isClock:''})
            }
            for (let i = 1; i <=nowMonthInfo.monthDays; i++) {
                monthClockInfo.push({year:currentMonth.year,month:currentMonth.month,day:i,isClock:'0'})
            }
            //如果当前月份用户不存在签到信息,将状态码设置为0
            Data['monthClockStatus'] = 0
        }else{
            console.log("此用户本月存在签到信息");
            console.log("*****************************");
            const getMaskSql = `SELECT mask,id FROM clock
                                WHERE
                                user_id='${tokenData.id}' and date_month='${dateMonth}'`

            const clockInfo = (await exec(getMaskSql))[0]
            mask = clockInfo.mask.split(',')
            for (let i = 0; i <nowMonthInfo.firstDayOfMonth ; i++) {
                monthClockInfo.push({year:'',month:'',day:'',isClock:''})
            }
            mask.forEach((item,index)=> {
                monthClockInfo.push({year:currentMonth.year,month:currentMonth.month,day:index+1,isClock:item})
            });
            //如果当前月份用户存在签到信息,将状态码设置为1
            Data['monthClockStatus'] = 1
        }
            /*
                发送给前端的数据:
                    1.monthClockInfo:当前月份每天的签到数据
                    2.nowMonthInfo:当前月份的信息,包括monthDays(月份的总天数),firstDayOfMonth(月份的第一天是星期几)
                    3.nowDay:用户发起请求的当天的信息,包括year,month,day,以及当天是否打卡
            */
            Data['monthClockInfo'] = monthClockInfo
            Data['nowMonthInfo'] = nowMonthInfo
            // Data['nowDay'] = nowDayInfo
            meta['status'] = 201
            responce['data'] = Data
            responce['meta'] = meta
            res.send(responce) 
    })

}
const getClockStateToday = async function(req,res){
    console.log("请求获取今日打卡状态");
    console.log("***********************");
    const responce = {}
    const Data = {}
    const meta = {}
    let mask;
    let blockTime;
    let blockState;
    let blockTimeToday;
    const nowDayInfo  = getNowDayInfo()//获取今天的信息
    const tokenData = token.decrypt(req.headers.authorization);
    const dateMonth = nowDayInfo.year+'-'+nowDayInfo.month
    const querySql =   `SELECT mask,block_time
                        FROM clock
                        WHERE
                        user_id='${tokenData.id}' and date_month='${dateMonth}'`
                        
    let clockInfo = await exec(querySql)
    console.log('clockInfo',JSON.stringify(clockInfo));
    if(clockInfo.length){
        mask =clockInfo[0].mask.split(',')
        blockTime=clockInfo[0].block_time.split(',')
        blockState = mask[nowDayInfo.day-1]
        blockTimeToday = blockTime[nowDayInfo.day-1]
    }else{
        blockState = '0'
    }

    if(blockState == '1'){
        Data['blockTime'] = blockTimeToday
    }
    Data['blockState'] = blockState
    meta['status'] = 201
    responce['data'] = Data
    responce['meta'] = meta
    console.log(responce);
    res.send(responce)

}
/*
    1.获取今天的年
    2.获取今天的月
    3.获取今天的日
    4.获取本月的第一天是星期几
    5.获取本月有多少天

*/
function getNowDayInfo(){
    console.log(dayjs().dayOfYear());
    let nowYear = dayjs().year()
    let nowMonth = dayjs().month()+1
    let nowDay = dayjs().date()
    return {year:nowYear,month:nowMonth,day:nowDay}
}
function getMonthInfo(year,month){
    let monthDays = dayjs(`${year}-${month}-01`).daysInMonth()
    let firstDayOfMonth =   dayjs(`${year}-${month}-01`).day()
    console.log("本月的天数",monthDays);
    return {monthDays:monthDays,firstDayOfMonth:firstDayOfMonth}
}


module.exports = {clock,getClockInfo,getClockStateToday}