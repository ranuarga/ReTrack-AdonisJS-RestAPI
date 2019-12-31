'use strict'

const Schema = use('Schema')

class CheckpointSchema extends Schema {
  up () {
    this.create('checkpoints', (table) => {
      table.increments('checkpoint_id')
      table
        .integer('agenda_id')
        .unsigned()
        .references('agenda_id')
        .inTable('agendas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .nullable()
      table.decimal('checkpoint_longitude', 11, 8).nullable()
      table.decimal('checkpoint_latitude', 10, 8).nullable()
      table.datetime('checkpoint_datetime').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('checkpoints')
  }
}

module.exports = CheckpointSchema
