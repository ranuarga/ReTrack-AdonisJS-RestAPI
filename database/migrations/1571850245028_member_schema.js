'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MemberSchema extends Schema {
  up () {
    this.create('members', (table) => {
      table.integer('team_id').unsigned().index('team_id')
      table.integer('user_id').unsigned().index('user_id')
      table.foreign('team_id')
          .references('teams.team_id')
          .onUpdate('cascade')
          .onDelete('cascade')
      table.foreign('user_id')
        .references('users.user_id')
        .onUpdate('cascade')
        .onDelete('cascade')
    })
  }

  down () {
    this.drop('members')
  }
}

module.exports = MemberSchema
