'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Team extends Model {
    static get primaryKey(){
        return 'team_id'
    }

    static get createdAtColumn(){
        return null
    }

    static get updatedAtColumn(){
        return null
    }

    users () {
        return this.belongsToMany('App/Models/User')
            .pivotTable('members')
    }

    coordinator () {
        return this.belongsTo('App/Models/User')
    }

    members () {
        return this.hasMany('App/Models/Member')
    }

    agenda () {
        return this.belongsTo('App/Models/Agenda')
    }

    car () {
        return this.belongsTo('App/Models/Car')
    }

    histories () {
        return this.hasMany('App/Models/History')
    }
}

module.exports = Team
