'use strict'

const CustomField = require('./CustomField')

class CustomFields {
    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     *
     * @property {ConvertKit} client - ConvertKit API Client
     *
     * @this CustomFields
     */
    constructor(client) {
        this.client = client
    }

    /**
     * @description List all of your account's custom fields.
     *
     * @link {https://developers.convertkit.com/#list-fields|ConvertKit Documentation}
     *
     * @throws {ConvertKitNetworkError}
     *
     * @return {Promise<CustomField[]>}
     */
    async getAll() {
        const { custom_fields } = await this.client.Get('/custom_fields')

        return custom_fields.map(custom_field => new CustomField(this.client, custom_field))
    }

    /**
     * @description Create a custom field for your account.
     * The label field must be unique to your account. Whitespace will be removed from the beginning and the end of your label.
     * Additionally, a key field and a name field will be generated for you.
     * The key is an ASCII-only, lowercase, underscored representation of your label. This key must be unique to your account. Keys are used in personalization tags in sequences and broadcasts.
     * Names are unique identifiers for use in the HTML of custom forms. They are made up of a combination of ID and the key of the custom field prefixed with "ck_field".
     *
     * @param {string|string[]} label
     *
     * @throws {ConvertKitNetworkError}
     *
     * @return {Promise<CustomField[]>}
     */
    async createCustomField(label) {
        const response = await this.client.Post('/custom_fields', { label })

        if (Array.isArray(response)) {
            return response.map(custom_field => new CustomField(this.client, custom_field))
        } else {
            return [ new CustomField(this.client, response) ]
        }
    }

    /**
     * @description Updates a custom field label. Note that the key and the name do not change even when the label is updated.
     *
     * @link {https://developers.convertkit.com/#update-field|ConvertKit Documentation}
     *
     * @param {string} custom_field_id - The ID of the custom field your updating.
     * @param {string} label - The new label of the custom field.
     *
     * @throws {ConvertKitNetworkError}
     *
     * @return {Promise<null>}
     */
    async updateCustomField(custom_field_id, label) {
        await this.client.Put(`/custom_fields/${custom_field_id}`, { label })

        return null
    }

    /**
     * @description Destroys a custom field. Note that this will remove all data in this field from your subscribers.
     *
     * @link {https://developers.convertkit.com/#destroy-field|ConvertKit Documentation}
     *
     * @return {Promise<null>}
     */
    async deleteCustomField(custom_field_id) {
        await this.client.Delete(`/custom_fields/${custom_field_id}`)

        return null
    }
}

module.exports = CustomFields
