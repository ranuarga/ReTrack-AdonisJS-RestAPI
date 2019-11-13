'use strict'
const Checkpoint = use('App/Models/Checkpoint')

class CheckpointController {
    async index ({ response }) {
        // return Checkpoint.all()
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

            let checkpoint = Checkpoint
                .findOrFail(params.id)

            checkpoint = await Checkpoint.query()
                .where({
                    checkpoint_id: checkpointId
                })
                .with('agenda')
                .fetch()

            if (checkpoint.rows.length === 0) {
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

    async pagination({request, response}) {
        let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
        let page = pagination.page || 1;
        let limit = pagination.limit || 10;
        const checkpoint = await Checkpoint.query()
            .orderBy(`${pagination.column}`, `${pagination.sort}`)
            .paginate(page, limit)
        
        return response.json(checkpoint)
    }
  
    async search({request, response}) {
        let search = request.only(['column', 'value'])
        let checkpoint= await Checkpoint.query()
        .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
        .fetch()
  
        return response.json(checkpoint)
    }
}

module.exports = CheckpointController