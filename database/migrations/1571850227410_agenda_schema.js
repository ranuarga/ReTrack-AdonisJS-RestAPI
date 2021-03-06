'use strict'

const Schema = use('Schema')

class AgendaSchema extends Schema {
  up () {
    this.create('agendas', (table) => {
      table.increments('agenda_id')
      table.date('agenda_date').nullable()
      table.boolean('agenda_status').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('agendas')
  }
}

module.exports = AgendaSchema
