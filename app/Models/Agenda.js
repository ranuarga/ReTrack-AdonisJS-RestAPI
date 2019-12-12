'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Agenda extends Model {
    
    // Add this shit because this model read the table as 'agenda' not 'agendas'.
    // lol idk why tho, probably its someone fault when making the migration/model/controller
    static get table () {
        return 'agendas'
    }

    static get primaryKey () {
        return 'agenda_id'
    }


    static get dates () {
        return super.dates.concat(['agenda_date'])
    }

    checkpoints () {
        return this.hasMany('App/Models/Checkpoint')
    }

    patrol_reports () {
        return this.hasMany('App/Models/PatrolReport')
    }

    team () {
        return this.hasOne('App/Models/Team')
    }
}

module.exports = Agenda
