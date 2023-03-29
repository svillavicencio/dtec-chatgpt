function errorHandler(err, req, res, next){
    console.error(err.toJSON())
    res.json({
        message: 'Se produjo un error',
        err: err
    })
}

module.exports = errorHandler