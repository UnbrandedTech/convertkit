'use strict'

class Account {
    constructor(client) {
        this.client = client
    }

    getCurrent() {
        return this.client.Get('/account')
    }
}

module.exports = Account
