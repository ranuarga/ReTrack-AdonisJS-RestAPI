'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Location extends Model {
    static get primaryKey () {
        return 'location_id'
    }
}

module.exports = Location
