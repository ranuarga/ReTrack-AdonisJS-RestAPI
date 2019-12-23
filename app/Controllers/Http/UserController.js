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
            const user = new User()

            const data = request.only(
                [
                    'user_employee_id',
                    'user_name',
                    'user_password',
                    'user_birthdate',
                    'user_gender',
                    'role_id',
                    'user_status'
                ]
            )

            user.user_employee_id = data.user_employee_id
            user.user_name = data.user_name
            user.user_password = data.user_password
            user.user_gender = data.user_gender
            user.role_id = data.role_id
            user.user_status = data.user_status
            
            const userExists = await User.findBy('user_employee_id', data.user_employee_id)

            if(userExists) {
                return response
                    .status(400)
                    .send({
                        message: {
                            error: 'User already created'
                        }
                    })
            }else{
                await user.save()
                 // IF user upload a photo when create user
                if(request.file('user_photo')) {
                    const photoFile = request.file('user_photo', {
                        types: ['image'],
                        size: '5mb'
                    })
                    
                    let namePhotoUser = user.user_id + '.jpg'

                    await photoFile.move(Helpers.publicPath('uploads/user'), {
                        name: namePhotoUser,
                        overwrite: true
                    })

                    if(!photoFile.moved()){
                        return photoFile.error()
                    }

                    user.user_photo = '/uploads/user/' + namePhotoUser
                    user.save()
                }
                return response.status(200).send(user)
            }
            
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
            role_id,
            user_status
        } = request.all()

        const user = await User.findByOrFail('user_id', userId)

        user.user_employee_id = user_employee_id
        user.user_name = user_name
        user.user_password = user_password
        user.user_birthdate = user_birthdate
        user.user_gender = user_gender
        user.role_id = role_id
        user.user_status = user_status

         // IF user upload a photo when create user
         if(request.file('user_photo')) {
            const photoFile = request.file('user_photo', {
                types: ['image'],
                size: '5mb'
            })
            
            let namePhotoUser = user.user_id + '.jpg'

            await photoFile.move(Helpers.publicPath('uploads/user'), {
                name: namePhotoUser,
                overwrite: true
            })

            if(!photoFile.moved()){
                return photoFile.error()
            }

            user.user_photo = '/uploads/user/' + namePhotoUser
        }

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
                }).first()

            if(user.user_photo && fs.existsSync(Helpers.publicPath(user.user_photo))) {
                fs.unlinkSync(Helpers.publicPath(user.user_photo))
                }
        
            user.delete()
        } catch (err) {
            return response
                .status(err.status)
                .send(err)  
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
