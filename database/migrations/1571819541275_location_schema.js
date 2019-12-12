'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LocationSchema extends Schema {
  up () {
    this.create('locations', (table) => {
      table.increments('location_id')
      table.string('location_name').nullable()
      table.decimal('location_longitude', 11, 8).nullable()
      table.decimal('location_latitude', 10, 8).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('locations')
  }
}

module.exports = LocationSchema
