'use strict'
const User = use('App/Models/User')

class AuthController {
    async login({request, auth, response}) {

        const {user_employee_id, user_password} = request.all()

        try {
            if (await auth.attempt(user_employee_id, user_password)) {
                let user = await User.findBy('user_employee_id', user_employee_id)
                let token = await auth.generate(user)

                Object.assign(user, token)
                return response.json(user)
            }

        }
        catch (err) {
            console.log(err)
            return response.json({message: 'You are not registered!'})
        }
    }

    // async logout({ request, auth, response }){
    //     await auth.logout()
    //     return response.send({status : 200, "message" : 'success'})
    // }
}

module.exports = AuthController
