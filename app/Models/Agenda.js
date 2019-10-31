'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Agenda extends Model {
    static get primaryKey () {
        return 'agenda_id'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

    static get dates () {
        return super.dates.concat(['agenda_date'])
    }

    team () {
        return this.belongsTo('App/Models/Team')
    }

    checkpoints () {
        return this.hasMany('App/Models/Checkpoint')
    }

    patrol_reports () {
        return this.hasMany('App/Models/PatrolReport')
    }
}

module.exports = Agenda
