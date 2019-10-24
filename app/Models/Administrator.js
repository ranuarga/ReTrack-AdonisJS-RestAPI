'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Administrator extends Model {
    static get primaryKey () {
        return 'admin_id'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

    static get dates () {
        return super.dates.concat(['admin_birthdate'])
    }

}

module.exports = Administrator
