'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Team extends Model {
    static get primaryKey(){
        return 'team_id'
    }

    static get createdAtColumn(){
        return null;
    }

    static get updatedAtColumn(){
        return null;
    }

    users() {
        return this.belongsToMany('App/Models/User')
                 .pivotTable('members')
    }
}

module.exports = Team
