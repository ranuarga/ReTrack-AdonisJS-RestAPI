'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
    static get primaryKey () {
        return 'category_id'
    }
    
    static get createdAtColumn () {
        return null
    }
    
    static get updatedAtColumn () {
        return null
    }

    case_entries () {
        return this.hasMany('App/Models/CaseEntry')
    }
}

module.exports = Category
