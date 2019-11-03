'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Member extends Model {
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

    user () {
        return this.belongsTo('App/Models/User');
    }

    team () {
        return this.belongsTo('App/Models/Team');
    }
}

module.exports = Member
