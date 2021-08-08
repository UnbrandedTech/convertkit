'use strict'

class ConvertKitNetworkError extends Error {
    constructor(message, error, status) {
        super(message)
        this.name = error
        this.status = status

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConvertKitNetworkError)
        }
    }

    toJSON() {
        return {
            error: this.name,
            message: this.message,
            status: this.status
        }
    }
}

module.exports = ConvertKitNetworkError
