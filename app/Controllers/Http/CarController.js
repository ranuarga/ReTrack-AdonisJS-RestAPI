'use strict'

const Car = use('App/Models/Car')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with cars
 */
class CarController {
    /**
       * Show a list of all cars.
       * GET cars
       *
       * @param {object} ctx
       * @param {Request} ctx.request
       * @param {Response} ctx.response
       * @param {View} ctx.view
       */
    async index({ response }) {
        try {
            // return Car.all()
            const car = await Car.query()
                // .with('teams')
                .fetch()
            return car
        } catch (err) {
            return response.status(err.status)
        }
    }

    /**
       * Render a form to be used for creating a new car.
       * GET cars/create
       *
       * @param {object} ctx
       * @param {Request} ctx.request
       * @param {Response} ctx.response
       * @param {View} ctx.view
       */
    async create({ request, response, view }) {
    }

    /**
       * Create/save a new car.
       * POST cars
       *
       * @param {object} ctx
       * @param {Request} ctx.request
       * @param {Response} ctx.response
       */
    async store({ request, response }) {
        try {
            const data = request.only(
                [
                    'car_number',
                    'car_brand',
                    'car_type'
                ]
            )

            const carExists = await Car.findBy('car_number', data.car_number)

            if (carExists) {
                return response
                    .status(400)
                    .send({
                        message: {
                            error: 'car already created'
                        }
                    })
            }

            const car = await Car.create(data)

            return car
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    /**
       * Display a single car.
       * GET cars/:id
       *
       * @param {object} ctx
       * @param {Request} ctx.request
       * @param {Response} ctx.response
       * @param {View} ctx.view
       */
    async show({ params, response}) {
        try {
            const carId = params.id

            let car = await Car.findOrFail(params.id)

            car = await Car.query()
                .where({
                    car_id: carId
                })
                // .with('teams')
                .fetch()

            // if (car.rows.length === 0) {
            //     return response
            //         .status(404)
            //         .send({
            //             message: {
            //                 error: 'No car found'
            //             }
            //         })
            // }

            return car
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({
                        message: {
                            error: 'No car found'
                        }
                    })
            }
            return response.status(err.status)
        }
    }

    /**
       * Render a form to update an existing car.
       * GET cars/:id/edit
       *
       * @param {object} ctx
       * @param {Request} ctx.request
       * @param {Response} ctx.response
       * @param {View} ctx.view
       */
    async edit({ params, request, response, view }) {
    }

    /**
       * Update car details.
       * PUT or PATCH cars/:id
       *
       * @param {object} ctx
       * @param {Request} ctx.request
       * @param {Response} ctx.response
       */
    async update({ params, request }) {
        const carId = params.id
        const {
            car_number,
            car_brand,
            car_type
        } = request.all()

        const car = await Car.findByOrFail('car_id', carId)

        car.car_number = car_number,
        car.car_brand = car_brand,
        car.car_type = car_type

        await car.save()
    }

    /**
     * Delete a car with id.
     * DELETE cars/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params }) {
        try {
            const carId = params.id

            const car = await Car.query()
                .where({
                    car_id: carId
                }).delete()
        } catch (err) {

        }
    }

    async pagination({request, response}) {
        let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
        let page = pagination.page || 1;
        let limit = pagination.limit || 10;
        const car = await Car.query()
            .orderBy(`${pagination.column}`, `${pagination.sort}`)
            .paginate(page, limit)
        
        return response.json(car)
    }

    async search({request, response}) {
        let search = request.only(['column', 'value'])
        let car = await Car.query()
        .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
        .fetch()

        return response.json(car)
    }
}

module.exports = CarController
