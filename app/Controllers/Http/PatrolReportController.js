'use strict'

const PatrolReport = use('App/Models/PatrolReport')

class PatrolReportController {
    async index({ response }) {
        // return PatrolReport.all()
        try {
            const patrol_report = await PatrolReport.query()
                .with('user')
                .with('agenda')
                .fetch()

            return patrol_report
        } catch (err) {
            return response.status(err.status)
        }
    }

    async store({ request, response }) {
        try {
            const data = request.only(
                [
                    'agenda_id',
                    'user_id',
                    'partrol_longitude',
                    'patrol_latitude',
                    'patrol_date',
                    'patrol_time',
                    'patrol_description',
                    'patrol_photo',
                    'patrol_status',
                ]
            )

            const agendaExists = await PatrolReport.findBy('agenda_id', data.agenda_id)
            const userExists = await PatrolReport.findBy('user_id', data.user_id)

            if(userExists && agendaExists){
                return response
                    .status(400)
                    .send({
                        message: {
                            error: 'Patrol already created'
                        }
                    })
            }

            const patrol_report = await PatrolReport.create(data)

            return patrol_report
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async update({ request, params }) {
        const patrol_reportId = params.id

        const {
            agenda_id,
            user_id,
            patrol_longitude,
            patrol_latitude,
            patrol_date,
            patrol_time,
            patrol_description,
            patrol_photo,
            patrol_status
        } = request.all()

        const patrol_report = await PatrolReport.findByOrFail('patrol_report_id', patrol_reportId)

        patrol_report.agenda_id = agenda_id
        patrol_report.user_id = user_id
        patrol_report.patrol_longitude = patrol_longitude
        patrol_report.patrol_latitude = patrol_latitude
        patrol_report.patrol_date = patrol_date
        patrol_report.patrol_time = patrol_time
        patrol_report.patrol_description = patrol_description
        patrol_report.patrol_photo = patrol_photo
        patrol_report.patrol_status = patrol_status

        await patrol_report.save()
    }

    async show({ params, response }) {
        try {
            const patrol_reportId = params.id

            let patrol_report = await PatrolReport
                .findOrFail(params.id)
            
            patrol_report = await PatrolReport.query()
                .where({
                    patrol_report_id: patrol_reportId
                })
                .with('user')
                .with('agenda')
                .fetch()

            // if (patrol_report.rows.length === 0) {
            //     return response
            //         .status(404)
            //         .send({
            //             message: {
            //                 error: "No patrol report found"
            //             }
            //         })
            // }

            return patrol_report
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({
                        message: {
                            error: 'No patrol report found'
                        }
                    })
            }
            return response.status(err.status)
        }
    }

    async destroy({ params }) {
        try {
            const patrol_reportId = params.id

            const patrol_report = await PatrolReport.query()
                .where({
                    patrol_report_id: patrol_reportId
                }).delete()
        } catch (err) {

        }
    }
}

module.exports = PatrolReportController
