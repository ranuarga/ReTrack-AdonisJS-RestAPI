'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
    static get primaryKey () {
        return 'role_id'
    }
    
    static get createdAtColumn () {
        return null
    }
    
    static get updatedAtColumn () {
        return null
    }

    users () {
        return this.hasMany('App/Models/User')
    }
}

module.exports = Role
