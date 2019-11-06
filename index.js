
//请求处理
const express = require('express')  //服务器模块
const fs = require('fs')
const apicache = require("apicache");
const { getOne, getArticle, getQuestion, getToday, search } = require('./utils/mid')
const app = express();
const cache = apicache.middleware;

const TempRes = function(code,msg,data){
    this.code = code
    this.msg  = msg 
    this.data = data
}
app.all("*", function(req, res, next) {
    if (req.path !== "/" && !req.path.includes(".")){
      res.header("Access-Control-Allow-Credentials", true);
      // 这里获取 origin 请求头 而不是用 *
      res.header("Access-Control-Allow-Origin", req.headers["origin"] || "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      res.header("Content-Type", "application/json;charset=utf-8");
    }
    next();
});

const onlyStatus200 = (req, res) => res.statusCode === 200;
app.use(cache("300 second", onlyStatus200));

app.get('/one',async function(req,res){
    if(req.query.id){
    // getOne(req.query.id)
    const result = await getOne(req.query.id)
    res.send(new TempRes(200,'ok',result))
    }
    else{
    res.send('no id')
    }
})

app.get('/article',async function(req,res){
    if(req.query.id){
    // getOne(req.query.id)
    const result = await getArticle(req.query.id)
    res.send(new TempRes(200,'ok',result))
    }
    else{
    res.send('no id')
    }
})

app.get('/question',async function(req,res){
    if(req.query.id){
    // getOne(req.query.id)
    const result = await getQuestion(req.query.id)
    res.send(new TempRes(200,'ok',result))
    }
    else{
        res.send('no id')
    }
})

app.get('/today',async function(req,res){
    const result = await getToday()
    res.send(new TempRes(200,'ok',result))
})

// app.get('/search',async function(req,res){
//     const { kw, page, type } = req.query;
//     if(kw!==''){
//         const result = await search({ searchString: kw}, type);
//         res.send(new TempRes(200,'ok',result))
//     }else{
//         res.send(new TempRes(404,'未传参数',null))
//     }
// })

app.listen(2334, ()=> {
console.log(`server running @ http://localhost:${2333}`);
})


function sleep(time) {
    return new Promise(resolve => setTimeout(resolve,time))
} //睡眠函数

function clip(str) {
    //切字符串
    return str.match(/previousPageUrl\=(\S*)\;/)[1];
}