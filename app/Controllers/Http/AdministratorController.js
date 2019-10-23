'use strict'
const Administrator = use('App/Models/Administrator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with administrators
 */
class AdministratorController {
  /**
   * Show a list of all administrators.
   * GET administrators
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    // return Administrator.all()
    try {
      const administrator = await Administrator.query()
            .fetch()
      
      return administrator
    } catch (err) {
      return response.status(err.status)
    }
  }

  /**
   * Render a form to be used for creating a new administrator.
   * GET administrators/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new administrator.
   * POST administrators
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
        // getting data passed within the request
        // request only is to return object only with the specified keys
        const data = request.only(
          [
              'admin_employee_number',
              'admin_name',
              'admin_password',
              'admin_birthdate',
              'admin_gender',
              'admin_photo',
              'admin_status'
          ]
        )

        //looking for administrator in database check same if not rejected
        // if administrator exists don't save
        const administratorExists = await Administrator.findBy('admin_employee_number', data.admin_employee_number)
        if (administratorExists) {
          return response
              .status(400)
              .send({ message: { error: 'Admin already registered' } })
      }

      const administrator = await Administrator.create(data)

      return administrator
    } catch (error) {
      return response
        .status(err.status)
        .send(err)
    }
  }

  /**
   * Display a single administrator.
   * GET administrators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response}) {
      try {
        const adminId = params.id

        const administrator = await Administrator.query()
            .where({
              admin_id: adminId
            }).fetch()

          if (administrator.rows.length === 0){
              return response
                .status(404)
                .send({ message: {
                    error: "Administrator not found"
                } })
          }

          return administrator
      } catch (error) {
          if(err.name === 'ModelNotFoundException'){
                return response
                    .status(err.status)
                    .send({ message: {
                        error: 'Administrator not found'
                    } })
          }
          return response.status(err.status)
      }
  }

  /**
   * Render a form to update an existing administrator.
   * GET administrators/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update administrator details.
   * PUT or PATCH administrators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
      const adminId = params.id
      const {
          admin_employee_number,
          admin_name,
          admin_password,
          admin_birthdate,
          admin_gender,
          admin_photo,
          admin_status
      } = request.only(
          [
            'admin_employee_number',
            'admin_name',
            'admin_password',
            'admin_birthdate',
            'admin_gender',
            'admin_photo',
            'admin_status'
          ]
        )
        // look administrator in db

        const administrator = await Administrator.findByOrFail('admin_id', adminId)
      
        // update administrator data
        administrator.admin_employee_number = admin_employee_number
        administrator.admin_name = admin_name
        administrator.admin_password = admin_password
        administrator.admin_birthdate = admin_birthdate
        administrator.admin_gender = admin_gender
        administrator.admin_photo = admin_photo
        administrator.admin_status = admin_status

        //save data
        await administrator.save()
        
  }

  /**
   * Delete a administrator with id.
   * DELETE administrators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
      try {
          const adminId = params.id

          const administrator = await Administrator.query()
              .where({
                  admin_id: adminId
              }).delete()
      } catch (err) {
        
      }
  }
}

module.exports = AdministratorController
