'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Checkpoint extends Model {
    static get primaryKey () {
        return 'checkpoint_id'
    }

    static get dates () {
        return super.dates.concat(['checkpoint_datetime'])
    }

    agenda () {
        return this.belongsTo('App/Models/Agenda')
    }
}

module.exports = Checkpoint
