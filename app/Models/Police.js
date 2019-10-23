'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Police extends Model {
    static get primaryKey () {
        return 'police_id'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
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
}

module.exports = Police
