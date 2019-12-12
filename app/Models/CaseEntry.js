'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseEntry extends Model {
    static get primaryKey () {
        return 'case_id'
    }

    static get dates () {
        return super.dates.concat(['case_date'])
    }
    
    category () {
        return this.belongsTo('App/Models/Category')
    }

    case_reports () {
        return this.hasMany('App/Models/CaseReport')
    }
}

module.exports = CaseEntry
