'use strict'

const paginatedRequest = async function* ({ client, url, options = {} }) {
    options.page = options.page || 0

    let response = null
    do {
        options.page += 1
        response = await client.Get(url, options)
        yield response
    } while (response.total_pages > options.page)
}

module.exports = paginatedRequest
