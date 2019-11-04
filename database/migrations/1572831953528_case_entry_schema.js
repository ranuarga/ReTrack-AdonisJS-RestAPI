'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseEntrySchema extends Schema {
  up () {
    this.create('case_entries', (table) => {
      table.increments('case_id')
      table
        .integer('category_id')
        .unsigned()
        .references('category_id')
        .inTable('categories')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table.string('case_reporter').nullable()
      table.date('case_date').nullable()
      table.time('case_time').nullable()
      table.decimal('case_longitude', 11, 8).nullable()
      table.decimal('case_latitude', 10, 8).nullable()
      table.text('case_description').nullable()
      table.text('case_photo').nullable()
      // table.timestamps()
    })
  }

  down () {
    this.drop('case_entries')
  }
}

module.exports = CaseEntrySchema
