'use strict'

const Subscriber = require('./Subscriber')

const paginatedRequest = require('../utils/paginatedRequest')
const Subscription = require('../Subscription')

/**
 * @class Subscribers
 *
 * @typedef {{ subscribers: object[], total_subscribers: number, page: number, total_pages: number }} AllSubscribersPayload
 * @typedef {"asc" | "desc"} SortOrder
 * @typedef {"cancelled_at"} SortField
 */
class Subscribers {
    /**
     * @description Formats filters
     *
     * @param {object} filters
     * @param {?string} filters.from - Filter subscribers added on or after this date (format yyyy-mm-dd)
     * @param {?string} filters.to - Filter subscribers added on or before this date (format yyyy-mm-dd).
     * @param {?string} filters.updated_from - Filter subscribers who have been updated after this date (format yyyy-mm-dd)
     * @param {?string} filters.updated_to - Filter subscribers who have been updated before this date (format yyyy-mm-dd)
     * @param {?SortOrder} filters.sort_order - Sort order for results (asc or desc)
     * @param {?SortField} filters.sort_field - Field to sort by (cancelled_at)
     * @param {object} [initial={}]
     *
     * @return {object}
     */
    static #filterBuilder(filters, initial = {}) {
        if (filters.sort_order === 'asc' || filters.sort_order === 'desc') {
            initial.sort_order = filters.sort_order
        } else {
            initial.sort_order = 'asc'
        }

        if (filters.from) {
            initial.from = filters.from
        }

        if (filters.to) {
            initial.to = filters.to
        }

        if (filters.updated_from) {
            initial.updated_from = filters.updated_from
        }

        if (filters.updated_to) {
            initial.updated_to = filters.updated_to
        }

        if (filters.sort_field === 'cancelled_at') {
            initial.sort_field = 'cancelled_at'
        }

        return initial
    }

    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     *
     * @this Subscribers
     */
    constructor(client) {
        this.client = client

        this.Subscriber = Subscriber
    }

    /**
     * @description Returns data for a single subscriber
     *
     * @link {https://developers.convertkit.com/#view-a-single-subscriber|ConvertKit Documentation}
     *
     * @param subscriber_id - ID of the Subscriber you want to fetch.
     *
     * @throws {ConvertKitNetworkError}
     *
     * @return {Promise<Subscriber>}
     */
    async getSubscriber(subscriber_id) {
        const { subscriber } = await this.client.Get(`/subscribers/${subscriber_id}`)

        return new Subscriber(this.client, subscriber)
    }

    /**
     * @description Search for a subscriber matching an email address
     *
     * @link {https://developers.convertkit.com/#list-subscribers|ConvertKit Documentation}
     *
     * @param {string} email_address - Email of the subscriber you are searching for
     *
     * @throws {ConvertKitValidationError}
     *
     * @return {Promise<Subscriber | null>}
     */
    async findSubscriber(email_address) {
        const { subscribers } = await this.client.Get('subscribers', { email_address })

        const subscriber = subscribers.find(sub => sub.email_address === email_address) || null

        if (subscriber) {
            return new Subscriber(this.client, subscriber)
        }

        return subscriber
    }

    /**
     * @description Get all subscribers matching the provided filters
     *
     * @link {https://developers.convertkit.com/#list-subscribers | ConvertKit Documentation}
     *
     * @param {object} [filters={}]
     * @param {?string} filters.from - Filter subscribers added on or after this date (format yyyy-mm-dd)
     * @param {?string} filters.to - Filter subscribers added on or before this date (format yyyy-mm-dd).
     * @param {?string} filters.updated_from - Filter subscribers who have been updated after this date (format yyyy-mm-dd)
     * @param {?string} filters.updated_to - Filter subscribers who have been updated before this date (format yyyy-mm-dd)
     * @param {?SortOrder} filters.sort_order - Sort order for results (asc or desc)
     * @param {?SortField} filters.sort_field - Field to sort by (cancelled_at)
     *
     * @throws {ConvertKitValidationError}
     *
     * @return {Promise<Subscriber[]>}
     */
    async getAllSubscribers(filters= {}) {
        const query = Subscribers.#filterBuilder(filters, {
            page: 0
        })

        let subscribers = []
        for await (const response of paginatedRequest({ client: this.client, url: `subscribers`, options: query })) {
            for (const subscriber  of response.subscribers) {
                subscribers.push(new Subscriber(this.client, subscriber))
            }
        }

        return subscribers
    }

    /**
     * @description Updates the information for a single subscriber.
     *
     * @link {https://developers.convertkit.com/#update-subscriber ConvertKit Documentation}
     *
     * @param {string} subscriber_id - Subscriber ID you want to update
     * @param {object} payload
     * @param {string=} payload.first_name - Updated first name for the subscriber.
     * @param {string=} payload.email_address - Updated email address for the subscriber.
     * @param {object=} payload.fields - Updated custom fields for your subscriber as object of key/value pairs (the custom field must exist before you can use it here).
     *
     * @throws {ConvertKitValidationError}
     *
     * @return {Promise<Subscriber>}
     */
    async updateSubscriber(subscriber_id, payload) {
        const { subscriber } = await this.client.Put(`subscribers/${subscriber_id}`, payload)

        return new Subscriber(this.client, subscriber)
    }

    /**
     * @description Unsubscribe the subscribers email address from all your forms and sequences.
     *
     * @link {https://developers.convertkit.com/#unsubscribe-subscriber | ConvertKit Documentation}
     *
     * @param {string} email - Email of the subscriber you want to unsubscribe
     *
     * @throws {ConvertKitValidationError}
     *
     * @return {Promise<Subscriber>}
     */
    async unsubscribeSubscriber(email) {
        const { subscriber } = await this.client.Put('/unsubscribe', { email })

        return new Subscriber(this.client, subscriber)
    }

    /**
     * @description Lists all the tags for a subscriber.
     *
     * @link {https://developers.convertkit.com/#list-tags-for-a-subscriber | ConvertKit Documentation}
     *
     * @param {string} subscriber_id - Subscriber ID you want to fetch tags for
     *
     * @throws {ConvertKitValidationError}
     *
     * @return {Promise<Tag[]>}
     */
    async getTagsForSubscriber(subscriber_id) {
        const { tags } = await this.client.Get(`/subscribers/${subscriber_id}/tags`)

        return tags
    }
}

module.exports = Subscribers
