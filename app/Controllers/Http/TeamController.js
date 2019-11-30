'use strict'

const Team = use('App/Models/Team')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with teams
 */
class TeamController {
    /**
     * Show a list of all teams.
     * GET teams
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ response }) {
        try {
            const team = await Team.query()
                .with('coordinator')
                .with('users')
                .with('car')
                .with('agenda')
                .with('agenda.checkpoints')
                .fetch()
            
            return team
        } catch (err) {
            return response.status(err.status)
        }
    }

    /**
     * Render a form to be used for creating a new team.
     * GET teams/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new team.
     * POST teams
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            const data = request.only(
                [
                    'user_id',
                    'car_id',
                    'agenda_id'
                ]
            )

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

    /**
     * Display a single team.
     * GET teams/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
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
                .with('agenda.checkpoints')
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

    /**
     * Render a form to update an existing team.
     * GET teams/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update team details.
     * PUT or PATCH teams/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
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

    /**
     * Delete a team with id.
     * DELETE teams/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params }) {
        try {
            const teamId = params.id

            const team = await Team.query()
                .where({
                    team_id: teamId
                }).delete()
        } catch (err) {

        }
    }

    async pagination({request, response}) {
        let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
        let page = pagination.page || 1;
        let limit = pagination.limit || 10;
        const team = await Team.query()
            .orderBy(`${pagination.column}`, `${pagination.sort}`)
            .paginate(page, limit)
        
        return response.json(team)
    }
  
    async search({request, response}) {
        let search = request.only(['column', 'value'])
        let team = await Team.query()
        .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
        .fetch()
  
        return response.json(team)
    }
}

module.exports = TeamController
