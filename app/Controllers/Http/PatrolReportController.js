'use strict'

const History = use('App/Models/PatrolReport')

class PatrolReportController {
    async index ({ response }) {
        // return History.all()
        try {
            const patrol_report = await PatrolReport.query()
                .with('user')
                .fetch()
        
            return patrol_report
        } catch (err) {
            return response.status(err.status)
        }
    }

    
}

module.exports = PatrolReportController
