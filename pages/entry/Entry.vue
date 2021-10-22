<template>
	<view class="container">
		<view class="login-form">
			<view class="home-page-icon">
				
			</view>
			<u-form :model="loginForm" ref="userLoginRef" >
				<u-form-item prop="userName" >
					<u-input 
						v-model="loginForm.userName"
						placeholder="请输入账号" 
						inputAlign="left"
						placeholder-style="font-size:30rpx;padding-left:30rpx"
						:custom-style="{'fontSize':30+'rpx','color':'#FFFFFF'}"
						>
					</u-input>
				</u-form-item>
				<u-form-item prop="passWord">
					<u-input 
						type="password"
						v-model="loginForm.passWord" 
						placeholder="请输入密码" 
						inputAlign="left"
						placeholder-style="font-size:30rpx;padding-left:30rpx"
						:custom-style="{'fontSize':30+'rpx','color':'#FFFFFF'}"
						>
					</u-input>
				</u-form-item>
				<u-checkbox-group>
					<u-checkbox 
					v-model="isRemPassword"
					name="remember"
					>
					记住密码
					</u-checkbox>
				</u-checkbox-group>
				<button @click="login()">登录</button>
				<!-- 登陆成功 -->
			</u-form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName:'',
				userId:'',
				//登录的表单
				loginForm:{
					userName:"",
					passWord:"",	
				},
				isRemPassword:false,
				//登录表单的校验规则
				userLoginRules:{
					userName:[
						   { required: true, trigger:'change'},
					],
					passWord:[
						   { required: true, trigger: 'change' },
					]
				}
			}
		},
			// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		
		methods: {
			 async login(){
				console.log("进入登录函数了");
					const {data:res} = await this.$http.post('/login',this.loginForm)
					console.log(JSON.stringify(res));
					uni.setStorage('userId',res.data.userInfo.userId)
					console.log(JSON.stringify(uni.getStorageSync('userId')) );
					uni.navigateTo({
						url:'../home/HomeCenter'
					})
			   
			}
		}
	}
</script>

<style scoped >
	button{
		width: 40%;
		margin-top: 20px;
		background-color: rgb(78, 122, 189);
		border-radius: 25px;
		color: #FFFFFF;
	}
	.container{
		position: relative;
		height: 100%;
		background: url('../../static/photo/background3.jpg');
		background-size: 100% 100%;
	}
	.home-page-icon{
		width: 50px;
		margin: 0 auto;
		margin-bottom: 20px;
	}
	.home-page-icon .u-image{
		
	}
	.login-form{
		width: 90%;
		position:absolute;
		top: 35%;
		left: 50%;
		transform: translate(-50%,-50%);
		/* border: 1px solid red; */
	}
	.warp1{
		padding: 20rpx;
	}

	.bg-set{
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    top: 0;
	    left: 0;
	    z-index: -1;
		/* opacity:0.2; */
	}
	.dropdown{
		float:left;
		margin-left: 30%;
		width:50rpx;
	}
	.text-area {
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
	}
</style>