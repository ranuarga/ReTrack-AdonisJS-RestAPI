'use strict'

const CaseEntry = use('App/Models/CaseEntry')
const Helpers = use('Helpers')

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
      const case_entry = new CaseEntry()
      
      const photoFile = request.file('case_photo', {
        types: ['images', 'jpg', 'jpeg', 'png'],
        size: '5mb'
      })

      let namePhotoCaseEntry = request.input('category_id') + '-' + request.input('case_reporter') + '.jpg'

      await photoFile.move(Helpers.publicPath('uploads/case_entry'), {
        name: namePhotoCaseEntry,
        overwrite: true
      })

      if(!photoFile.moved()){
          return photoFile.error()
      }

      const data = {
        category_id: request.input('category_id'),
        case_reporter: request.input('case_reporter'),
        case_date: request.input('case_date'),
        case_time: request.input('case_time'),
        case_longitude: request.input('case_longitude'),
        case_latitude: request.input('case_latitude'),
        case_description: request.input('case_description'),
      }

      case_entry.category_id = data.category_id
      case_entry.case_reporter = data.case_reporter
      case_entry.case_date = data.case_date
      case_entry.case_time = data.case_time
      case_entry.case_longitude = data.case_longitude
      case_entry.case_latitude = data.case_latitude
      case_entry.case_description = data.case_description
      case_entry.case_photo = namePhotoCaseEntry

      await case_entry.save()
      // const case_entry = await CaseEntry.create(data)
      
      return response.status(200).send(case_entry)
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

      let case_entry = await CaseEntry
        .findOrFail(params.id)
      
        case_entry = await CaseEntry.query()
        .where({
            case_id: caseId
        })
        .with('category')
        .first()
        
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

  async pagination({request, response}) {
      let pagination = request.only([ 'page', 'limit', 'coloumn', 'sort' ])
      let page = pagination.page || 1;
      let limit = pagination.limit || 10;
      const case_entry = await CaseEntry.query()
          .orderBy(`${pagination.column}`, `${pagination.sort}`)
          .paginate(page, limit)
      
      return response.json(case_entry)
  }

  async search({request, response}) {
      let search = request.only(['column', 'value'])
      let case_entry= await CaseEntry.query()
      .whereRaw(`LOWER(${search.column}) LIKE '%${search.value.toLowerCase()}%'`)
      .fetch()

      return response.json(case_entry)
  }
}

module.exports = CaseEntryController
