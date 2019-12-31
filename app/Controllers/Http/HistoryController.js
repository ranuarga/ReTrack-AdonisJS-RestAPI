'use strict'

const moment = use('moment')
const Database = use('Database')
const History = use('App/Models/History')

class HistoryController {

  async index({ response }) {
    // return History.all()
    try {
      const history = await History.query()
        .orderBy('history_id', 'asc')
        .with('user')
        .fetch()

      return history
    } catch (err) {
      return response.status(err.status)
    }
  }

  async historyLatest({ response }) {
    try {
      const subQuery = Database
        .from('histories')
        .max('history_id')
        .groupBy('team_id')
        .select()

      const history = await History.query()
        .whereIn('history_id', subQuery)
        .andWhere('history_datetime', '>', moment().subtract(1, 'days').startOf('day'))
        .with('user')
        .fetch()

        return history
    } catch (err) {
      return response.status(err.status)
    }
  }

  async historyToday({ response }) {
    try {
      const history = await History.query()
        .where('history_datetime', '>', moment().subtract(1, 'days').startOf('day'))
        .orderBy('history_id', 'asc')
        .with('user')
        .fetch()

      return history
    } catch (err) {
      return response.status(err.status)
    }
  }

  async historyDistinct({ response }) {
    try {
      const history = await History.query()
        .distinct('user_id')
        .distinct('team_id')
        .distinct('history_longitude')
        .distinct('history_latitude')
        .distinct('history_datetime')
        .with('user')
        .fetch()

      return history
    } catch (err) {
      return response.status(err.status)
    }
  }

  async historyDistinctToday({ response }) {
    try {
      const history = await History.query()
        .distinct('user_id')
        .distinct('team_id')
        .distinct('history_longitude')
        .distinct('history_latitude')
        .distinct('history_datetime')
        .where('history_datetime', '>', moment().subtract(1, 'days').startOf('day'))
        .with('user')
        .fetch()

      return history
    } catch (err) {
      return response.status(err.status)
    }
  }

  async store({ request, response, auth }) {
    try {
      const {
        team_id, history_longitude, history_latitude, history_accuracy, history_datetime
      } = request.all()

      const user_id = auth.user.user_id
      const newHistory = await History.create(
        {
          user_id, team_id, history_longitude, history_latitude, history_accuracy, history_datetime
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

  async show({ params, response }) {
    try {
      const historyId = params.id

      let history = await History.findOrFail(params.id)

      history = await History.query()
        .where({
          history_id: historyId
        }).with('user')
        .first()

      return history
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
        return response
          .status(err.status)
          .send({
            message: {
              error: 'No history found'
            }
          })
      }
      return response.status(err.status)
    }
  }

  async update({ params, request }) {
    const historyId = params.id
    const {
      user_id, team_id, history_longitude, history_latitude, history_accuracy, history_datetime
    } = request.all()

    const history = await History.findByOrFail('history_id', historyId)

    history.user_id = user_id
    history.team_id = team_id
    history.history_longitude = history_longitude
    history.history_latitude = history_latitude
    history.history_accuracy = history_accuracy
    history.history_datetime = history_datetime

    await history.save()
  }

  async destroy({ params }) {
    try {
      const historyId = params.id

      let history = await History.findOrFail(historyId)

      history = await History.query()
        .where({
          history_id: historyId
        }).delete()
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

}

module.exports = HistoryController
