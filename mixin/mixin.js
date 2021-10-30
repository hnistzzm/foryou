export const mixin ={
	data(){
		return{
			userInfo:uni.getStorageSync('userInfo'),
			fontSize: this.$footFontSize
		}
	},
    methods:{
		checkReq(status){
            if(status === 201){
                return true
            }
            return false
        }
    }
}