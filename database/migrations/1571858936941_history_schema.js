'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistorySchema extends Schema {
  up () {
    this.create('histories', (table) => {
      table.increments('history_id')
      table
        .integer('user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('team_id')
        .unsigned()
        .references('team_id')
        .inTable('teams')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table.decimal('history_longitude', 11, 8).nullable()
      table.decimal('history_latitude', 10, 8).nullable()
      table.float('history_accuracy').nullable()
      table.datetime('history_datetime').nullable()
    })
  }

  down () {
    this.drop('histories')
  }
}

module.exports = HistorySchema
