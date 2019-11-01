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
  async index ({ request, response, view }) {
      try {
          const team = await Team.query()
            .with('users')
            .fetch()
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
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new team.
   * POST teams
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
        const data = request.only(
            [
              'car_id',
              'agenda_id'
            ]
        )

        const teamExists = await Team.findBy('agenda_id', data.agenda_id)
    
        if(teamExists){
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
  async show ({ params, request, response, view }) {
      try {
          const teamId = params.id

          const team = await Team.query()
              .where({
                  team_id: teamId
              }).with('car_id')
                .with('agenda_id')
                .first()

          if ( team.rows.length === 0) {
            return response
                .status(404)
                .send({
                    message: {
                        error: "No team found"
                    }
                })
        }

        return team
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

  /**
   * Render a form to update an existing team.
   * GET teams/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update team details.
   * PUT or PATCH teams/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
      const teamId = params.id
      const {
          car_id,
          agenda_id
          
      } = request.all()

      const team = await Team.findByOrFail('team_id',teamId)

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
  async destroy ({ params, request, response }) {
      try {
        const teamId = params.id

        const team = await Team.query()
          .where({
              team_id: teamId
          }).delete()
      } catch (err) {
        
      }
  }
}

module.exports = TeamController
