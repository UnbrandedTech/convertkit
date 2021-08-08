'use strict'

/**
 * @typedef {{
 *      recipients: number,
 *      open_rate: number,
 *      click_rate: number,
 *      unsubscribes: number,
 *      total_clicks: number,
 *      show_total_clicks: boolean,
 *      status: string,
 *      progress: number
 * }} Stats
 */
class Broadcast {
    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     * @param {object} broadcast - Broadcast Payload
     * @param {?string} broadcast.id - ID of the Broadcast
     * @param {?string} broadcast.subject - ID of the Broadcast
     * @param {?string} broadcast.created_at - DateTime of when the Broadcast was created in ISO 8601 date format
     *
     * @property {ConvertKit} this.client - ConvertKit API client
     * @property {?string} this.id - ID of the Subscriber
     * @property {?string} this.subject - ID of the Subscriber
     * @property {?string} this.created_at - DateTime of when the Subscriber was created in ISO 8601 date format
     *
     * @this Broadcast
     */
    constructor(client, broadcast) {
        this.client = client

        this.id = broadcast.id
        this.subject = broadcast.subject
        this.created_at = broadcast.created_at
    }

    /**
     * @description Get the stats from a specific broadcast.
     *
     * @link {https://developers.convertkit.com/#get-stats|ConvertKit Documentation}
     *
     * @return {Promise<Stats|null>}
     */
    async getStats() {
        /** @type {{ broadcast: [{ id: string, stats: {} }] }} */
        const { broadcast } = await this.client.Get(`/broadcasts/${this.id}/stats`)

        return broadcast?.[0]?.stats || null
    }

    /**
     * @description JSON.stringify format
     *
     * @link {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior}
     *
     * @return {{ id: string, subject: string, created_at: string }}
     */
    toJSON() {
        return {
            id: this.id,
            subject: this.subject,
            created_at: this.created_at
        }
    }
}

module.exports = Broadcast
