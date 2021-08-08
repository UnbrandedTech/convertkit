'use strict'

const Tag = require('../Tags/Tag')
const Subscription = require('../Subscription')

const ConvertKitValidationError = require('../utils/ConvertKitValidationError')

/**
 * @class Subscriber
 *
 * @typedef {"active" | "canceled" | null} SubscriberState
 */
class Subscriber {
    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     * @param {object} subscriber - Subscriber Payload
     * @param {?string} subscriber.id - ID of the Subscriber
     * @param {?string} subscriber.first_name - Name of the Subscriber
     * @param {?string} subscriber.email_address - Email of the Subscriber
     * @param {?SubscriberState} subscriber.state - Current state of the Subscriber
     * @param {?string} subscriber.created_at - DateTime of when the Subscriber was created in ISO 8601 date format
     * @param {?object} subscriber.fields - Key/Value of all the custom assigned to this Subscriber
     *
     * @property {?string} this.id - ID of the Subscriber
     * @property {?string} this.first_name - Name of the Subscriber
     * @property {?string} this.email_address - Email of the Subscriber
     * @property {?SubscriberState} this.state - Current state of the Subscriber
     * @property {?string} this.created_at - DateTime of when the Subscriber was created in ISO 8601 date format
     * @property {?object} this.fields - Key/Value of all the custom assigned to this Subscriber
     *
     * @this Subscriber
     */
    constructor(client, { id = null, first_name = null, email_address = null, state = null, created_at = null, fields = {} } = {}) {
        this.client = client

        this.id = id
        this.first_name = first_name
        this.email_address = email_address
        this.state = state
        this.created_at = created_at
        this.fields = fields
    }

    /**
     * @private
     *
     * @description Updates the internal dataset
     *
     * @param {object} subscriber
     * @param {?string} subscriber.id - ID of the Subscriber
     * @param {?string} subscriber.first_name - Name of the Subscriber
     * @param {?string} subscriber.email_address - Email of the Subscriber
     * @param {?SubscriberState} subscriber.state - Current state of the Subscriber
     * @param {?string} subscriber.created_at - DateTime of when the Subscriber was created in ISO 8601 date format
     * @param {?object} subscriber.fields - Key/Value of all the custom assigned to this Subscriber
     */
    #updateProperties(subscriber) {
        this.first_name = subscriber.first_name
        this.email_address = subscriber.email_address
        this.state = subscriber.state
        this.created_at = subscriber.created_at
        this.fields = subscriber.fields
    }

    /**
     * @description Updates the information for a single subscriber.
     *
     * @link {https://developers.convertkit.com/#update-subscriber ConvertKit Documentation}
     *
     * @param {object} payload
     * @param {string=} payload.first_name - Updated first name for the subscriber.
     * @param {string=} payload.email_address - Updated email address for the subscriber.
     * @param {object=} payload.fields - Updated custom fields for your subscriber as object of key/value pairs (the custom field must exist before you can use it here).
     *
     * @throws {ConvertKitNetworkError|ConvertKitValidationError}
     *
     * @return {Promise<Subscriber>}
     */
    async update({ first_name, email_address, fields }) {
        if (!this.id) {
            throw new ConvertKitValidationError('Invalid Subscriber ID', this.toJSON())
        }

        const payload = {}

        if (first_name !== undefined) {
            payload.first_name = first_name
        }

        if (email_address !== undefined) {
            payload.email_address = email_address
        }

        if (fields !== undefined) {
            payload.fields = fields
        }

        const { subscriber } = await this.client.Put(`/subscribers/${this.id}`, payload)

        this.#updateProperties(subscriber)

        return this
    }

    /**
     * @description Unsubscribe the subscribers email address from all your forms and sequences.
     *
     * @link {https://developers.convertkit.com/#unsubscribe-subscriber | ConvertKit Documentation}
     *
     * @throws {ConvertKitNetworkError|ConvertKitValidationError}
     *
     * @return {Promise<Subscriber>}
     */
    async unsubscribe() {
        if (!this.email_address) {
            throw new ConvertKitValidationError('Invalid Subscriber email', this.toJSON())
        }

        const { subscriber } = await this.client.Put('/unsubscribe', { email: this.email_address })

        this.#updateProperties(subscriber)

        return this
    }

    /**
     * @description Lists all the tags for a subscriber.
     *
     * @link {https://developers.convertkit.com/#list-tags-for-a-subscriber | ConvertKit Documentation}
     *
     * @throws {ConvertKitNetworkError}
     *
     * @return {Promise<Tag[]>}
     */
    async listTags() {
        if (!this.id) {
            throw new ConvertKitValidationError('Invalid Subscriber id', this.toJSON())
        }

        const { tags } = await this.client.Get(`/subscribers/${this.id}/tags`)

        return tags
    }

    /**
     * @param {string|number} tag_id
     * @return {Promise<Subscription>}
     */
    async addTag(tag_id) {
        const { subscription } = await this.client.Post(`tags/${tag_id}/subscribe`, { email: this.email_address })

        return new Subscription(this.client, subscription)
    }

    /**
     * @param {string} tag_id
     * @return {Promise<Tag>}
     */
    async removeTag(tag_id) {
        const response = await this.client.Delete(`subscribers/${this.id}/tags/${tag_id}`)

        return new Tag(this.client, response)
    }

    /**
     * @description JSON.stringify format
     *
     * @link {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior}
     *
     * @return {{ email_address, created_at, id: ?string, state, fields, first_name }}
     */
    toJSON() {
        return {
            id: this.id,
            first_name: this.first_name,
            email_address: this.email_address,
            state: this.state,
            created_at: this.created_at,
            fields: this.fields,
        }
    }
}

module.exports = Subscriber
