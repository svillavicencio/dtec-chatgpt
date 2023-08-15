require('dotenv').config()

const axios = require('axios')
const {getReqNxt, getSplitedJson, getMessages, restructureNXTJSON} = require('./helpers')
const openai = require('#services/chat-gpt/index.js')
const { readFileSync } = require('fs')
const { join } = require('path')

async function getModemData(serial){
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    const request = getReqNxt(serial)
    const responseNxt = await axios(process.env.NXT_URL, request)

    // const dataMap = restructureNXTJSON(responseNxt.data[0])
    // const json = readFileSync(join(__dirname, './datanxt.json'))
    // const dataMap = JSON.parse(json)
    // const data = {
    //     upstream: parameters.upData.values,
    //     downstream: parameters.downData.values,
    //     ...parameters.ofdmaData,
    //    ...parameters.ofdmData,
    // }

    // const result = getSplitedJson(JSON.parse(dataMap))

    const response = await openai.createChatCompletion({
        model: process.env.GPT_MODEL,
        messages: getMessages(responseNxt.data[0])
    })
    const respuesta2 = await openai.createChatCompletion({
        model: process.env.GPT_MODEL,
        messages: [{role: 'user', content: 'Dame mas detalles del problema que detectaste del modem anterior que te pase'}]
    })

    return {
        respuesta1: response.data.choices,
        dataNxt: responseNxt.data[0]
    }
}

module.exports = {
    getModemData,
}