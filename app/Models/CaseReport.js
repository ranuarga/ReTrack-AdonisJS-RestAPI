'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseReport extends Model {
    static get primaryKey () {
        return 'case_report_id'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

    static get dates () {
        return super.dates.concat(['case_report_date'])
    }
    
    user () {
        return this.belongsTo('App/Models/User')
    }

    case_entry () {
        return this.belongsTo('App/Models/CaseEntry')
    }
}

module.exports = CaseReport
