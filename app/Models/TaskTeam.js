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

    case () {
        return this.belongsTo('App/Models/Case');
    }

    team () {
        return this.belongsTo('App/Models/Team');
    }
}

module.exports = TaskTeam
