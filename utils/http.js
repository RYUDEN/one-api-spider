const axios = require('axios');  //请求处理

// const BASEURL = 'http://m.wufazhuce.com/';
const BASEURL = 'https://m.kuaidi100.com';

const service  = axios.create({
    baseURL:BASEURL,
    timeout:0
})

service.interceptors.request.use(
    conf=>{
        if(/http/.test(conf.url)){
            conf.baseURL = ''
        }
        // conf.headers = {'Cookie': 'Hm_lvt_22ea01af58ba2be0fec7c11b25e88e6c=1571492316,1571926071,1572515508,1573697848; WWWID=WWW83EFF6B67919C665A695608BF9D3BE12; Hm_lpvt_22ea01af58ba2be0fec7c11b25e88e6c=1573700989'}
        return conf
    },
    err=>{
        return Promise.reject(err)
    }
)

service.interceptors.response.use(
    res=>{
        return res.data
    },
    err=>{
        return Promise.reject(err)
    }
)

module.exports = service