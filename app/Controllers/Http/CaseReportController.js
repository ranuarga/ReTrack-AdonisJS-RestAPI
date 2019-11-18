'use strict'

const CaseReport = use('App/Models/CaseReport')

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
      const case_report = await CaseReport.query()
          .with('user')
          .with('case_entry')
          .fetch()

      return case_report
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
          'user_id',
          'case_id',
          'case_report_date',
          'case_report_time',
          'case_report_longitude',
          'case_report_latitude',
          'case_report_description',
          'case_report_photo',
          'case_report_status',
        ]
      )
      const case_report = await CaseReport.create(data)

      return case_report
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
      const case_reportId = params.id

      let case_report = await CaseReport
        .findOrFail(params.id)

      case_report = await CaseReport.query()
          .where({
              case_report_id: case_reportId
          })
          .with('user')
          .with('case_entry')
          .first()

      return case_report
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
    const case_reportId = params.id

        const {
          user_report_id,
          case_report_id,
          case_report_reporter,
          case_report_date,
          case_report_time,
          case_report_longitude,
          case_report_latitude,
          case_report_description,
          case_report_photo
        } = request.all()

        const case_report = await CaseReport.findByOrFail('case_report_id', case_reportId)

        case_report.user_id = user_report_id
        case_report.case_id = case_report_id
        case_report.case_reporter = case_report_reporter
        case_report.case_date = case_report_date
        case_report.case_time = case_report_time
        case_report.case_report_longitude = case_report_longitude
        case_report.case_report_latitude = case_report_latitude
        case_report.case_description = case_report_description
        case_report.case_photo = case_report_photo

        await case_report.save()
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
      const case_reportId = params.id

      const case_report = await CaseReport.query()
          .where({
              case_report_id: case_reportId
          }).delete()
    } catch (err) {

    }
  }

  async pagination({request, response}) {
    let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
    let page = pagination.page || 1;
    let limit = pagination.limit || 10;
    const case_report = await CaseReport.query()
        .orderBy(`${pagination.column}`, `${pagination.sort}`)
        .paginate(page, limit)
    
    return response.json(case_report)
}

async search({request, response}) {
    let search = request.only(['column', 'value'])
    let case_report= await CaseReport.query()
    .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
    .fetch()

    return response.json(case_report)
}
}

module.exports = CaseEntryController
