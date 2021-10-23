<template>
	<view>
		<u-navbar back-text="返回" title="兑换礼品"></u-navbar>
		<!-- <u-tabs-swiper ref="tabs" :list="tabLists" :is-scroll="false"></u-tabs-swiper> -->
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
						
						<button class="exchange-btn">兑换</button>
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
						<button class="exchange-btn" @click="exchangeGiftShow=true">兑换</button>
					</view>
					<u-modal v-model="exchangeGiftShow">确定兑换此礼品吗</u-modal>
				</view>
			</template>
		</u-waterfall>
	</view>
</template>

<script>
	export default{
		data(){
			return{
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
						title: '任意奶茶一杯',
						image: '../../static/photo/gift_milktea.jpeg',
					},
					{
						price: 100,
						title: '任意外卖',
						image: '../../static/photo/gift_milktea.jpeg',
					},
					{
						price: 100,
						title: '任意奶茶一杯',
						image: '../../static/photo/gift_milktea.jpeg',
					},
				],
				exchangeGiftShow:false
			}
		},
		onLoad() {
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
	.gift-lists{
		margin-top: 1rem;
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
</style>
