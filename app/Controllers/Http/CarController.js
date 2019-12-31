'use strict'

const Car = use('App/Models/Car')

class CarController {
    
    async index({ response }) {
        try {
            const car = await Car.query()
                .fetch()
            return car
        } catch (err) {
            return response.status(err.status)
        }
    }

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

    async show({ params, response}) {
        try {
            const carId = params.id

            let car = await Car.findOrFail(params.id)

            car = await Car.query()
                .where({
                    car_id: carId
                })
                .first()

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

    async destroy({ params }) {
        try {
            const carId = params.id

            let car = await Car.findOrFail(carId)

            car = await Car.query()
                .where({
                    car_id: carId
                }).delete()
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No Car found'
                } })
            }
            return response.status(err.status)
        }
    }

}

module.exports = CarController
