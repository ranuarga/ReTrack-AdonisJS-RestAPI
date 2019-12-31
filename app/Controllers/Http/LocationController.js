'use strict'
const Location = use('App/Models/Location')

class LocationController {
  
  async index({ response }) {
    try {
      const location = await Location.query()
        .fetch()

      return location
    } catch (err) {
      return response.status(err.status)
    }
  }

  async store({ request, response }) {
    try {
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

    const location = await Location.findByOrFail('location_id', locationId)

    location.location_name = location_name
    location.location_longitude = location_longitude
    location.location_latitude = location_latitude

    await location.save()
  }

  async destroy({ params, request, response }) {
    try {
      const locationId = params.id

      let location = await Location.findOrFail(locationId)

      location = await Location.query()
        .where({
          location_id: locationId
        }).delete()
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
        return response
        .status(err.status)
        .send({ message: {
            error: 'No location found'
        } })
      }
      return response.status(err.status)
    }
  }

}

module.exports = LocationController
