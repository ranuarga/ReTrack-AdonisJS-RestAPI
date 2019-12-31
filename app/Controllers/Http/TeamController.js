'use strict'

const Team = use('App/Models/Team')

class TeamController {
    
    async index({ response }) {
        try {
            const team = await Team.query()
                .with('coordinator')
                .with('users')
                .with('car')
                .with('agenda')
                .with('agenda.checkpoints', (builder) => {
                    builder.orderBy('checkpoint_id', 'asc')
                })
                .fetch()
            
            return team
        } catch (err) {
            return response.status(err.status)
        }
    }

    async store({ request, response }) {
        try {
            const data = request.only(
                [
                    'user_id',
                    'car_id',
                    'agenda_id'
                ]
            )
            
            if(data.agenda_id == null) {
                return response
                    .status(400)
                    .send({
                        message: {
                            error: 'agenda_id is required'
                        }
                    })
            }
            
            const teamExists = await Team.findBy('agenda_id', data.agenda_id)

            if (teamExists) {
                return response
                    .status(400)
                    .send({
                        message: {
                            error: 'Team already created'
                        }
                    })
            }

            const team = await Team.create(data)

            return team
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async show({ params, response }) {
        try {
            const teamId = params.id

            let team = await Team
                .findOrFail(params.id)

            team = await Team.query()
                .where({
                    team_id: teamId
                })
                .with('coordinator')
                .with('users')
                .with('car')
                .with('agenda')
                .with('agenda.checkpoints', (builder) => {
                    builder.orderBy('checkpoint_id', 'asc')
                })
                .first()

            return team
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({
                        message: {
                            error: 'No team found'
                        }
                    })
            }
            return response.status(err.status)
        }
    }

    async update({ params, request }) {
        const teamId = params.id
        const {
            user_id,
            car_id,
            agenda_id

        } = request.all()

        const team = await Team.findByOrFail('team_id', teamId)

        team.user_id = user_id
        team.car_id = car_id
        team.agenda_id = agenda_id

        await team.save()
    }

    async destroy({ params }) {
        try {
            const teamId = params.id

            let team = await team.findByOrFail(teamId)

            team = await Team.query()
                .where({
                    team_id: teamId
                }).delete()
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No team found'
                } })
            }
            return response.status(err.status)
        }
    }

}

module.exports = TeamController
