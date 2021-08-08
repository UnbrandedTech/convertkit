const axios = require('axios')

const ConvertKitNetworkError = require('./ConvertKitNetworkError')
const ConvertKitValidationError = require('./ConvertKitValidationError')

class Request {
    constructor(payload) {
        this.payload = payload

        this.promise = null
        this.resolve = null
        this.reject = null
    }

    async send(request_manager = null) {
        let response
        try {
            response = await axios(this.payload)
        } catch (e) {
            let error
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            if (e.response) {
                response = e.response
                if (response.status >= 400) {
                    if (response.status === 429) {
                        if (request_manager) {
                            request_manager.backOff()
                            return await request_manager.enqueue(this)
                        }
                    } else if (response.status === 404) {
                        error = new ConvertKitNetworkError('Not Found', 'Not Found', response.status)
                    } else if (response.status === 422) {
                        error = new ConvertKitValidationError(response.data.message)
                    } else {
                        const payload = response.data
                        error = new ConvertKitNetworkError(payload.message, payload.error, response.status)
                    }
                }
            } else if (e.request) {
                // The request was made but no response was received
                error = new ConvertKitNetworkError(e.message, 'No Response', null)
            } else {
                // Something happened in setting up the request that triggered an Error
                error = new ConvertKitNetworkError(e.message, 'Invalid Request', null)
            }

            if (this.reject) {
                this.reject(error)
            } else {
                throw error
            }
        }

        if (this.resolve) {
            this.resolve(response.data)
        }

        return response.data
    }

    wait() {
        if (!this.promise) {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        }

        return this.promise
    }
}

module.exports = Request
