'use strict'

const Subscription = require('../Subscription')

const paginatedRequest = require('../utils/paginatedRequest')
const buildSubscriptionFilter = require('../utils/buildSubscriptionFilter')

class Tag {
    /**
     * @constructor
     *
     * @param {ConvertKit} client
     * @param {object} tag
     * @param {number} tag.id
     * @param {string} tag.name
     * @param {string} tag.state
     * @param {string} tag.created_at
     * @param {string} tag.updated_at
     * @param {string} tag.deleted_at
     *
     * @property {ConvertKit} this.client
     * @property {number} this.id
     * @property {string} this.name
     * @property {string} this.state
     * @property {string} this.created_at
     * @property {string} this.updated_at
     * @property {string} this.deleted_at
     *
     * @this Tag
     */
    constructor(client, tag) {
        this.client = client

        this.id = tag.id
        this.name = tag.name
        this.state = tag.state
        this.created_at = tag.created_at
        this.updated_at = tag.updated_at
        this.deleted_at = tag.deleted_at
    }

    async getSubscriptions(query) {
        const filters = buildSubscriptionFilter(query, {
            page: 0
        })

        let subscriptions = []
        for await (const response of paginatedRequest({ client: this.client, url: `tags/${this.id}/subscriptions`, options: filters })) {
            for (const subscription of response.subscriptions) {
                subscriptions.push(new Subscription(this.client, subscription))
            }
        }

        return subscriptions
    }

    async addSubscriber(email) {
        const { subscription } = await this.client.Post(`tags/${this.id}/subscribe`, { email })

        return new Subscription(this.client, subscription)
    }

    async removeSubscriber(email) {
        const response = await this.client.Post(`tags/${this.id}/unsubscribe`, { email })

        return this
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created_at: this.created_at
        }
    }
}

module.exports = Tag
