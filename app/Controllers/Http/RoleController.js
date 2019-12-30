'use strict'
const Role = use('App/Models/Role')

class RoleController {
    async index ({ response }) {
        // return Role.all()

        try {
            const role = await Role.query()
                .fetch()

            return role
        } catch (err) {
            return response.status(err.status)
        }
    }

    async store ({ request }) {
        const role = new Role()
        role.role_name = request.input('role_name')
        
        await role.save()
        return role
    }

    async show ({ params, response}) {
        try {
            const roleId = params.id
    
            let role = await Role.findOrFail(params.id)

            role = await Role.query()
                .where({
                    role_id: roleId
                }).first()
    
            return role
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No role found'
                } })
            }
            return response.status(err.status)
        }
    }

    async update ( { params, request }) {
        const roleId = params.id 
        const role_name = request.input('role_name')

        const role = await Role.findByOrFail('role_id', roleId)

        role.role_name = role_name

        await role.save()

        return role
    }

    async destroy ({ params }) {
        try {
            const roleId = params.id

            const role = await Role.query()
                .where({
                    role_id: roleId
                }).delete()
        } catch (err) {
            
        }
    }

}

module.exports = RoleController
