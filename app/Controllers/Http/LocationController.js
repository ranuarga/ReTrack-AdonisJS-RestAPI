'use strict'
const Location = use('App/Models/Location')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with locations
 */
class LocationController {
  /**
   * Show a list of all locations.
   * GET locations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response }) {
    // return Location.all()
    try {
      const location = await Location.query()
        .fetch()

      return location
    } catch (err) {
      return response.status(err.status)
    }
  }

  /**
   * Render a form to be used for creating a new location.
   * GET locations/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new location.
   * POST locations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      // getting data passed within the request
      // request only is to return object only with the specified keys      
      const data = request.only(
        [
          'location_name',
          'location_longitude',
          'location_latitude'
        ]
      )
      const location = await Location.create(data)

      return location
    } catch (err) {
      return response
        .status(err.status)
        .send(err)
    }
  }

  /**
   * Display a single location.
   * GET locations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const locationId = params.id

      let location = await Location
        .findOrFail(params.id)

      location = await Location.query()
        .where({
          location_id: locationId
        }).first()

      return location
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
        return response
          .status(err.status)
          .send({
            message: {
              error: 'No location found'
            }
          })
      }
      return response.status(err.status)
    }
  }

  /**
   * Render a form to update an existing location.
   * GET locations/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update location details.
   * PUT or PATCH locations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const locationId = params.id
    const {
      location_name,
      location_longitude,
      location_latitude
    } = request.only(
      [
        'location_name',
        'location_longitude',
        'location_latitude'
      ]
    )

    // look location in db

    const location = await Location.findByOrFail('location_id', locationId)

    // update location data
    location.location_name = location_name
    location.location_longitude = location_longitude
    location.location_latitude = location_latitude

    // save data
    await location.save()
  }

  /**
   * Delete a location with id.
   * DELETE locations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const locationId = params.id

      const location = await Location.query()
        .where({
          location_id: locationId
        }).delete()
    } catch (err) {

    }
  }

  async pagination({request, response}) {
      let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
      let page = pagination.page || 1;
      let limit = pagination.limit || 10;
      const location = await CaseEntry.query()
          .orderBy(`${pagination.column}`, `${pagination.sort}`)
          .paginate(page, limit)
      
      return response.json(location)
  }

  async search({request, response}) {
      let search = request.only(['column', 'value'])
      let location = await Location.query()
      .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
      .fetch()

      return response.json(location)
  }
}

module.exports = LocationController
