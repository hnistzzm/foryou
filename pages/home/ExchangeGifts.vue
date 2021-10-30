<template>
	<view>
		<u-navbar back-text="返回" title="兑换礼品" :custom-back="backPage"></u-navbar>
		<view class="user-inergral-view">
			<view class="user-inergral-box">
				<u-image
					width="1rem"
					height="1rem"
					:src="'../../static/icon/coin.png'">
				</u-image>
				<span>{{userIntergral}}</span>
			</view>
		</view>
		
		<u-waterfall v-model="flowList" ref="uWaterfall" class="gift-lists">
			<template v-slot:left="{leftList}">
				<view class="gift-card" v-for="(item, index) in leftList" :key="index">
					<u-image
						width="100%"
						height="80%"
						:lazy-load="true"
						mode="scaleToFill"
						:src="'../../static/photo/gift_milktea.jpeg'" 
						class="gift-image">
					</u-image>
					<view class="gift-title">
						{{item.title}}
					</view>
					<view class="gift-exchange">
						<div class="gift-price">
							<u-image 
							width="1rem"
							height="1rem"
							:src="'../../static/icon/coin.png'">
							</u-image>
							<span>{{item.price}}</span>
						</div>
						
						<button class="exchange-btn" @click="exchangeGiftShow=true,currentGiftIntegral=item.price">兑换</button>
					</view>
				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="gift-card" v-for="(item, index) in rightList" :key="index">
					<u-image 
						width="100%"
						height="80%"
						:lazy-load="true"
						mode="scaleToFill"
						:src="item.image" 
						class="gift-image">
					</u-image>
					<view class="gift-title">
						{{item.title}}
					</view>
					<view class="gift-exchange">
						<div class="gift-price">
							<u-image 
								width="1rem"
								height="1rem"
								:src="'../../static/icon/coin.png'">
							</u-image>
							<span>{{item.price}}</span>
						</div>
						<button class="exchange-btn" @click="exchangeGiftShow=true,currentGiftIntegral=item.price">兑换</button>
					</view>
					<u-modal 
						title="兑换礼品"
						v-model="exchangeGiftShow"
						show-cancel-button
						@confirm="exchangeGift">
						<view class="slot-content exchange-confirm-view">
							<u-image
								width="5rem"
								height="5rem"
								:src="'../../static/photo/gift_milktea.jpeg'">
							</u-image>
							<p>您确定使用<span style="color: rgb(227, 208, 0);">100积分</span>兑换<span>奶茶一杯吗?</span></p>
						</view>
					</u-modal>	
				</view>
			</template>
		</u-waterfall>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				currentGiftIntegral:0,
				userIntergral:0,
				exchangeGiftShow:false,
				tabLists:[{
					name: '全部礼品'
				}, {
					name: '待付款'
				}, {
					name: '待评价',
					count: 5
				}],
				flowList: [],
				loadStatus: 'loadmore',
				flowList: [],
				list: [
					{
						price: 100,
						title: '奶茶一杯',
						image: '../../static/photo/gift_milktea.jpeg',
					},
					{
						price: 100,
						title: '奶茶一杯',
						image: '../../static/photo/gift_milktea.jpeg',
					},
					{
						price: 100,
						title: '奶茶一杯',
						image: '../../static/photo/gift_milktea.jpeg',
					},
				],
			}
		},
		onLoad() {
			this.userIntergral = uni.getStorageSync('userInfo').integral
			this.addRandomData();
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			// 模拟数据加载
			setTimeout(() => {
				// this.addRandomData();
				this.loadStatus = 'loadmore';
			}, 1000)
		},
		methods: {
			addRandomData() {
				for(let i = 0; i < 3; i++) {
					let index = this.$u.random(0, this.list.length - 1);
					// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
					let item = JSON.parse(JSON.stringify(this.list[index]))
					item.id = this.$u.guid();
					this.flowList.push(item);
				}
			},
			async exchangeGift(){
				console.log("current",this.currentGiftIntegral);
				// const {data:res} = await this.$http.post('/exchange',this.currentGiftIntegral)
				const responce = await this.$http('post',{currentGiftIntegral:this.currentGiftIntegral},'/exchange')
				const res = responce[1].data
				console.log(res);
				if(this.checkReq(res.meta.status)){
					if(res.data.exchangeStatus){
						this.userIntergral = res.data.userIntegral
						uni.setStorageSync('userInfo',
						{userId:this.userInfo.userId,userName:this.userInfo.userName,integral:res.data.userIntegral})
						uni.showToast({
							title: '兑换成功!',
							duration: 2000
						});
					}else{
						uni.showToast({
							title: '积分不够哦QAQ',
							duration: 2000,
							icon:'error'
						});
					}
				}
				this.exchangeGiftShow = false
				
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
	*{
		padding: 0;
		margin: 0;
	}
	page{
		background-color: rgb(246,246,246);
	}
	.user-inergral-view{
		height:35px;
		display: flex;
		align-items: center;
		position: relative;
	}
	.user-inergral-box{
		width: 5rem;
		height: 25px;
		border-radius: 15px;
		display: flex;
		background-color: rgb(70,76,130);
		color: #FFFFFF;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 5%;
	}
	.gift-lists{
		/* margin-top: 1rem; */
	}
	.gift-card{
		width: 50vw;
		height: 300px;
		margin-bottom: 1rem;
		/* border: 1px solid red; */
		background-color: #FFFFFF;
		position: relative;
	}
	.gift-title{
		margin-top: 1rem;
		text-align: center;
		font-weight: 600;
	}
	.gift-image{
		
	}
	.gift-exchange{
		display: flex;
		justify-content: space-between;
	}
	.gift-price{
		display: flex;
		color:rgb(249,231,0) ;
		align-items: center;
		font-size: 15px;
	}
	.exchange-btn{
		width: 5rem;
		height: 1.5rem;
		line-height: 1.5rem;
		background-color: rgb(251,236,234);
		color:red;
		border-radius: 5px;
	}
	.exchange-confirm-view{
		font: 18px;
		text-align: center;
	}
	.exchange-confirm-view .u-image{
		margin: 0 auto;
	}
	.exchange-confirm-view span{
		font-weight: 600;
	}
</style>
