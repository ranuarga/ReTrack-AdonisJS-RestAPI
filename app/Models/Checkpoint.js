'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Checkpoint extends Model {
    static get primaryKey () {
        return 'checkpoint_id'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

    agenda () {
        return this.belongsTo('App/Models/Agenda')
    }
}

module.exports = Checkpoint
