'use strict'

const fs = use('fs');
const Helpers = use('Helpers')
const Database = use('Database')
const CaseEntry = use('App/Models/CaseEntry')

class CaseEntryController {
  async index ({ response }) {
    try {
      const case_entry = await CaseEntry.query()
          .with('category')
          .orderBy('case_id', 'desc')
          .fetch()

      return case_entry
    } catch (err) {
      return response.status(err.status)
    }
  }

  async countCaseCategory ({ response }) {
    try {
      const case_entry = await Database
        .select('categories.category_name')
        .count('case_id')
        .from('case_entries')
        .innerJoin('categories', 'case_entries.category_id', 'categories.category_id')  
        .groupBy('categories.category_id')  

      return case_entry
    } catch (err) {
      return response.status(err.status)
    }
  }

  async store ({ request, response }) {
    try {
      const case_entry = new CaseEntry()

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

      await case_entry.save()

      if(request.file('case_photo')) {
        const photoFile = request.file('case_photo', {
          types: ['image'],
          size: '5mb'
        })
        
        let namePhotoCaseEntry = case_entry.case_id + '.jpg'

        await photoFile.move(Helpers.publicPath('uploads/case_entry'), {
          name: namePhotoCaseEntry,
          overwrite: true
        })
  
        if(!photoFile.moved()){
            return photoFile.error()
        }
  
        case_entry.case_photo = '/uploads/case_entry/' + namePhotoCaseEntry
        case_entry.save()
      }
      
      return response.status(200).send(case_entry)
    } catch (err) {
      return response
        .status(err.status)
        .send(err)
    }
  }

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
    } = request.all()

    const case_entry = await CaseEntry.findByOrFail('case_id', caseId)

    case_entry.category_id = category_id
    case_entry.case_reporter = case_reporter
    case_entry.case_date = case_date
    case_entry.case_time = case_time
    case_entry.case_longitude = case_longitude
    case_entry.case_latitude = case_latitude
    case_entry.case_description = case_description

    if(request.file('case_photo')) {
      const photoFile = request.file('case_photo', {
        types: ['image'],
        size: '5mb'
      })
      
      let namePhotoCaseEntry = caseId + '.jpg'

      await photoFile.move(Helpers.publicPath('uploads/case_entry'), {
        name: namePhotoCaseEntry,
        overwrite: true
      })

      if(!photoFile.moved()){
          return photoFile.error()
      }

      case_entry.case_photo = '/uploads/case_entry/' + namePhotoCaseEntry
    }

    await case_entry.save()
  }

  async destroy ({ params, response }) {
    try {
      const caseId = params.id

      let case_entry = await CaseEntry.findOrFail(caseId)

      case_entry = await CaseEntry.query()
        .where({
            case_id: caseId
        }).first()
      
      if(case_entry.case_photo && fs.existsSync(Helpers.publicPath(case_entry.case_photo))) {
        fs.unlinkSync(Helpers.publicPath(case_entry.case_photo))
      }

      case_entry.delete()
    } catch (err) {
        if (err.name === 'ModelNotFoundException') {
            return response
            .status(err.status)
            .send({ message: {
                error: 'No agenda found'
            } })
        }
        return response.status(err.status)      
    }
  }

}

module.exports = CaseEntryController
