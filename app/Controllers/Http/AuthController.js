'use strict'
const Police = use('App/Models/Police')

class AuthController {
    async login({request, auth, response}) {

        const {police_employee_number, police_password} = request.all();

        try {
            if (await auth.attempt(police_employee_number, police_password)) {
                let police = await User.findBy('police_employee_number', police_employee_number)
                let token = await auth.generate(police)

                Object.assign(police, token)
                return response.json(police)
            }


        }
        catch (err) {
            console.log(err)
            return response.json({message: 'You are not registered!'})
        }
    }
}

module.exports = AuthController
