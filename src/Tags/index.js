'use strict'

const Tag = require('./Tag')
const Subscription = require('../Subscription')

const paginatedRequest = require('../utils/paginatedRequest')
const buildSubscriptionFilter = require('../utils/buildSubscriptionFilter')

class Tags {
    constructor(client) {
        this.client = client
    }

    /**
     * @description Returns a list of tags for the account.
     *
     * @link {https://developers.convertkit.com/#list-tags|ConvertKit Documentation}
     *
     * @return {Promise<Tag[]>}
     */
    async getAll() {
        const response = await this.client.Get('tags')

        return response.tags.map(tag => new Tag(this.client, tag))
    }

    async getTag(name){
        const tags = await this.getAll()

        return tags.find(tag => tag.name === name)
    }

    /**
     * @param {string} name
     * @return {Promise<Tag>}
     */
    async createTag(name) {
        const request = await this.client.Post('tags', { tag: { name } })

        return new Tag(this.client, request)
    }

    /**
     * @param {string[]} names
     * @return {Promise<Tag[]>}
     */
    async bulkCreateTags(names) {
        const payload = names.map(name => ({ name }))

        const tags = await this.client.Post('tags', { tag: payload })

        return tags.map(tag => new Tag(this.client, tag))
    }

    /**
     * @description List subscriptions to a tag including subscriber data.
     *
     * @link {https://developers.convertkit.com/#list-subscriptions-to-a-tag|ConvertKit Documentation}
     *
     * @param {string} tag_id
     * @param {object} query
     * @param {'asc' | 'decs'} query.sort_order
     * @param {'active' | 'cancelled'} query.subscriber_state
     *
     * @return {Promise<Subscription[]>}
     */
    async getAllSubscriptions(tag_id, query = {}) {
        const filters = buildSubscriptionFilter(query, {
            page: 0
        })

        let subscriptions = []
        for await (const response of paginatedRequest({ client: this.client, url: `tags/${tag_id}/subscriptions`, options: filters })) {
            for (const subscription of response.subscriptions) {
                subscriptions.push(new Subscription(this.client, subscription))
            }
        }

        return subscriptions
    }
}

module.exports = Tags
