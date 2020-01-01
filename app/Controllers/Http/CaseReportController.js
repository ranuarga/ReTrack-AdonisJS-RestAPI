'use strict'

const fs = use('fs');
const Helpers = use('Helpers')
const CaseReport = use('App/Models/CaseReport')

class CaseReportController {
  
  async index ({ response }) {
    try {
      const case_report = await CaseReport.query()
          .with('user')
          .with('case_entry')
          .with('case_entry.category')
          .orderBy('case_report_id', 'desc')
          .fetch()

      return case_report
    } catch (err) {
        return response.status(err.status)
    }
  }

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

  async destroy ({ params }) {
    try {
      const case_reportId = params.id

      let case_report = await CaseReport.findOrFail(case_reportId)

      case_report = await CaseReport.query()
          .where({
              case_report_id: case_reportId
          }).first()

          if(case_report.case_report_photo && fs.existsSync(Helpers.publicPath(case_report.case_report_photo))) {
            fs.unlinkSync(Helpers.publicPath(case_report.case_report_photo))
          }
    
    case_report.delete()
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
          return response
          .status(err.status)
          .send({ message: {
              error: 'Case Report Not Found'
          } })
      }
      return response.status(err.status)
    }
  }

}

module.exports = CaseReportController
