'use strict'
const Checkpoint = use('App/Models/Checkpoint')

class CheckpointController {
    async index ({ response }) {
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
                    'checkpoint_datetime'
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

    async update({ request, params}) {
        const checkpointId = params.id

        const {
            agenda_id,
            checkpoint_longitude,
            checkpoint_latitude,
            checkpoint_datetime
        } = request.all()

        const checkpoint = await Checkpoint.findByOrFail('checkpoint_id', checkpointId)

        checkpoint.agenda_id = agenda_id
        checkpoint.checkpoint_longitude = checkpoint_longitude
        checkpoint.checkpoint_latitude = checkpoint_latitude
        checkpoint.checkpoint_datetime = checkpoint_datetime

        await checkpoint.save()
    }

    async show({params, response}){
        try {
            const checkpointId = params.id

            let checkpoint = await Checkpoint
                .findOrFail(params.id)

            checkpoint = await Checkpoint.query()
                .where({
                    checkpoint_id: checkpointId
                })
                .with('agenda')
                .first()

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

            let chechkpoint = await Checkpoint.findByOrFail(checkpointId)

            checkpoint = await Checkpoint.query()
                .where({
                    checkpoint_id: checkpointId
                }).delete()
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No chechkpoint found'
                } })
            }
            return response.status(err.status)   
        }
    }

}

module.exports = CheckpointController