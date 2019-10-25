'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class History extends Model {
    static get primaryKey () {
        return 'history_id'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

    static get dates () {
        return super.dates.concat(['history_datetime'])
    }

    user () {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = History
