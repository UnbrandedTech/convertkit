'use strict'

class ConvertKitValidationError extends Error {
    constructor(message, properties) {
        super(message)

        this.name = message
        this.properties = properties

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConvertKitValidationError)
        }
    }

    toJSON() {
        return {
            error: this.name,
            message: this.message,
            properties: this.properties
        }
    }
}

module.exports = ConvertKitValidationError
