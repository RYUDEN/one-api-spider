function sleep(time) {
    return new Promise(resolve => setTimeout(resolve,time))
}


async function waitSleep() {
    for(let i = 1 ;i<10;i++){
        await sleep(1000)
        console.log(i)
    }
    console.log('okk');
}
waitSleep()