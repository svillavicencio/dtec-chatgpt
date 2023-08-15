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
                "cmMacAddr",
                "cmDocsisCapability",
                "cmSysDescr",
                "downData.frequency",
                "downData.snr",
                "downData.cmCER",
                "downData.rxPwr",
                "downData.rxMer",
                "downData.partialSvcReason",
                "upData.frequency",
                "upData.cmCER",
                "upData.snr",
                "upData.txPwr",
                "ofdmData.ofdmStartFreq",
                "ofdmData.ofdmEndFreq",
                "ofdmData.rxPwr",
                "ofdmData.rxMerMean",
                "ofdmData.cmCER",
                "ofdmData.cmCCER",
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
    const {readFileSync} = require('fs')
    const {join} = require('path')

    const messages = JSON.parse(readFileSync(join(__dirname, './messages.config.json')))
    messages.push({role: 'user', content: JSON.stringify(data)})


    return messages
}

function restructureNXTJSON(data) {
    const result = {}
    const diagnostico = {}
    const { deviceId, parameters } = data
    const { ofdmData, cmDocsisCapability, cmSysDescr, upData, downData } = parameters
  
    //map
    const mapDownstream = item => {
      const { parameters } = item
      const { frequency, cmCER, partialSvcReason, rxMer, rxPwr, snr } = parameters
      return {
        frecuencia: frequency.value + 'MHz',
        estado: {
          CER: cmCER.value,
          'partial-service': partialSvcReason.value === 'none(0)' ? false : true,
          MER: rxMer.value + 'db',
          SNR: snr.value + 'db',
          'nivel-potencia': rxPwr.value + 'db'
        }
      }
    }
  
    const mapUpstream = item => {
      const { parameters } = item
      const { chlSnr, cmCER, cmtsCER, rxPwr, snr, txPwr, frequency } = parameters
      return {
        frecuencia: frequency.value + 'MHz',
        estado: {
          'canal-snr': chlSnr.value + 'db',
          'cablemodem-CER': cmCER.value,
          'CMTS-CER': cmtsCER.value,
          'CMTS-potencia-rx': rxPwr.value + 'db',
          'cablemodem-potencia-tx': txPwr.value + 'db',
          'cablemodem-SNR': snr.value + 'db',
        }
      }
    }
  
    const mapOFDM = item => {
      const { parameters } = item
      const { cmCCER, cmCER, ofdmStartFreq, ofdmEndFreq, ncpCER,plcCER,rxMerMean,rxMerPercVal,rxMerStddev,rxPwr} = parameters
  
      const translate = (value) => value === 'NONE' ? 'NINGUNA' : value === 'MINOR'? 'MENOR' : 'MAYOR'
      
      return {
        'inicio-frecuencia': ofdmStartFreq.value + 'mhz',
        'fin-frecuencia': ofdmEndFreq.value + 'mhz',
        estado: {
          CCER: {valor: cmCCER.value, severidad: translate(cmCCER.severity)} ,
          CER: {valor: cmCER.value, severidad: translate(cmCER.severity)},
          'NCP-CER': {valor: ncpCER.value, severidad: translate(ncpCER.severity)},
          'PLC-CER': {valor: plcCER.value, severidad: translate(plcCER.severity)},
          'RX-MER-MEAN': {valor: rxMerMean.value, severidad: translate(rxMerMean.severity)},
          'RX-MER-PERC-VAL': {valor: rxMerPercVal.value, severidad: translate(rxMerPercVal.severity)},
          'RX-MER-STD-DEV': {valor: rxMerStddev.value, severidad: translate(rxMerStddev.severity)},
          'nivel-potencia': rxPwr.value + 'db'
          
        }
      }
    }
    
    // console.log(downData.values.map(item=>item))
  
    diagnostico['downstream'] = downData.values.map(mapDownstream)
  
    diagnostico['upstream'] = upData.values.map(mapUpstream)
  
    diagnostico['bloque-ofdm'] = ofdmData ? ofdmData.values.map(mapOFDM): ''
    result['resultado-diagnostico'] = diagnostico
    result.serial = deviceId
    result.docsis = cmDocsisCapability.value
    result.descripcion = cmSysDescr.value
    return JSON.stringify(result)
  }
  

module.exports = {
    getReqNxt,
    getSplitedJson,
    getMessages,
    restructureNXTJSON
}