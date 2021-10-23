<template>
	<view class="container">
		<view class="top-info">
			<view class="user-info">
				<u-image  height="2rem" width="2rem" :src="src" shape="circle"></u-image>
				<div class="user-info-pri">
					<p>张振明张振明张振明</p>
					<span class="user-info-pri-clock">积分: <span style="color:rgb(249,231,0) ;">800</span></span>
				</div>
			</view>
		</view>
		<view class="options-box">
			<ul class="option-lists">
				<li class="option-item" @click="punchClockRouter">
					<u-image
						height="2rem"
						width="2rem"
						:src="'../../static/icon/signin.png'"
						class="option-item-image">
					</u-image>
					<span>打卡</span>
				</li>
				<li class="option-item">
					<u-image 
						height="2rem"
						width="2rem"
						:src="'../../static/icon/luckdraw.png'"
						class="option-item-image">
					</u-image>
					<span>抽奖</span>
				</li>
				<li class="option-item" @click="getWeatherInfo">
					<u-image 
						height="2rem"
						width="2rem"
						:src="'../../static/icon/weather.png'"
						class="option-item-image">
					</u-image>
					<span>天气</span>
				</li>
				<li class="option-item" @click="exchangeGiftsRouter">
					<u-image 
						height="2rem"
						width="2rem"
						:src="'../../static/icon/gift.png'"
						class="option-item-image">
					</u-image>
					<span>兑奖</span>
				</li>
			</ul>
		</view>
		<view class="home-card">
			<div class="home-card-container">
				<div class="now-date">
					<p style="font-size: 1.5rem;">11</p>
					<p style="font-size: 0.7rem;">2020.03</p>
				</div>
				
				<div class="getup-time">
					<p style="color: #FFFFFF;font-size: 0.6rem;">今日早起</p>
					<p style="color:rgb(249,231,0);font-size: 1.5rem;">8:30</p>
				</div>
				<button class="signin-ime-btn">
					<u-icon name="map"></u-icon>
					<span>立即打卡</span>
				</button>
			</div>
		</view>
		<u-modal v-model="show" title="今日天气">
			城市:{{weatherInfo.cityName}}
			天气:{{weatherInfo.tq}}
			气温:{{weatherInfo.qw}}
			风力:{{weatherInfo.fl}}
		</u-modal>
	</view>
</template>

<script>
	import '../../global/js/rem.js'
	export default{
		data() {
			return {
				src: '../../static/photo/boy.jpg',
				text:'456',
				show:false,
				weatherInfo:{
					cityName:'',
					tq:'',
					qw:'',
					fl:''
				}
			}
		},
		methods: {
			async getWeatherInfo(){
				const {data:res} =await this.$http.get('http://api.yytianqi.com/observe?city=CH250201&key=8pl5iguhg14kqffp')  
				console.log(res);
				if(res.code === 1){
					this.weatherInfo.cityName = res.data.cityName
					this.weatherInfo.tq = res.data.tq
					this.weatherInfo.qw = res.data.qw
					this.weatherInfo.fl = res.data.fl
				}
				this.show = true
			},
			punchClockRouter(){
				uni.navigateTo({
					url:'./SignIn'
				})
			},
			exchangeGiftsRouter(){
				uni.navigateTo({
					url:'./ExchangeGifts'
				})
			}
		},
		
	}
</script>

<style scoped Lang="less">
*{
	padding: 0;
	margin: 0;
}
.container{
	height: 100%;
	background-color: rgb(51,49,82);
}	
.top-info{
	height: 10vh;
	display: flex;
	justify-content: space-between;
}
.user-info{
	width: 10rem;
	height: 3rem;
	margin-top: 1rem;
	color: #FFFFFF;
	border-radius: 10px;
	box-shadow: 0px 0px 10px black;
	position: relative;
	display: flex;
	align-items: center;
	margin-left: 1rem;
}
.user-info-pri{
	margin-left: 1rem;
}
.user-info-pri-clock{
	/* border: 1px solid red; */
	font-size: 12px;
	padding:0 0.3rem 0 0.3rem ;
	border-radius: 10px;
	background-color: rgb(70,76,130);
	
	
}
.btn-grounp{
	display: flex;
}
.options-box{
	margin-top: 3vh;
	height: 10vh;
	width: 100%;
	/* border: 1px solid red; */
}
.option-lists{
	height: 100%;
	color: #FFFFFF;
	list-style: none;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.option-item{
	width: 3rem;
	height: 3rem;
	/* border: 1px solid red; */
	text-align: center;	
}
.option-item-image{
	margin: 0 auto;
}
.home-card{
	position: absolute;
	width:100vw;
	height:75vh;
	bottom: 0;
	height: 75vh;
	border: 1px solid red;
	background-color: #FFFFFF;
	border-radius: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.home-card-container{
	width: 95vw;
	height: 70vh;
	border-radius: 20px;
	background: url('../../static/photo/homecard.jpg');
	position: relative;
}
.now-date{
	color: #FFFFFF;
	font-weight: 600;
	position: absolute;
	top: 5%;
	right: 5%;
}
.getup-time{
	position: absolute;
	left: 5%;
	top: 40%;
	text-align: center;
}
.signin-ime-btn{
	width: 8rem;
	border: none;
	border-radius: 20px;
	background-color:rgb(249,231,0) ;
	font-size: 0.8rem;
	position: absolute;
	left: 50%;
	bottom: 20%;
	transform: translate(-50%,-50%);
}
	
</style>
