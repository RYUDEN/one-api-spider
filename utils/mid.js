const cheerio = require('cheerio')
const service = require('./http')
const Entities = require('html-entities').XmlEntities;//处理HTML文档被转码
const qs = require('querystring');
const entities = new Entities();
const getOne = async id => {
    const res = await service({
        url:`one/${id}`,
        method:'get'
    })
    if (!res) {
        return 'err'
    }
    const html_str = res.toString();
    const $ = cheerio.load(html_str);

    const day   = $('.day').text(); //日
    const month = $('.month').text(); //月
    const content = $('.text-content').text();
    const num = $('.picture-detail-issue-no').text();
    $('.text-author .picture-detail-issue-no').remove();
    const author = $('.text-author').text();
    const img = $('.item-picture-img').attr('src')
    const spt = $('html').html();
    const pre = 
        JSON.parse(spt.match(/previousPageUrl\=(\S*)\;/)[1])&&
        JSON.parse(spt.match(/previousPageUrl\=(\S*)\;/)[1])
        .match(/\/one\/(\S*)/)[1]
    const next =
        JSON.parse(spt.match(/nextPageUrl\=(\S*)\;/)[1])&&
        JSON.parse(spt.match(/nextPageUrl\=(\S*)\;/)[1])
        .match(/\/one\/(\S*)/)[1];
    return(
        {day,month,content,num,pre,next,author,img}
    )
}

const getArticle = async id => {
    const res = await service({
        url:`article/${id}`,
        method:'get'
    })
    if (!res) {
        return 'err'
    }
    const html_str = res.toString();
    const $ = cheerio.load(html_str);

    const title    = $('.text-title').text();
    const author   = $('.text-author').text()
    const content  = $('.text-content').html();
    const spt = $('html').html();
    const pre = 
    JSON.parse(spt.match(/previousPageUrl\=(\S*)\;/)[1])&&
    JSON.parse(spt.match(/previousPageUrl\=(\S*)\;/)[1])
    .match(/\/article\/(\S*)/)[1]
    const next =
        JSON.parse(spt.match(/nextPageUrl\=(\S*)\;/)[1])&&
        JSON.parse(spt.match(/nextPageUrl\=(\S*)\;/)[1])
        .match(/\/article\/(\S*)/)[1];
    return(
        {title,author,pre,next,content:entities.decode(content)}
    )
}

const getQuestion = async id => {
    const res = await service({
        url:`question/${id}`,
        method:'get' 
    })
    if (!res) {
        return 'err'
    }
    const html_str = res.toString();
    const $ = cheerio.load(html_str);

    const spt = $('html').html();
    const title   = $('.text-title').text().replace(/\r/g,'').replace(/\s/g,'');
    const askers  = $('.text-askers').text().replace(/\r/g,'').replace(/\s/g,'');
    const answers = $('.text-answers').text().replace(/\r/g,'').replace(/\s/g,'');
    const content = $('.text-content').eq(1).html();
    const pre = 
    JSON.parse(spt.match(/previousPageUrl\s\=\s(\S*)\;/)[1])&&
    JSON.parse(spt.match(/previousPageUrl\s\=\s(\S*)\;/)[1])
    .match(/\/question\/(\S*)/)[1]
    const next =
        JSON.parse(spt.match(/nextPageUrl\s\=\s(\S*)\;/)[1])&&
        JSON.parse(spt.match(/nextPageUrl\s\=\s(\S*)\;/)[1])
        .match(/\/question\/(\S*)/)[1];

    return (
        {title, askers, answers,pre,next, content: entities.decode(content).replace(/\r/g,'').replace(/\s/g,'')}
    )
}

const getToday = async () => {
    const res = await service({
        url:`http://wufazhuce.com/`, 
        method:'get' 
    })
    if (!res) {
        return 'err'
    }
    const html_str = res.toString();
    const $ = cheerio.load(html_str);
    
    let one = {};
    let article = {};
    let question = {};
    one.img = $('.carousel-inner .item.active .fp-one-imagen').attr('src');
    one.num = $('.carousel-inner .item.active .titulo').text();
    one.day = $('.carousel-inner .item.active .dom').text();
    one.month = $('.carousel-inner .item.active .may').text();
    one.content = $('.carousel-inner .item.active .fp-one-cita a').text();
    one.id = $('.carousel-inner .item.active .fp-one-cita a').attr('href').match(/one\/(\S*)/)[1];

    article.num   = $('.one-titulo').eq(1).text().replace(/\s/g,'');
    article.title =  $('.one-articulo-titulo a').eq(0).text().replace(/\s/g,'')
    article.id = $('.one-articulo-titulo a').eq(0).attr('href').match(/article\/(\S*)/)[1]

    question.num   = $('.one-titulo').eq(1).text().replace(/\s/g,'');
    question.title =  $('.one-cuestion-titulo a').eq(0).text().replace(/\s/g,'')
    question.id = $('.one-cuestion-titulo a').eq(0).attr('href').match(/question\/(\S*)/)[1]

    return (
        {one, article, question}
    )
}

//today
const search = async (query, type) => {
    const pms = { page:1,...query }
    const HASHMAP = {
        article: 'search',
        one: 'searchPic',
        question: 'searchQue',
    }
    console.log('request',HASHMAP[type]+'?'+qs.stringify(pms))
    const res = await service({
        url: HASHMAP[type]+'?'+qs.stringify(pms),
        method: 'get',
    })
    if (!res) {
        return 'err'
    }
    const html_str = res.toString();
    const $ = cheerio.load(html_str);
    
    let resultlist = [];
    let page = {
        current:1,
        next:1,
        pre:1,
    };
    const nextPage = $('#nextPage').text();
    console.log('nextPage',nextPage)
    if (nextPage){
        page.current = parseInt(pms.page);
        page.next = parseInt(pms.page)+1;
        page.pre = parseInt(pms.page)>1 ? (parseInt(pms.page)-1) : 1;
    }
    const resdom  = $('.search_result .item-text');

    console.log('result',resdom.length);
    // console.log('dom',html_str)

    if (resdom.length === 0 ){
        return ({
            resultlist:[],
            page
        })
    };
    
    for(let idx = 0;idx<resdom.length;idx++){
        let obj = {};
        if (type !== 'one') {
            obj.data = resdom.eq(idx).children('.date').text();
            obj.title = resdom.eq(idx).children('.text-title').text();
            obj.content = resdom.eq(idx).children('.text-content-short').text().substring(0,50);
            obj.id = resdom.eq(idx).children('.div-link.').attr('href');
            resultlist.push(obj)
        } else {
            obj.data = resdom.eq(idx).children('.date').text();
            obj.img = resdom.eq(idx).find('.item-picture-img').attr('src');
            obj.content = resdom.eq(idx).find('.text-content-short').text();
            obj.id = resdom.eq(idx).children('a.div-link').attr('href').match(/one\/(\S*)/)[1];
            resultlist.push(obj)
        }
    }
    return ({
        resultlist,
        page
    })
}
module.exports = { getOne, getArticle, getQuestion, getToday, search }