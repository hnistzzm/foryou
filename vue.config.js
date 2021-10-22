module.exports = {
    lintOnSave:false,
    devServer: {
    port: 8084,   
    proxy:{
      '/foryou':{
        target:'http://localhost:9001',
        ws:true,
        changeOrigin:true,
        pathRewrite:{'^/foryou':''}
      }
    }
  }
}
