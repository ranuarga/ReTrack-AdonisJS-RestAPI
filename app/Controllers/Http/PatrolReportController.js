'use strict'

const fs = use('fs');
const Helpers = use('Helpers')
const Database = use('Database')
const PatrolReport = use('App/Models/PatrolReport')

class PatrolReportController {
    async index({ response }) {
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
    
    async countPatrolStatus ({ response }) {
        try {
            const patrol_report = await Database
                .select('patrol_status')
                .count('patrol_report_id')
                .from('patrol_reports')
                .andWhereNot('patrol_status', null)
                .groupBy('patrol_status')  
    
            return patrol_report
        } catch (err) {
            return response.status(err.status)
        }
    }

    async showUserReport({ params, response }) {
        try {
            const userId = params.id

            const patrol_report = await PatrolReport.query()
                .where({
                    user_id: userId
                })
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
            const patrol_report = new PatrolReport()
            
            const data = {
                agenda_id: request.input('agenda_id'),
                user_id: request.input('user_id'),
                patrol_longitude: request.input('patrol_longitude'),
                patrol_latitude: request.input('patrol_latitude'),
                patrol_date: request.input('patrol_date'),
                patrol_time: request.input('patrol_time'),
                patrol_description: request.input('patrol_description'),
                patrol_status: request.input('patrol_status'),
            }
            
            patrol_report.agenda_id = data.agenda_id
            patrol_report.user_id = data.user_id
            patrol_report.patrol_longitude = data.patrol_longitude
            patrol_report.patrol_latitude = data.patrol_latitude
            patrol_report.patrol_date = data.patrol_date
            patrol_report.patrol_time = data.patrol_time
            patrol_report.patrol_description = data.patrol_description
            patrol_report.patrol_status = data.patrol_status
            
            await patrol_report.save()
            
            if(request.file('patrol_photo')) {
                const photoFile = request.file('patrol_photo', {
                    types: ['image'],
                    size: '5mb'
                })

                let namePhotoPatrolReport = patrol_report.patrol_report_id + '.jpg'
        
                await photoFile.move(Helpers.publicPath('uploads/patrol_report'), {
                    name: namePhotoPatrolReport,
                    overwrite: true
                })
            
                if(!photoFile.moved()){
                    return photoFile.error()
                }
            
                patrol_report.patrol_photo = '/uploads/patrol_report/' + namePhotoPatrolReport
                patrol_report.save()
            }
            
            return response.status(200).send(patrol_report)
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
        patrol_report.patrol_status = patrol_status

        if(request.file('patrol_photo')) {
            const photoFile = request.file('patrol_photo', {
                types: ['image'],
                size: '5mb'
            })
            
            let namePhotoPatrolReport = patrol_report.patrol_report_id + '.jpg'
    
            await photoFile.move(Helpers.publicPath('uploads/patrol_report'), {
                name: namePhotoPatrolReport,
                overwrite: true
            })

            if(!photoFile.moved()){
                return photoFile.error()
            }

            patrol_report.patrol_photo = '/uploads/patrol_report/' + namePhotoPatrolReport
        }

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
                .first()
                
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

            let patrol_report = await PatrolReport.findOrFail(patrol_reportId)

            patrol_report = await PatrolReport.query()
                .where({
                    patrol_report_id: patrol_reportId
                }).first()

            if(patrol_report.patrol_photo && fs.existsSync(Helpers.publicPath(patrol_report.patrol_photo))) {
                fs.unlinkSync(Helpers.publicPath(patrol_report.patrol_photo))
            }
        
            patrol_report.delete()   
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No patrol report found'
                } })
            }
            return response.status(err.status)
        }
    }
}

module.exports = PatrolReportController
