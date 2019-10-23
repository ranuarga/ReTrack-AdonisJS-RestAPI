'use strict'
const Police = use('App/Models/Police')

class PoliceController {
    async index ({ response }) {
        // return Police.all()
        try{
            const police = await Police.query()
                .fetch()
            
            return police
        } catch (err) {
            return response.status(err.status)
        }
    }
    // creating and saving a new police officer
    async store ({ request, response }) {
        try {
            // getting data passed within the request
            // request only is to return object only with the specified keys
            const data = request.only(
                [
                    'police_employee_number',
                    'police_name',
                    'police_password',
                    'police_birthdate',
                    'police_gender',
                    'police_photo',
                    'police_status'
                ]
            )

            // looking for police in database check same if not rejected
            // if police exists don't save
            const policeExists = await Police.findBy('police_employee_number', data.police_employee_number)
            if (policeExists) {
                return response
                    .status(400)
                    .send({ message: { error: 'Police already registered' } })
            }

            // if police doesn't exist, proceeds with saving in DB
            const police = await Police.create(data)

            return police
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
        // you can create like this too
        // const police = new Police()
        // police.police_employee_number = request.input('police_employee_number')

        // await police.save()
        // return police
    }

    async show ({ params, request, response}) {
        try {
            const policeId = params.id
        
            const police = await Police.query()
                .where({
                    police_id: policeId
                }).fetch()
        
            if (police.rows.length === 0) {
                return response
                    .status(404)
                    .send({ message: {
                        error: 'No police found'
                    } })
            }
        
            return police
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({ message: {
                        error: 'No police found'
                    } })
            }
            return response.status(err.status)
        }
    }

    async update ({ request, response, params}) {
        const policeId = params.id
        const { 
            police_employee_number,
            police_name,
            police_password,
            police_birthdate,
            police_gender,
            police_photo,
            police_status 
        } = request.only(
            [
                'police_employee_number',
                'police_name',
                'police_password',
                'police_birthdate',
                'police_gender',
                'police_photo',
                'police_status'
            ]
        )

        // look police in db
        
        const police = await Police.findByOrFail('police_id', policeId)

        // update police data
        police.police_employee_number = police_employee_number
        police.police_name = police_name
        police.police_password = police_password
        police.police_birthdate = police_birthdate
        police.police_gender = police_gender
        police.police_photo = police_photo
        police.police_status =police_status

        // save data
        await police.save()
    }

    async destroy ({ params, request, response }) {
        try {
            const policeId = params.id

            const police = await Police.query()
                .where({
                    police_id: policeId
                }).delete()
        } catch (err) {
            
        }
    }
}

module.exports = PoliceController