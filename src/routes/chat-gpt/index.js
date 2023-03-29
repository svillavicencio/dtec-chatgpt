const router = require('express').Router()
const controller = require('./controller')

router.post('/consult-mac', controller.consultMac)

module.exports = router