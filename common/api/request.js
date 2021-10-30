// let baseURL='http://192.168.199.133:8090';
// const baseURL='http://211.69.238.66:8090';
let baseURL='http://cccsin4w.dongtaiyuming.net:49323';
const Http = async function(methods, params, urls) {
	// 不同请求的判断  // 这里依据项目要求自行更改传参格式
	let response = {}; // 请求的返回值
	const token = uni.getStorageSync('token')
	if(methods === 'put' || methods === 'post' || methods === 'patch' || methods === 'delete' || methods === 'get'){
		try{
			response =  await uni.request({method: methods, url: baseURL + urls, data: params,header:{'content-type':'application/json','Authorization':token},
											dataType:'json',xhrFields: {withCredentials: true},
    		crossDomain: true})
				return response
			}catch(err){
				response = err
			}
	}
}
export default Http
