require('dotenv').config()

const axios = require('axios')
const {getReqNxt, getSplitedJson, getMessages} = require('./helpers')
const openai = require('#services/chat-gpt/index.js')

async function getModemData(serial){
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    const request = getReqNxt(serial)
    const responseNxt = await axios(process.env.NXT_URL, request)

    const {parameters} = responseNxt.data[0]

    const data = {
        upstream: parameters.upData.values,
        downstream: parameters.downData.values,
        // ...parameters.ofdmaData,
       // ...parameters.ofdmData,
    }

    const result = getSplitedJson(data)

    const response = await openai.createChatCompletion({
        model: process.env.GPT_MODEL,
        messages: getMessages(result)
    })
    const respuesta2 = await openai.createChatCompletion({
        model: process.env.GPT_MODEL,
        messages: [{role: 'user', content: 'Dame mas detalles del problema que detectaste del modem anterior que te pase'}]
    })

    return {
        respuesta1: response.data.choices,
        dataNxt: data
    }
}

module.exports = {
    getModemData,
}