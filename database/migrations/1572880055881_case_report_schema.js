'use strict'

const Schema = use('Schema')

class CaseReportSchema extends Schema {
  up () {
    this.create('case_reports', (table) => {
      table.increments('case_report_id')
      table
        .integer('user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('case_id')
        .unsigned()
        .references('case_id')
        .inTable('case_entries')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table.date('case_report_date').nullable()
      table.time('case_report_time').nullable()
      table.decimal('case_report_longitude', 11, 8).nullable()
      table.decimal('case_report_latitude', 10, 8).nullable()
      table.text('case_report_description').nullable()
      table.text('case_report_photo').nullable()
      table.integer('case_report_status').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('case_reports')
  }
}

module.exports = CaseReportSchema
