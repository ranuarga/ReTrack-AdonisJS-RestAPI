'use strict'

const Agenda = use('App/Models/Agenda')

class AgendaController {
    async index ({ response }) {
        try {
            // return Agenda.all()
            const agenda = await Agenda.query()
                // .with('checkpoints')
                .fetch()

            return agenda
        } catch (err) {
            return response.status(err.status)
        }
    }

    async store ({ request, response}) {
        try {
            const data = request.only(
                [
                    'agenda_date',
                    'agenda_status',
                ]
            )

        const agenda = await Agenda.create(data)

        return agenda
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async update({ request, params}) {
        const agendaId = params.id

        const {
            agenda_date,
            agenda_status,
        } = request.all()

        const agenda = await Agenda.findByOrFail('agenda_id', agendaId)

        agenda.agenda_date = agenda_date
        agenda.agenda_status = agenda_status

        await agenda.save()
    }

    async show({params, response}){
        try {
            const agendaId = params.id

            const agenda = await Agenda.query()
                .where({
                    agenda_id: agendaId
                }).with('checkpoints')
                .fetch()

            if (agenda.rows.length === 0) {
                return response
                    .status(404)
                    .send({
                        message: {
                            error: "No agenda found"
                        }
                    })
            }

            return agenda
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No agenda found'
                } })
            }
            return response.status(err.status)
        }
    }

    async destroy({ params }) {
        try {
            const agendaId = params.id

            const agenda = await Checkpoint.query()
                .where({
                    agenda_id: agendaId
                }).delete()
        } catch (err) {
            
        }
    }
}

module.exports = AgendaController