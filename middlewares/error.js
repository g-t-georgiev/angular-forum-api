function errorMiddleware(err, req, res, next) {
    if (err.status === 333) {
        res.status(333)
            .json({ message: 'ErrorHandler: not allowed!' })
    } else {
        // console.error('Message: ' + err.message, '\nStack: ' + err.stack);
        res.status(err.status ?? 500)
            .json({ message: err.message ?? 'ErrorHandler: Something went wrong!', err })
    }
}

module.exports = errorMiddleware;