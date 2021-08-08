const Request = require('./Request')

class RequestManager {
    constructor ({ limit = null, interval = null }) {
        this.limit = limit
        this.interval = interval

        this.request_count = 0
        this.request_queue = new Set()
        this.request_timer = null

        this.request_timer = setTimeout(() => this.reset, this.limit)
    }

    isOverLimit () {
        return this.request_count < this.limit
    }

    backOff() {
        this.request_count = this.limit
        this.startTimer()
    }

    startTimer() {
        if (this.request_timer) {
            clearTimeout(this.request_timer)
        }
        this.request_timer = setTimeout(() => this.reset(), this.limit)
    }

    reset() {
        this.request_count = 0
        this.startTimer()
        this.processQueue()
    }

    async processQueue() {
        while (this.request_count < this.limit && this.request_queue.size !== 0) {
            for (const request of this.request_queue) {
                this.request_count++
                await request.send(this)
                this.request_queue.delete(request)
            }
        }
    }

    enqueue(request) {
        const promise = request.wait()

        this.request_queue.add(request)

        return promise
    }

    async request(payload) {
        const request = new Request(payload)

        let response
        if (this.request_count >= this.limit) {
            response = await this.enqueue(request)
        } else {
            this.request_count++
            response = await request.send(this)
        }

        return response
    }
}

module.exports = RequestManager
