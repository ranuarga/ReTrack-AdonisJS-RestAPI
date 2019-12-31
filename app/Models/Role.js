'use strict'

const Model = use('Model')

class Role extends Model {
    static get primaryKey () {
        return 'role_id'
    }
    

    users () {
        return this.hasMany('App/Models/User')
    }
}

module.exports = Role
