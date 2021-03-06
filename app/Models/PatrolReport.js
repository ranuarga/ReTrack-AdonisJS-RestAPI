'use strict'

const Model = use('Model')

class PatrolReport extends Model {
    static get primaryKey () {
        return 'patrol_report_id'
    }

    static get dates () {
        return super.dates.concat(['patrol_date'])
    }
    
    user () {
        return this.belongsTo('App/Models/User')
    }

    agenda () {
        return this.belongsTo('App/Models/Agenda')
    }
}

module.exports = PatrolReport
