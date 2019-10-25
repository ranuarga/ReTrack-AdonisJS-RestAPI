'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments('user_id')
      table.string('user_employee_id', 25).notNullable().unique()
      table.string('user_name', 50).nullable()
      table.string('user_password', 60).notNullable()
      table.date('user_birthdate').nullable()
      table.boolean('user_gender').nullable()
      table.text('user_photo').nullable()
      table.integer('role_id')
        .unsigned()
        .references('role_id')
        .inTable('roles')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .nullable()
      table.integer('user_status').nullable()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
