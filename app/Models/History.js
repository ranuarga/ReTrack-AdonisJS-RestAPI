'use strict'

const Model = use('Model')

class History extends Model {
    static get primaryKey () {
        return 'history_id'
    }

    static get dates () {
        return super.dates.concat(['history_datetime'])
    }

    user () {
        return this.belongsTo('App/Models/User')
    }

    team () {
        return this.belongsTo('App/Models/Team')
    }
}

module.exports = History
