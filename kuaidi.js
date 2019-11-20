const express = require('express')  //服务器模块
const fs = require('fs')
const apicache = require("apicache");
const service = require('./utils/http')
const axios = require('axios');  //请求处理
const qs = require('querystring');

// const getExpress = async (num) => {
//     // const type = await service({
//     //     url: '/apicenter/kdquerytools.do?method=autoComNum&text='+'YT2010249877255',
//     //     method: 'get',
//     // })
//     const res = await service({
//         url: '/query',
//         method: 'post',
//         data: qs.stringify({
//             postid: 'YT2010249877255',
//             id: 1,
//             valicode: '',
//             temp: '0.35536279205967591',
//             type: 'yuantong',
//             phone: '',
//             token: '',
//             platform: 'MWWW',
//             coname: 'A',
//         })
//     })
//     console.log(res)
// }
// getExpress()

axios.get('https://m.kuaidi100.com/app/query/?coname=A&nu=YT2010249877255')
.then(res => {
    console.log(res.headers['set-cookie'])
});