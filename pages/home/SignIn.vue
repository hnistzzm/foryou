<template>
  <div>
	<page-meta :root-font-size="fontSize"></page-meta>	
	 <u-navbar back-text="返回" title="每日打卡" :custom-back="backPage"></u-navbar>
    <div class="top-title">
	  <div><span>{{currentMonth.year}}年{{currentMonth.month}}月</span></div>
	  <div class="month-change-btn-grounp">
		  <div class="month-change-btn" @click="lastMonth">
			  <u-icon 
				  size="25" 
				  name="arrow-left">
			  </u-icon>
		  </div>
		  <div class="month-change-btn" @click="nextMonth">
				  <u-icon 
					  size="25" 
					  name="arrow-right">
				  </u-icon>
		  </div>
	  </div>
		  
	</div>
	<div class="calendar-card">
		<div 
			class="container" 
			style="border-bottom: 1px solid #cccccc;
			color: #999999;font-size: 0.6rem;
			padding: 0 1vh 0 1vh">
			<div v-for="(item,index) in weeks" :key="index">{{ item }}</div>
		</div>
		<div class="container" style="padding: 1vh 1vh 3vh 1vh;margin-bottom: 1rem;">
			<div v-for="(item,index) in dayInfo" :key="index">
				<div v-if="compareToNow(item) === 0" class="date-num clocked-in " >{{ item.day }}</div>
				<div v-if="compareToNow(item) === 1" class="date-num ">{{ item.day }}</div>
				<div v-if="compareToNow(item) === -1" class="date-num" :class="item.isClock==='1'?'clocked-in':'not-clocked-in'">
				  <div>{{ item.day }}</div>
				</div>
			</div>
		</div>
	</div>
	
   
	<u-button class="sigin-btn" hair-line ripple @click="punchClock" :style="{backgroundColor:(blockState=='0'?'rgb(255,235,66)':'skyblue')}">
		<span  v-show="blockState=='0'">打卡</span>
		<u-image v-show="blockState=='1'" :src="'../../static/icon/right.png'" :key="2"  width="50px" height="50px"></u-image>
	</u-button>
	
	
  </div>
</template>


<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
	  show:true,
      today:new Date(),
      weeks:["SUN","MON","TUE","WED","THU","FRI","SAT"],
      firstDay:'',
	  blockState:'0',
      dayInfo:[],
	  nowTime:{
		  year:'',
		  month:'',
		  day:'',
		  isClockToday:0
	  },
	  currentMonth:{
		  year:(new Date).getFullYear(),
		  month:(new Date).getMonth()+1
	  },
	  
    }
  },
  onLoad() {
    this.userId = uni.getStorageSync('userId')
    this.getClockInfo()
	this.getClockStage()
  },
  methods:{
	async getClockInfo(){
		console.log("获取的userId",JSON.stringify(this.userId));
		console.log("currentmonth",JSON.stringify(this.currentMonth) );
		// const {data:res} = await this.$http.post('/getClockInfo',{userId:uni.getStorageSync('userId'),currentMonth:this.currentMonth})
		const responce = await this.$http('post',{currentMonth:this.currentMonth},'/getClockInfo')
		const res = responce[1].data
		console.log(res);
		if(res.meta.status===201){
			 this.dayInfo = res.data.monthClockInfo 
			 this.firstDay = res.data.nowMonthInfo.firstDayOfMonth
			 this.nowTime = res.data.nowDay
		}
	},
	async punchClock(){
		 if(this.blockState=='1') return
		 console.log(uni.getStorageSync('userId'));
		  // const {data:res} = await this.$http.post('/punchClock',{userId:uni.getStorageSync('userId')})
		  const responce = await this.$http('post',{},'/punchClock')
		  const res = responce[1].data
		  console.log(res);
		  if(res.meta.status===201){
			this.dayInfo = res.data.monthClockInfo
			this.show=false
			uni.showToast({
				title: '打卡成功!',
				duration: 2000
			});
		  }
		  
	 },
	 async getClockStage(){
	 	let responce =await this.$http('post',{},'/getClockState')  
	 	const res = responce[1].data
	 	console.log(responce);
	 	if(this.checkReq(res.meta.status)){
	 		this.blockState = res.data.blockState
	 		this.blockTime = res.data.blockTime
	 		console.log("clockState",this.clockState);
	 	}
	 },

	//切换到上月
    lastMonth(){
	  console.log(JSON.stringify(this.currentMonth) );
	  let tempDate = new Date()
	  tempDate.setYear(this.currentMonth.year)
	  tempDate.setMonth(this.currentMonth.month - 2)
	  this.currentMonth.year = tempDate.getFullYear()
	  this.currentMonth.month = tempDate.getMonth()+1
	  console.log(JSON.stringify(this.currentMonth) );
	  this.getClockInfo()
	  
    },
	//切换到下月
    nextMonth(){
      console.log(JSON.stringify(this.currentMonth) );
      let tempDate = new Date()
      tempDate.setYear(this.currentMonth.year)
      tempDate.setMonth(this.currentMonth.month)
      this.currentMonth.year = tempDate.getFullYear()
      this.currentMonth.month = tempDate.getMonth()+1
      console.log(JSON.stringify(this.currentMonth) );
	  this.getClockInfo()
    },
    compareToNow(item){
      if (item.year && item.month && item.day) {
		//获取日历中的时间,并将时、分、秒设置成0,防止判断时时间不匹配
        let date1 = new Date();
        date1.setFullYear(item.year)
        date1.setMonth(item.month - 1)
        date1.setDate(item.day)
        date1.setHours(0)
        date1.setMinutes(0)
        date1.setSeconds(0)
		//获取当前时间,并将时、分、秒设置成0,防止判断时时间不匹配
        let now = new Date();
        now.setHours(0)
        now.setMinutes(0)
        now.setSeconds(0)
		/*
			1.如果日历中的日期大于当前日期 return  1
			2.如果日历中的日期等于当前日期 return  0
			3.如果日历中的日期小于当前日期 return -1
		*/
        if (date1.getTime() > now.getTime()){
          return 1
        }else if (date1.getTime() === now.getTime()){
          return 0
        }else if (date1.getTime() < now.getTime()){
          return -1
        }
      }
    },
	backPage(){
		uni.redirectTo({
			url:'./HomeCenter'
		})
	}
  }
}
</script>


