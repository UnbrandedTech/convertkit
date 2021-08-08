'use strict'

class Subscription {
    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     * @param {object} subscription
     * @param {number} subscription.id
     * @param {string} subscription.state
     * @param {string} subscription.created_at
     * @param {string|null} subscription.source
     * @param {string|null} subscription.referrer
     * @param {number} subscription.subscribable_id
     * @param {string} subscription.subscribable_type
     * @param {Subscriber} subscription.subscriber
     *
     * @property {ConvertKit} client - ConvertKit API Client
     * @property {number} this.id
     * @property {string} this.state
     * @property {string} this.created_at
     * @property {string|null} this.source
     * @property {string|null} this.referrer
     * @property {number} this.subscribable_id
     * @property {string} this.subscribable_type
     * @property {Subscriber} this.subscriber
     *
     * * @this Subscription
     */
    constructor(client, subscription) {
        this.client = client

        this.id = subscription.id
        this.state = subscription.state
        this.created_at = subscription.created_at
        this.source = subscription.source
        this.referrer = subscription.referrer
        this.subscribable_id = subscription.subscribable_id
        this.subscribable_type = subscription.subscribable_type

        if (subscription.subscriber) {
            this.subscriber = new this.client.Subscribers.Subscriber(this.client, subscription.subscriber)
        } else {
            this.subscriber = null
        }
    }

    /**
     * @description Returns Subscriber associated to Subscription
     *
     * @link {https://developers.convertkit.com/#view-a-single-subscriber|ConvertKit Documentation}
     *
     * @throws {ConvertKitNetworkError}
     *
     * @return {Promise<Subscriber|null>}
     */
    async getSubscriber() {
        if (this.subscriber?.id) {
            return this.client.Subscribers.getSubscriber(this.subscriber.id)
        }

        return null
    }
}

module.exports = Subscription
