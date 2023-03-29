require('dotenv').config()

function getReqNxt(device){
    const request = {
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': 'Basic ' + process.env.NXT_KEY
        },
        data: `{
            "deviceId":["${device}"],
            "properties":[
                "regStatus",
                "lastRegTime",
                "cmCollectStatus",
                "cmtsCollectStatus",
                "cmMacAddr",
                "cmHost",
                "cmUptime",
                "cmDocsisCapability",
                "cpeIpAddr",
                "cmSysDescr",
                "cmtsId",
                "cmtsName",
                "inHomeScore",
                "maxTrafficRateDs",
                "maxTrafficRateUs",
                " downData.frequency",
                "downData.snr",
                "downData.cmCER",
                "downData.rxPwr",
                "downData.rxMer",
                "downData.partialSvcReason",
                "upData.frequency",
                "upData.cmCER",
                "upData.snr",
                "upData.txPwr",
                "upData.cmtsCER",
                "upData.chlSnr",
                "upData.rxPwr",
                "ofdmData.ofdmStartFreq",
                "ofdmData.ofdmEndFreq",
                "ofdmData.rxPwr",
                "ofdmData.rxMerMean",
                "ofdmData.rxMerStddev",
                "ofdmData.rxMerPercVal",
                "ofdmData.cmCER",
                "ofdmData.cmCCER",
                "ofdmData.cmCERCCER",
                "ofdmData.plcCER",
                "ofdmData.ncpCER",
                "ofdmData.dsProfile.profileId",
                "ofdmData.dsProfile.status",
                "ofdmData.dsProfile.cmCER",
                "ofdmData.dsProfile.cmCCER",
                "ofdmData.dsProfile.cmCERCCER",
                "ofdmData.dsProfile.speed"
            ]
        }`
    }
    return request
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

function getMessages(data){
    const messages = [
        {role: 'user', content: 'Hola sos un ingeniero en telecomunicaciones especializado en redes HFC y normas DOCSIS 3.0 y DOCSIS 3.1.'},
        {role: 'user', content: 'A continuacion te enviare informacion de la señal y quiero que me indiques si tiene problemas de señal y el porque'},
    ]

    data.forEach((item, index) => {
        messages.push({role: 'user', content: item})
    })

    return messages
}

module.exports = {
    getReqNxt,
    getSplitedJson,
    getMessages
}