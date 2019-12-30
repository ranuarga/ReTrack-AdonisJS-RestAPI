'use strict'

const fs = use('fs');
const Helpers = use('Helpers')
const CaseReport = use('App/Models/CaseReport')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with caseentries
 */
class CaseReportController {
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
    try {
      const case_report = await CaseReport.query()
          .with('user')
          .with('case_entry')
          .with('case_entry.category')
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
      const case_report = new CaseReport()

      const data = request.only(
        [
          'user_id',
          'case_id',
          'case_report_date',
          'case_report_time',
          'case_report_longitude',
          'case_report_latitude',
          'case_report_description',
          'case_report_status',
        ]
      )

      case_report.user_id = data.user_id
      case_report.case_id = data.case_id
      case_report.case_report_date = data.case_report_date
      case_report.case_report_time = data.case_report_time
      case_report.case_report_longitude = data.case_report_longitude
      case_report.case_report_latitude = data.case_report_latitude
      case_report.case_report_description = data.case_report_description
      case_report.case_report_status = data.case_report_status

      await case_report.save()

      // IF user upload a photo when create case_report
      if(request.file('case_report_photo')) {
        const photoFile = request.file('case_report_photo', {
          types: ['image'],
          size: '5mb'
        })
        
        let namePhotoCaseReport = case_report.case_report_id + '.jpg'

        await photoFile.move(Helpers.publicPath('uploads/case_report'), {
          name: namePhotoCaseReport,
          overwrite: true
        })
  
        if(!photoFile.moved()){
            return photoFile.error()
        }

        case_report.case_report_photo = '/uploads/case_report/' + namePhotoCaseReport
        case_report.save()
      }

      return response.status(200).send(case_report)
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
          .with('case_entry.category')
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
   * Display a user casereport.
   * GET caseentries/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async showUserReport ({ params, response }) {
    try {
      const userId = params.id

      const case_report = await CaseReport.query()
          .where({
              user_id: userId
          })
          .with('user')
          .with('case_entry')
          .with('case_entry.category')
          .first()

      return case_report
    } catch (err) {
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
          user_id,
          case_id,
          case_report_date,
          case_report_time,
          case_report_longitude,
          case_report_latitude,
          case_report_description,
          case_report_status,
        } = request.all()

        const case_report = await CaseReport.findByOrFail('case_report_id', case_reportId)

        case_report.user_id = user_id
        case_report.case_id = case_id
        case_report.case_report_date = case_report_date
        case_report.case_report_time = case_report_time
        case_report.case_report_longitude = case_report_longitude
        case_report.case_report_latitude = case_report_latitude
        case_report.case_description = case_report_description
        case_report.case_report_status = case_report_status

        // IF user upload a photo when create case_report
        if(request.file('case_report_photo')) {
          const photoFile = request.file('case_report_photo', {
            types: ['image'],
            size: '5mb'
          })
          
          let namePhotoCaseReport = case_report.case_report_id + '.jpg'

          await photoFile.move(Helpers.publicPath('uploads/case_report'), {
            name: namePhotoCaseReport,
            overwrite: true
          })
    
          if(!photoFile.moved()){
              return photoFile.error()
          }

          case_report.case_report_photo = '/uploads/case_report/' + namePhotoCaseReport
        }
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
          }).first()

          if(case_report.case_report_photo && fs.existsSync(Helpers.publicPath(case_report.case_report_photo))) {
            fs.unlinkSync(Helpers.publicPath(case_report.case_report_photo))
          }
    
          case_report.delete()
    } catch (err) {
        return response
          .status(err.status)
          .send(err)
    }
  }

}

module.exports = CaseReportController
