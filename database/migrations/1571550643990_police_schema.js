'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PoliceSchema extends Schema {
  up () {
    this.create('police', (table) => {
      table.increments('police_id')
      table.string('police_employee_number', 25).notNullable().unique()
      table.string('police_name', 50).nullable()
      table.string('police_password', 20).nullable()
      table.datetime('police_birthdate').nullable()
      table.boolean('police_gender').nullable()
      table.text('police_photo').nullable()
      table.integer('police_status').nullable()
    })
  }

  down () {
    this.drop('police')
  }
}

module.exports = PoliceSchema
