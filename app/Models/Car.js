'use strict'

const Model = use('Model')

class Car extends Model {

    static get primaryKey () {
        return 'car_id'
    }

    teams () {
        return this.hasMany('App/Models/Team')
    }
}

module.exports = Car