<style scoped Lang="less">
	page{
		background-color: rgb(51,49,82);
	}
  .top-title{
   display: flex;
   justify-content: space-between;
   padding: 0.5rem 1rem 0.5rem 1rem;
   /* border: 1px solid red; */
  }
  .top-title span{
	  font-size: 1rem;
	  font-weight: 600;
	  color: #FFFFFF;

  }
  .month-change-btn-grounp{
	  display: flex;
	  width: 3rem;
	  justify-content: space-between;
  }
  .month-change-btn{
	  width: 1.2rem;
	  height: 1.2rem;
	  background-color: #FFFFFF;
	  border-radius: 50%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  
  }
  .calendar-card{
	  padding-top: 0.5rem;
	  padding-bottom: 0.5rem;
	  width: 90%;
	  margin: 0 auto;
	  border-radius: 15px;
	  background-color: #FFFFFF;
	   box-shadow: 0 1px 5px #999999;
  }
  .container{
    display: grid;
    grid-template-columns:repeat(7,1fr);
    grid-auto-rows:30px;
    grid-gap:0.8rem;
    background-color: #FFFFFF;
    line-height: 30px;
	text-align: center;
    div{
      text-align: center;
    }
  }

  .link{
    font-size: 14px;
    color: #2d8cf0;
  }
  .date-desc{

    display: block;
    position: absolute;
    top: 6.8vw;
    left: 1.5vw;
    font-size: 2.3vw;
    color: green;
  }
  .date-num{
	  width: 1.5rem;
	  height: 1.5rem;
	  border-radius: 50%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
  }
  .today{
  	border: 1px solid rgb(73,103,177);
  }
  /* 完成打卡 */
  .clocked-in{
	  color: #FFFFFF;
	  background-color: rgb(14,79,222);
  }
  /* 缺卡 */
  .not-clocked-in{
	   background-color: rgb(242,245,250);
  }
  .sigin-btn{
	  
	  width: 6rem;
	  height: 6rem;
	  border-radius: 50%;
	  margin: 0 auto;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  font-size: 1.5rem;
	  font-weight: 600;
	  color: rgb(178,102,22);
  }
  
</style>

