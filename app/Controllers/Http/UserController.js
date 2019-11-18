'use strict'
const User = use('App/Models/User')

class UserController {
    async index ({ response }) {
        // return User.all()

        try {
            const user = await User.query()
                .with('role')
                .fetch()
            return user
        } catch (err) {
            return response.status(err.status)
        }

    }
    
    async store ({ request, response }) {
        try {
            const data = request.only(
                [
                    'user_employee_id',
                    'user_name',
                    'user_password',
                    'user_birthdate',
                    'user_gender',
                    'user_photo',
                    'role_id',
                    'user_status'
                ]
            )

            const userExists = await User.findBy('user_employee_id', data.user_employee_id)

            if(userExists) {
                return response
                    .status(400)
                    .send({
                        message: {
                            error: 'User already created'
                        }
                    })
            }

            const user = await User.create(data)

            return user
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async update ({ request, response, params}) {
        const userId = params.id
        const {
            user_employee_id,
            user_name,
            user_password,
            user_birthdate,
            user_gender,
            user_photo,
            role_id,
            user_status
        } = request.all()

        const user = await User.findByOrFail('user_id', userId)

        user.user_employee_id = user_employee_id
        user.user_name = user_name
        user.user_password = user_password
        user.user_birthdate = user_birthdate
        user.user_gender = user_gender
        user.user_photo = user_photo
        user.role_id = role_id
        user.user_status = user_status

        await user.save()
    }

    async show({ params, response}) {
        try {
            const userId = params.id

            let user = await User.findOrFail(params.id)

            user = await User.query()
                .where({
                    user_id: userId
                }).with('role')
                .first()

            return user
        }catch( err){
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No user found'
                } })
            }
            return response.status(err.status)
        }
    }    

    async destroy ({ params }) {
        try {
            const userId = params.id

            const user = await User.query()
                .where({
                    user_id: userId
                }).delete()
        } catch (err) {
            
        }
    }

    async pagination({request, response}) {
        let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
        let page = pagination.page || 1;
        let limit = pagination.limit || 10;
        const user = await User.query()
            .orderBy(`${pagination.column}`, `${pagination.sort}`)
            .paginate(page, limit)
        
        return response.json(user)
    }
  
    async search({request, response}) {
        let search = request.only(['column', 'value'])
        let user = await User.query()
        .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
        .fetch()
  
        return response.json(user)
    }
}

module.exports = UserController
