'use strict'

const Form = require('./Form')
const Subscription = require('../Subscription')

const paginatedRequest = require('../utils/paginatedRequest')

class Forms {
    static #buildFilters(filters, initial) {
        if (filters.sort_order === 'asc' || filters.sort_order === 'desc') {
            initial.sort_order = filters.sort_order
        }

        if (filters.subscriber_state === 'active' || filters.sort_order === 'cancelled') {
            initial.subscriber_state = filters.subscriber_state
        }

        return initial
    }

    constructor(client) {
        this.client = client
    }

    /**
     *
     * @return {Promise<Form[]>}
     */
    async getAll() {
        const { forms } = await this.client.Get('/forms')
        return forms.map(form => new Form(this.client, form))
    }

    async addSubscriber(form_id, subscriber_details){
        const { subscription } = this.client.Post(`/forms/${form_id}/subscribe`, subscriber_details)
        return new Subscription(this.client, subscription)
    }

    /**
     * @description Get all subscriptions to a form including subscriber data.
     *
     * @param {string} form_id
     * @param {object} query
     * @param {'asc' | 'decs'} query.sort_order
     * @param {'active' | 'cancelled'} query.subscriber_state
     *
     * @return {Promise<Subscription[]>}
     */
    async getAllFormSubscriptions(form_id, query = {}){
        const filters = Forms.#buildFilters(query, {
            page: 0
        })

        let all_subscriptions = []
        for await (const response of paginatedRequest({ client: this.client, url: `forms/${form_id}/subscriptions`, options: filters })) {
            for (const subscription of response.subscriptions) {
                all_subscriptions.push(new Subscription(this.client, subscription))
            }
        }

        return all_subscriptions
    }
}

module.exports = Forms
