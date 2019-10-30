const axios = require('axios');  //请求处理

const BASEURL = 'http://m.wufazhuce.com/';

const service  = axios.create({
    baseURL:BASEURL,
    timeout:0
})

service.interceptors.request.use(
    conf=>{
        if(/http/.test(conf.url)){
            conf.baseURL = ''
        }
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