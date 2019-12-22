'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeamSchema extends Schema {
  up () {
    this.create('teams', (table) => {
      table.increments('team_id')
      table
        .integer('car_id')
        .unsigned()
        .references('car_id')
        .inTable('cars')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('agenda_id')
        .unsigned()
        .references('agenda_id')
        .inTable('agendas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .nullable()
      table.timestamps()
    })

  }

  down () {
    this.drop('teams')
  }
}

module.exports = TeamSchema
