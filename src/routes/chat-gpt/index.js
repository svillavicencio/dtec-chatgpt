const router = require('express').Router()
const controller = require('./controller')

router.get('/consult-mac/:serial', controller.consultMac)

module.exports = router