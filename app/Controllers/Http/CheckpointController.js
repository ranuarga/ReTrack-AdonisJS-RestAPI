'use strict'
const Checkpoint = use('App/Models/Checkpoint')

class Checkpoint {
    async index ({ response }) {
        // return checkpoint.all()
        try {
            const checkpoint = await Checkpoint.query()
                .with('agenda')
                .fetch()

            return checkpoint
        } catch (err) {
            return response.status(err.status)
        }
    }

    async store ({ request, response}) {
        try {
            const data = request.only(
                [
                    'agenda_id',
                    'checkpoint_longitude',
                    'checkpoint_latitude',
                    'checkpoint_time'
                ]
            )

        const checkpoint = await Checkpoint.create(data)

        return checkpoint
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async update({ request, response, params}) {
        const checkpointId = params.id

        const {
            agenda_id,
            checkpoint_longitude,
            checkpoint_latitude,
            checkpoint_time
        } = request.all()

        const checkpoint = await Checkpoint.findByOrFail('checkpoint_id', checkpointId)

        checkpoint.agenda_id = agenda_id
        Checkpoint.checkpoint_longitude = checkpoint_longitude
        checkpoint.checkpoint_latitude = checkpoint_latitude
        checkpoint_time = checkpoint_time

        await checkpoint.save()
    }

    async show({params, response}){
        try {
            const checkpointId = params.id

            const checkpoint = await Checkpoint.query()
                .where({
                    checkpoint_id: checkpointId
                }).with('agenda_id')
                  .first()

            if (checkpoint.rows,length === 0) {
                return response
                    .status(404)
                    .send({
                        message: {
                            error: "No checkpoint found"
                        }
                    })

            }

            return checkpoint
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No checkpoint found'
                } })
            }
            return response.status(err.status)
        }
    }

    async destroy({ params}) {
        try {
            const checkpointId = params.id

            const checkpoint = await Checkpoint.query()
                .where({
                    checkpoint_id: checkpointId
                }).delete()
        } catch (err) {
            
        }
    }
}
