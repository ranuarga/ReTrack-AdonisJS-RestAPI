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
      table.float('history_longitude').nullable()
      table.float('history_latitude').nullable()
      table.datetime('history_datetime').nullable()
    })
  }

  down () {
    this.drop('histories')
  }
}

module.exports = HistorySchema
