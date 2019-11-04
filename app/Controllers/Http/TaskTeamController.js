'use strict'

const Database = use('Database')
const Member = use('App/Models/TaskTeam')

class TaskTeamController {
    async index({ response }) {
        // return History.all()
        try {
            const member = await Member.query()
                .with('case')
                .with('team')
                .fetch()

            return member
        } catch (err) {
            return response.status(err.status)
        }
    }

    // This store method is a lil bit different then others
    // because pivot table doesn't contain id column
    async store({ request, response }) {
        try {
            const teamId = request.input('team_id')
            const caseId = request.input('case_id')

            const task_teams = await Database
                .from('task_teams')
                .insert(
                    {
                        team_id: teamId,
                        case_id: caseId
                    }
                )

            return task_teams
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async showByTeam({ params, response }) {
        try {
            const teamId = params.id

            const task_teams = await Member.query()
                .where({
                    team_id: teamId
                })
                .with('case')
                .fetch()

            if (task_teams.rows.length === 0) {
                return response
                    .status(404)
                    .send({
                        message: {
                            error: "No member of team found"
                        }
                    })
            }

            return task_teams
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

    async showByCase({ params, response }) {
        try {
            const caseId = params.id

            const task_teams = await Member.query()
                .where({
                    case_id: caseId
                })
                .with('team')
                .fetch()

            if (task_teams.rows.length === 0) {
                return response
                    .status(404)
                    .send({
                        message: {
                            error: "No team of member found"
                        }
                    })
            }

            return task_teams
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

            const task_teams = await Member.query()
                .where({
                    team_id: teamId
                }).delete()
        } catch (err) {

        }
    }

    async destroyCase({ params }) {
        try {
            const caseId = params.id

            const task_teams = await Member.query()
                .where({
                    case_id: caseId
                }).delete()
        } catch (err) {

        }
    }

    async destroyCaseFromTeam({ params }) {
        try {
            const caseId = params.case_id
            const teamId = params.team_id

            const member = await Member.query()
                .where({
                    case_id: caseId
                }).andWhere({
                    team_id: teamId
                })
                .delete()
        } catch (err) {

        }
    }
}

module.exports = TaskTeamController
