'use strict'

const buildSubscriptionFilter = (filters = {}, initial = {}) => {
    if (filters.sort_order === 'asc' || filters.sort_order === 'desc') {
        initial.sort_order = filters.sort_order
    }

    if (filters.subscriber_state === 'active' || filters.sort_order === 'cancelled') {
        initial.subscriber_state = filters.subscriber_state
    }

    return initial
}

module.exports = buildSubscriptionFilter
