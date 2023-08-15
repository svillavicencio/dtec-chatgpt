function errorHandler(err, req, res, next){
    res.json({
        message: 'Se produjo un error',
        err: err
    })
}

module.exports = errorHandler