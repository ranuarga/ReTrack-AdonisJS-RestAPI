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
  async index ({ response }) {
    // return Location.all()
    try {
      const location = await Location.query()
           .fetch()

      return location
    } catch (err){
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
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new location.
   * POST locations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
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
  async show ({ params, request, response, view }) {
      try {
          const locationId = params.id

          const location = await Location.query()
            .where({
              location_id: locationId
            }).first()

          if (location.rows.length === 0){
              return response
                  .status(404)
                  .send({ message: {
                      error: "No location found"
                } })
          }

          return location
      } catch (err) {
            if (err.name === 'ModelNotFoundException'){
                  return response
                      .status(err.status)
                      .send({ message: {
                          error: 'No location found'
                        } })
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
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update location details.
   * PUT or PATCH locations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
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
  async destroy ({ params, request, response }) {
      try {
          const locationId = params.id

          const location = await Location.query()
              .where({
                  location_id: locationId
              }).delete()
      } catch (err) {

      }
  }
}

module.exports = LocationController
