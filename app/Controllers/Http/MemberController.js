'use strict'

const Database = use('Database')
const Member = use('App/Models/Member')

class MemberController {
    async index({ response }) {
        try {
            const member = await Member.query()
                .with('user')
                .with('team')
                .fetch()

            return member
        } catch (err) {
            return response.status(err.status)
        }
    }

    // This store method is a lil bit different than others
    // because pivot table doesn't contain id column
    async store({ request, response }) {
        try {
            const teamId = request.input('team_id')
            const userId = request.input('user_id')

            const member = await Database
                .from('members')
                .insert(
                    {
                        user_id: userId,
                        team_id: teamId
                    }
                )

            return member
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async showByTeam({ params, response }) {
        try {
            const teamId = params.id

            const member = await Member.query()
                .where({
                    team_id: teamId
                })
                .with('user')
                .fetch()

            if (member.rows.length === 0) {
                return response
                    .status(404)
                    .send({
                        message: {
                            error: "No member of team found"
                        }
                    })
            }

            return member
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({
                        message: {
                            error: 'No member of team found'
                        }
                    })
            }
            return response.status(err.status)
        }
    }

    async showByUser({ params, response }) {
        try {
            const userId = params.id

            let member = await Member.findOrFail(userId)

            member = await Member.query()
                .where({
                    user_id: userId
                })
                .with('team')
                .fetch()

            if (member.rows.length === 0) {
                return response
                    .status(404)
                    .send({
                        message: {
                            error: "No team of member found"
                        }
                    })
            }

            return member
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({
                        message: {
                            error: "No team of member found"
                        }
                    })
            }
            return response.status(err.status)
        }
    }

    async destroyTeam({ params }) {
        try {
            const teamId = params.id

            let member = await Member.findByOrFail(team_id)

            member = await Member.query()
                .where({
                    team_id: teamId
                }).delete()
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No team found'
                } })
            }
            return response.status(err.status)
        }
    }

    async destroyUser({ params }) {
        try {
            const userId = params.id

            let member = await Member.findByOrFail(userId)

            member = await Member.query()
                .where({
                    user_id: userId
                }).delete()
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No user found'
                } })
            }
            return response.status(err.status)
        }
    }

    async destroyUserFromTeam({ params }) {
        try {
            const userId = params.user_id
            const teamId = params.team_id

            let member = await Member.findByOrFail(userId, team_id)

            member = await Member.query()
                .where({
                    user_id: userId
                }).andWhere({
                    team_id: teamId
                })
                .delete()
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                .status(err.status)
                .send({ message: {
                    error: 'No user found in team'
                } })
            }
            return response.status(err.status)
        }
    }
}

module.exports = MemberController
