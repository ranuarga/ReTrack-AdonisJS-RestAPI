'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.user_password) {
        userInstance.user_password = await Hash.make(userInstance.user_password)
      }
    })
  }

  static get primaryKey () {
    return 'user_id'
  }

  static get dates () {
      return super.dates.concat(['user_birthdate'])
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  histories () {
    return this.hasMany('App/Models/History')
  }

  role () {
    return this.belongsTo('App/Models/Role')
  }

  members () {
    return this.hasMany('App/Models/Member')
  }

  teams () {
    return this.belongsToMany('App/Models/Team')
              .pivotTable('members')
  }

  patrol_reports () {
    return this.hasMany('App/Models/PatrolReport')
  }
}

module.exports = User
