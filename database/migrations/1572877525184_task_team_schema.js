'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TaskTeamSchema extends Schema {
  up () {
    this.create('task_teams', (table) => {
      table.integer('team_id').unsigned().index('team_task_id')
      table.integer('case_id').unsigned().index('case_task_id')
      table.foreign('team_id')
        .references('teams.team_id')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.foreign('case_id')
        .references('case_entries.case_id')
        .onUpdate('cascade')
        .onDelete('cascade')
    })
  }

  down () {
    this.drop('task_teams')
  }
}

module.exports = TaskTeamSchema
