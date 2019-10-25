'use strict'
const History = use('App/Models/History')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with histories
 */
class HistoryController {
  /**
   * Show a list of all histories.
   * GET histories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    // return History.all()
    try {
      const history = await History.query()
        .with('user')
        .fetch()
      
      return history
    } catch (err) {
      return response.status(err.status)
    }
  }

  /**
   * Render a form to be used for creating a new history.
   * GET histories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new history.
   * POST histories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  
  async store ({ request, response //, auth
  }) {
    try {
      const {
        user_id, team_id, history_longitude, history_latitude, history_datetime
      } = request.all()
      // or if we want to get user id who is login right now we can use this but we must add auth first
      // const user_id = auth.user.user_id
      const newHistory = await History.create(
        {
          user_id, team_id, history_longitude, history_latitude, history_datetime
        }
      )

      return newHistory
    } catch (err) {
      return response.status(err.status).send(
        {
          message: {
            error: 'Something went wrong while creating new history'
          }
        }
      )
    }
  }

  /**
   * Display a single history.
   * GET histories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response}) {
    try {
      const historyId = params.id

      const history = await History.query()
      .where({
        history_id: historyId
      }).with('user')
      .fetch()

      if (history.rows.length === 0) {
        return response
          .status(404)
          .send({ message: {
            error: 'No history found'
          } })
      }

      return history
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
        return response
          .status(err.status)
          .send({ message: {
            error: 'No history found'
          } })
      }
      return response.status(err.status)
    }
  }

  /**
   * Render a form to update an existing history.
   * GET histories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update history details.
   * PUT or PATCH histories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const historyId = params.id
    const {
      user_id, team_id, history_longitude, history_latitude, history_datetime
    } = request.all()

    const history = await History.findByOrFail('history_id', historyId)

    history.user_id = user_id
    history.team_id = team_id
    history.history_longitude = history_longitude
    history.history_latitude = history_latitude
    history.history_datetime = history_datetime

    await history.save()
  }

  /**
   * Delete a history with id.
   * DELETE histories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    try {
      const historyId = params.id; //history_id to be deleted

      // looking for history
      const history = await History.query()
      .where({
        history_id: historyId
      }).delete()
    } catch (err) {
      
    }
  }
}

module.exports = HistoryController
