'use strict'

const Model = use('Model')

class Category extends Model {
    static get primaryKey () {
        return 'category_id'
    }

    case_entries () {
        return this.hasMany('App/Models/CaseEntry')
    }
}

module.exports = Category
