'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistorySchema extends Schema {
  up () {
    this.create('histories', (table) => {
      table.increments('history_id')
      table
        .integer('police_id')
        .unsigned()
        .references('police_id')
        .inTable('police')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .nullable()
      table.integer('team_id').nullable()
      table.decimal('history_longitude', 11, 8).nullable()
      table.decimal('history_latitude', 10, 8).nullable()
      table.datetime('history_datetime').nullable()
    })
  }

  down () {
    this.drop('histories')
  }
}

module.exports = HistorySchema