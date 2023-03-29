require('dotenv').config()
const {Configuration, OpenAIApi} = require('openai')
const configuration = new Configuration({
    apiKey: process.env.GPT_KEY
})
const openai = new OpenAIApi(configuration)
const fs = require('fs')
const {join}=require('path')
const axios = require('axios')

async function getModemData(serial){
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    const responseNxt = await axios.post(process.env.TOOLBOX_URL, {devicesIds: [serial]})
    console.log(responseNxt)

    const {parameters} = JSON.parse(fs.readFileSync(join(__dirname, '../../../data/docsis3.1.json')))
    const data = {
        ...parameters.ofdma,
        ...parameters.ofdm,
        ...parameters.upData,
        ...parameters.downData
    }
    const result = getSplitedJson(data)
    console.log(result.length)
    const messages = [
                {role: 'user', content: 'Hola sos un ingeniero en telecomunicaciones especializado en redes HFC y normas DOCSIS 3.0 y DOCSIS 3.1.'},
                {role: 'user', content: 'A continuacion te enviare informacion de la señal y quiero que me indiques si tiene problemas de señal y el porque'},
    ]

    result.forEach((item, index) => {
        messages.push({role: 'user', content: item})
    })

    const response = await openai.createChatCompletion({
        model: process.env.GPT_MODEL,
        messages: messages
    })

    return response.data.choices
}

function getSplitedJson(payload){
    const json = JSON.stringify(payload)
    const arrayData = json.split('')
    const result = []
    do{
        const data = arrayData.splice(0, 2047).join('')
        result.push(data)
    }while (arrayData.length !== 0)

    return result
}

module.exports = {
    getModemData
}