'use strict'

const Model = use('Model')

class CaseReport extends Model {
    static get primaryKey () {
        return 'case_report_id'
    }

    static get dates () {
        return super.dates.concat(['case_report_date'])
    }
    
    user () {
        return this.belongsTo('App/Models/User')
    }

    // Usually we fill belongsTo only with model but
    // if it's not working specify PK(param 2) & FK(param 3)
    case_entry () {
        return this.belongsTo('App/Models/CaseEntry', 'case_id', 'case_id')
    }
}

module.exports = CaseReport
