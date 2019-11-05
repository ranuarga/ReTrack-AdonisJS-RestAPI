'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TaskTeam extends Model {
    static get primaryKey () {
        return null
    }

    static get incrementing () {
        return false
    }
    
    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

    case_entry () {
        // This doesnt work
        // return this.belongsTo('App/Models/CaseEntry')
        // But this work, probably because the framework 
        // interpret the id as case_entry_id
        return this.belongsTo('App/Models/CaseEntry', 'case_id', 'case_id')
    }

    team () {
        return this.belongsTo('App/Models/Team')
    }
}

module.exports = TaskTeam
