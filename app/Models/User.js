'use strict'

const Model = use('Model')

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
