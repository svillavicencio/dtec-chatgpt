const logic = require('./logic')

async function consultMac(req,res){
    const {serial} = req.params
    const data = await logic.getModemData(serial)

    res.json(data)
}

module.exports = {consultMac}