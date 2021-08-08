'use strict'

class CustomField {
    /**
     * @constructor
     *
     * @param {ConvertKit} client - ConvertKit API Client
     * @param {object} custom_field - Broadcast Payload
     * @param {?string} custom_field.id
     * @param {?string} custom_field.name
     * @param {?string} custom_field.key
     * @param {?string} custom_field.label
     *
     * @property {ConvertKit} this.client - ConvertKit API client
     * @property {?string} this.id - ID of the CustomField
     * @property {?string} this.label - The label field is unique to your account. Whitespace is removed from the beginning and the end of your label when you create it.
     * @property {?string} this.key - The key is an ASCII-only, lowercase, underscored representation of your label. This key must be unique to your account. Keys are used in personalization tags in sequences and broadcasts.
     * @property {?string} this.name - Names are unique identifiers for use in the HTML of custom forms. They are made up of a combination of the ID and the key of the custom field prefixed with "ck_field".
     *
     * @this CustomField
     */
    constructor(client, custom_field) {
        this.client = client

        this.id = custom_field.id
        this.name = custom_field.name
        this.key = custom_field.key
        this.label = custom_field.label
    }

    /**
     * @description Updates a custom field label. Note that the key and the name do not change even when the label is updated.
     *
     * @link {https://developers.convertkit.com/#update-field|ConvertKit Documentation}
     *
     * @param {string} label - The new label of the custom field.
     *
     * @throws {ConvertKitNetworkError}
     *
     * @return {Promise<null>}
     */
    async update(label) {
        await this.client.Put(`/custom_fields/${this.id}`, { label })

        this.label = label

        return null
    }

    /**
     * @description Destroys a custom field. Note that this will remove all data in this field from your subscribers.
     *
     * @link {https://developers.convertkit.com/#destroy-field|ConvertKit Documentation}
     *
     * @return {Promise<null>}
     */
    async delete() {
        await this.client.Delete(`/custom_fields/${this.id}`)

        return null
    }

    /**
     * @description JSON.stringify format
     *
     * @link {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior}
     *
     * @return {{ id: string, name: string, key: string, label: string }}
     */
    toJSON() {
        return {
            id: this.id,
            label: this.label,
            key: this.key,
            name: this.name,
        }
    }
}

module.exports = CustomField
