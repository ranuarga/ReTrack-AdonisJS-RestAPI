'use strict'

const CaseEntry = use('App/Models/CaseEntry')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with caseentries
 */
class CaseEntryController {
  /**
   * Show a list of all caseentries.
   * GET caseentries
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    // return CaseEntry.all()
    try {
      const case_entry = await CaseEntry.query()
          .with('category')
          // .with('case_reports')
          .fetch()

      return case_entry
  } catch (err) {
      return response.status(err.status)
  }
  }

  /**
   * Render a form to be used for creating a new caseentry.
   * GET caseentries/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new caseentry.
   * POST caseentries
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const data = request.only(
        [
          'category_id',
          'case_reporter',
          'case_date',
          'case_time',
          'case_longitude',
          'case_latitude',
          'case_description',
          'case_photo'
        ]
      )
      const case_entry = await CaseEntry.create(data)

      return case_entry
    } catch (err) {
      return response
        .status(err.status)
        .send(err)
    }
  }

  /**
   * Display a single caseentry.
   * GET caseentries/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    try {
      const caseId = params.id

      const case_entry = await CaseEntry.query()
          .where({
              case_id: caseId
          })
          .with('category')
          // .with('case_reports')
          .fetch()

      if (case_entry.rows.length === 0) {
          return response
              .status(404)
              .send({
                  message: {
                      error: "No case entry found"
                  }
              })
      }

      return case_entry
  } catch (err) {
      if (err.name === 'ModelNotFoundException') {
          return response
              .status(err.status)
              .send({
                  message: {
                      error: 'No case entry found'
                  }
              })
      }
      return response.status(err.status)
  }
  }

  /**
   * Render a form to update an existing caseentry.
   * GET caseentries/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update caseentry details.
   * PUT or PATCH caseentries/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const caseId = params.id

        const {
          category_id,
          case_reporter,
          case_date,
          case_time,
          case_longitude,
          case_latitude,
          case_description,
          case_photo
        } = request.all()

        const case_entry = await CaseEntry.findByOrFail('case_id', caseId)

        case_entry.category_id = category_id
        case_entry.case_reporter = case_reporter
        case_entry.case_date = case_date
        case_entry.case_time = case_time
        case_entry.case_longitude = case_longitude
        case_entry.case_latitude = case_latitude
        case_entry.case_description = case_description
        case_entry.case_photo = case_photo

        await case_entry.save()
  }

  /**
   * Delete a caseentry with id.
   * DELETE caseentries/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    try {
      const caseId = params.id

      const case_entry = await CaseEntry.query()
          .where({
              case_id: caseId
          }).delete()
    } catch (err) {

    }
  }
}

module.exports = CaseEntryController
