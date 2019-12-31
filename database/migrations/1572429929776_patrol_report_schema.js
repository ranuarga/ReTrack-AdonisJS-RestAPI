'use strict'

const Schema = use('Schema')

class PatrolReportSchema extends Schema {
  up () {
    this.create('patrol_reports', (table) => {
      table.increments('patrol_report_id')
      table
        .integer('agenda_id')
        .unsigned()
        .references('agenda_id')
        .inTable('agendas')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table.decimal('patrol_longitude', 11, 8).nullable()
      table.decimal('patrol_latitude', 10, 8).nullable()
      table.date('patrol_date').nullable()
      table.time('patrol_time').nullable()
      table.text('patrol_description').nullable()
      table.text('patrol_photo').nullable()
      table.integer('patrol_status').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('patrol_reports')
  }
}

module.exports = PatrolReportSchema
