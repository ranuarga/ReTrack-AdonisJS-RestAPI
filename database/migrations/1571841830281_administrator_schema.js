'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdministratorSchema extends Schema {
  up () {
    this.create('administrators', (table) => {
      table.increments('admin_id')
      table.string('admin_employee_number', 25).notNullable().unique()
      table.string('admin_name', 50).nullable()
      table.string('admin_password', 20).nullable()
      table.datetime('admin_birthdate').nullable()
      table.boolean('admin_gender').nullable()
      table.text('admin_photo').nullable()
      table.integer('admin_status').nullable()
    })
  }

  down () {
    this.drop('administrators')
  }
}

module.exports = AdministratorSchema
