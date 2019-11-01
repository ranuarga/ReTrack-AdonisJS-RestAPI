'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CarSchema extends Schema {
  up () {
    this.create('cars', (table) => {
      table.increments('car_id')
      table.string('car_number', 15).notNullable()
      table.string('car_brand', 15).notNullable()
      table.string('car_type', 15).notNullable()
    })
  }

  down () {
    this.drop('cars')
  }
}

module.exports = CarSchema
