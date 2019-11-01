'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeamSchema extends Schema {
  up () {
    this.create('teams', (table) => {
      table.increments('teams_id')
      table
        .integer('car_id')
        .unsigned()
        .references('car_id')
        .inTable('cars')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('agenda_id')
        .unsigned()
        .references('agenda_id')
        .inTable('agendas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .nullable()
    })
    
  }

  down () {
    this.drop('teams')
  }
}

module.exports = TeamSchema
