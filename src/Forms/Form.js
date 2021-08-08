'use strict'

const Subscription = require('../Subscription')

const paginatedRequest = require('../utils/paginatedRequest')

/**
*
 */
class Form {
    static #buildFilters(filters, initial) {
        if (filters.sort_order === 'asc' || filters.sort_order === 'desc') {
            initial.sort_order = filters.sort_order
        }

        if (filters.subscriber_state === 'active' || filters.sort_order === 'cancelled') {
            initial.subscriber_state = filters.subscriber_state
        }

        return initial
    }

    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     * @param {object} form - Form Payload
     * @param {string} form.id
     * @param {string} form.name
     * @param {string} form.created_at
     * @param {string} form.type
     * @param {string} form.url
     * @param {string} form.embed_js
     * @param {string} form.embed_url
     * @param {string} form.title
     * @param {string} form.description
     * @param {string} form.sign_up_button_text
     * @param {string} form.success_message
     *
     * @property {ConvertKit} this.client - ConvertKit API client
     * @property {string} this.id
     * @property {string} this.name
     * @property {string} this.created_at
     * @property {string} this.type
     * @property {string} this.url
     * @property {string} this.embed_js
     * @property {string} this.embed_url
     * @property {string} this.title
     * @property {string} this.description
     * @property {string} this.sign_up_button_text
     * @property {string} this.success_message
     *
     * @this Form
     */
    constructor(client, form) {
        this.client = client

        this.id = form.id
        this.name = form.name
        this.created_at = form.created_at
        this.type = form.type
        this.url = form.url
        this.embed_js = form.embed_js
        this.embed_url = form.embed_url
        this.title = form.title
        this.description = form.description
        this.sign_up_button_text = form.sign_up_button_text
        this.success_message = form.success_message
    }

    /**
     * @description Subscribe an email address to one of your forms.
     *
     * @link {https://developers.convertkit.com/#add-subscriber-to-a-form|ConvertKit Documentation}
     *
     * @param {object} subscriber
     * @param {string} subscriber.email - (REQUIRED) Subscriber email address.
     * @param {?string} subscriber.first_name - Subscriber first name.
     * @param {?object} subscriber.fields - Object of key/value pairs for custom fields (the custom field must exist before you can use it here).
     * @param {?array} subscriber.tags - Array of tag ids to subscribe to
     *
     * @return {Promise<Subscription>}
     */
    async addSubscriber(subscriber) {
        const { subscription } = this.client.Post(`forms/${this.id}/subscribe`, subscriber)

        return new Subscription(this.client, subscription)
    }

    /**
     * @description Managed (handles pagination) function that returns ALL subscriptions to a form including subscriber data.
     * (Note: If you have a lot of subscribers to a form, this might take some time)
     *
     * @param {object} query
     * @param {'asc' | 'decs'} query.sort_order
     * @param {'active' | 'cancelled'} query.subscriber_state
     *
     * @return {Promise<Subscription[]>}
     */
    async getAllSubscriptions(query = {}){
        const filters = Form.#buildFilters(query, {
            page: 0
        })

        let subscriptions = []
        for await (const response of paginatedRequest({ client: this.client, url: `forms/${this.id}/subscriptions`, options: filters })) {
            for (const subscription  of response.subscriptions) {
                subscriptions.push(new Subscription(this.client, subscription))
            }
        }

        return subscriptions
    }
}

module.exports = Form
