'use strict'

const Broadcast = require('./Broadcast')
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
class Broadcasts {
    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     *
     * @property {ConvertKit} this.client - ConvertKit API client
     *
     * @this Broadcasts
     */
    constructor(client) {
        this.client = client
    }

    /**
     * @description Returns a list of all the broadcasts for your account.
     *
     * @link {https://developers.convertkit.com/#list-broadcasts|ConvertKit Documentation}
     *
     * @return {Promise<Broadcast[]>}
     */
    async getAll() {
        const { broadcasts } = await this.client.Get('/broadcasts')

        return broadcasts.map(broadcast => new Broadcast(this.client, broadcast))
    }

    /**
     * @description Get the stats from a specific broadcast.
     *
     * @link {https://developers.convertkit.com/#get-stats|ConvertKit Documentation}
     *
     * @param {string} broadcast_id - Broadcast ID to fetch stats for
     *
     * @return {Promise<Stats|null>}
     */
    async getBroadcastStats(broadcast_id) {
        /** @type {{ broadcast: [{ id: string, stats: {} }] }} */
        const { broadcast } = await this.client.Get(`/broadcasts/${broadcast_id}/stats`)

        return broadcast?.[0]?.stats || null
    }
}

module.exports = Broadcasts
