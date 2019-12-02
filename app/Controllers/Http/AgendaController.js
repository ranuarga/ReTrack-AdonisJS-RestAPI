'use strict'

const Agenda = use('App/Models/Agenda')
const moment = use('moment')

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

            let agenda = await Agenda
                .findOrFail(params.id)
            
            agenda = await Agenda.query()
                .where({
                    agenda_id: agendaId
                }).with('checkpoints')
                .with('team')
                .with('team.car')
                .with('team.members')
                .with('team.members.user')
                .first()

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

    async showUserAgendaNow({params, response}){
        try {            
            let agenda = await Agenda.query()
                .innerJoin('teams', 'teams.agenda_id', 'agendas.agenda_id')
                .innerJoin('members', 'members.team_id', 'teams.team_id')
                .where('agenda_status', 'true')
                .andWhere('agenda_date', moment())
                .andWhere('members.user_id', params.id)
                .with('checkpoints')
                .with('team')
                .with('team.coordinator')
                .with('team.car')
                .with('team.user')
                .with('team.members')
                .with('team.members.user')
                .first()

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

    async showUserAgendaAll({params, response}){
        try {            
            let agenda = await Agenda.query()
                .innerJoin('teams', 'teams.agenda_id', 'agendas.agenda_id')
                .innerJoin('members', 'members.team_id', 'teams.team_id')
                .where('members.user_id', params.id)
                .with('checkpoints')
                .with('team')
                .with('team.car')
                .with('team.user')
                .with('team.members')
                .with('team.members.user')
                .fetch()

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

    async pagination({request, response}) {
        let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
        let page = pagination.page || 1;
        let limit = pagination.limit || 10;
        const agenda = await Agenda.query()
            .orderBy(`${pagination.column}`, `${pagination.sort}`)
            .paginate(page, limit)
        
        return response.json(agenda)
    }

    async search({request, response}) {
        let search = request.only(['column', 'value'])
        let agenda = await Agenda.query()
        .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
        .fetch()

        return response.json(agenda)
    }
}

module.exports = AgendaController