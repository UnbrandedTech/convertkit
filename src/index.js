const RequestManager = require('./utils/RequestManager')

const Account = require('./Account')
const Broadcasts = require('./Broadcasts')
const CustomFields = require('./CustomFields')
const Forms = require('./Forms')
const Purchases = require('./Purchases')
const Sequences = require('./Sequences')
const Subscribers = require('./Subscribers')
const Tags = require('./Tags')
const Webhooks = require('./Webhooks')

/**
 * @class ConvertKit
 *
 * {@link https://developers.convertkit.com ConvertKit Documentation}
 *
 * @property {string} base_url - Default url used for network requests, can be overridden for tests (defaults to 'https://api.convertkit.com/v3/')
 * @property {string|null} api_key - All API calls require the api_key parameter. You can find your API Key in the ConvertKit Account page.
 * @property {string|null} api_secret - Some API calls require the api_secret parameter. All calls that require api_key also work with api_secret, there's no need to use both. This key grants access to sensitive data and actions on your subscribers. You should treat it as your password and do not use it in any client-side code.
 */
class ConvertKit {
    static get REQUEST_LIMIT() {
        return 120
    }

    static get LIMIT_INTERVAL() {
        return 60000
    }

    constructor ({
        url = 'https://api.convertkit.com/v3/',
        api_key = null,
        api_secret = null
    }) {
        this.base_url = url
        this.api_key = api_key
        this.api_secret = api_secret

        this.request_manager = new RequestManager({ limit: ConvertKit.REQUEST_LIMIT, interval: ConvertKit.LIMIT_INTERVAL })

        this.Account = new Account(this)
        this.Broadcasts = new Broadcasts(this)
        this.CustomFields = new CustomFields(this)
        this.Forms = new Forms(this)
        this.Purchases = new Purchases(this)
        this.Sequences = new Sequences(this)
        this.Subscribers = new Subscribers(this)
        this.Tags = new Tags(this)
        this.Webhooks = new Webhooks(this)
    }

    //TODO:: clean up endpoints
    async #request({ method, path, query, data = null }) {
        //TODO:: Add a mapping of secret required routes+paths
        // if (requires_secret && !this.api_secret) {
        //     throw new Error('API Secret required')
        // }

        query = query || {}

        if (this.api_secret) {
            query.api_secret = this.api_secret
        } else if (this.api_key) {
            query.api_key = this.api_key
        }

        const request_payload = {
            baseURL: this.base_url,
            url: path,
            params: query,
            method,
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: false,
            responseType: 'json'
        }

        if (data) {
            request_payload.data = data
        }

        return await this.request_manager.request(request_payload)
    }

    /**
     * @method Preforms a HTTP GET on the base_url with the path (https://api.convertkit.com/v3/forms)
     * @param {string} path - Resource path (e.g. '/forms')
     * @param {object=} query - key/value query params appended to the URL ({ sort_order: 'asc })
     * @return {Promise<*>}
     */
    Get(path, query) {
        return this.#request({
            method: 'GET',
            path,
            query
        })
    }

    /**
     * Preforms a HTTP POST with data provided on the base_url with the path (https://api.convertkit.com/v3/forms)
     * @param {string} path - Resource path (e.g. '/forms')
     * @param {object} data - JSON payload sent with the request
     * @param {object=} query - key/value query params appended to the URL ({ sort_order: 'asc })
     * @return {Promise<*>}
     */
    Post(path, data, query) {
        return this.#request({
            method: 'POST',
            path,
            data,
            query
        })
    }

    /**
     * Preforms a HTTP PUT with data provided on the base_url with the path (https://api.convertkit.com/v3/forms)
     * @param {string} path - Resource path (e.g. '/forms')
     * @param {object} data - JSON payload sent with the request
     * @param {object|undefined} query - key/value query params appended to the URL ({ sort_order: 'asc })
     * @return {Promise<*>}
     */
    Put(path, data, query= undefined) {
        return this.#request({
            method: 'PUT',
            path,
            data,
            query
        })
    }

    /**
     * Preforms a HTTP DELETE on the base_url with the path (https://api.convertkit.com/v3/forms)
     * @param {string} path - Resource path (e.g. '/forms')
     * @param {object=} query - key/value query params appended to the URL ({ sort_order: 'asc })
     * @return {Promise<*>}
     */
    Delete(path, query) {
        return this.#request({
            method: 'DELETE',
            path,
            query
        })
    }
}

module.exports = ConvertKit
