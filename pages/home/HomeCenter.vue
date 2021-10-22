<template>
	<view class="container">
		<view class="top-info">
			<view class="user-info">
				<!-- <div class="user-info-pri">
					<u-image  height="2rem" width="2rem" :src="src" shape="circle"></u-image>
					<p>张振明</p>
				</div>
				<p>积分:666</p> -->
				<u-image  height="2rem" width="2rem" :src="src" shape="circle"></u-image>
				<div class="user-info-pri">
					<p>张振明张振明张振明</p>
					<span class="user-info-pri-clock">连续签到120天</span>
					<!-- <text>sss</text> -->
				</div>
			</view>
<!-- 			<view class="btn-grounp">
				<u-button type="primary" shape="circle" @click="punchClockRouter">打卡</u-button>
				<u-button type="primary" shape="circle" @click="getWeatherInfo">天气</u-button>
			</view> -->
		</view>
		<view class="options-box">
			<ul class="option-lists">
				<li class="option-item">
					<u-image
						height="2rem"
						width="2rem"
						:src="'../../static/icon/signin.png'"
						class="option-item-image">
					</u-image>
					打卡
				</li>
				<li class="option-item">
					<u-image 
						height="2rem"
						width="2rem"
						:src="'../../static/icon/luckdraw.png'"
						class="option-item-image">
					</u-image>
					抽奖
				</li>
				<li class="option-item" @click="getWeatherInfo">
					<u-image 
						height="2rem"
						width="2rem"
						:src="'../../static/icon/weather.png'"
						class="option-item-image">
					</u-image>
					天气
				</li>
			</ul>
		</view>
		<view class="home-card">
			<u-image 
			width="100vw"
			height="75vh"
			:src="'../../static/photo/homecard.jpg'">
				
			</u-image>
		</view>
		<u-modal v-model="show" title="今日天气">
			城市:{{weatherInfo.cityName}}
			天气:{{weatherInfo.tq}}
			天气:{{weatherInfo.qw}}
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
	border: 1px solid red;
}
.option-lists{
	/* width: 100%; */
	border: 1px solid yellow;
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
	width: 100%;
	bottom: 0;
	height: 75vh;
	border: 1px solid red;
	background-color: #FFFFFF;
	border-radius: 20px;
	
}


	
</style>
