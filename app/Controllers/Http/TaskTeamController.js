'use strict'

const Database = use('Database')
const TaskTeam = use('App/Models/TaskTeam')

class TaskTeamController {
    async index({ response }) {
        // return TaskTeam.all()
        try {
            const task_team = await TaskTeam.query()
                .with('team')
                .with('case_entry')
                .fetch()

            return task_team
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

            const task_team = await Database
                .from('task_teams')
                .insert(
                    {
                        team_id: teamId,
                        case_id: caseId
                    }
                )

            return task_team
        } catch (err) {
            return response
                .status(err.status)
                .send(err)
        }
    }

    async showByTeam({ params, response }) {
        try {
            const teamId = params.id


            // let task_team = await TaskTeam
            //     .findOrFail(params.id)

            const task_team = await TaskTeam.query()
                .where({
                    team_id: teamId
                })
                .with('case_entry')
                .fetch()

            // if (task_team.rows.length === 0) {
            //     return response
            //         .status(404)
            //         .send({
            //             message: {
            //                 error: "No case of team found"
            //             }
            //         })
            // }

            return task_team
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({
                        message: {
                            error: 'No case of team found'
                        }
                    })
            }
            return response.status(err.status)
        }
    }

    async showByCase({ params, response }) {
        try {
            const caseId = params.id

            // let task_team = await TaskTeam
            // .findOrFail(params.id)

            const task_team = await TaskTeam.query()
                .where({
                    case_id: caseId
                })
                .with('team')
                .fetch()

            if (task_team.rows.length === 0) {
                return response
                    .status(404)
                    .send({
                        message: {
                            error: "No team of case found"
                        }
                    })
            }

            return task_team
        } catch (err) {
            if (err.name === 'ModelNotFoundException') {
                return response
                    .status(err.status)
                    .send({
                        message: {
                            error: "No team of case found"
                        }
                    })
            }
            return response.status(err.status)
        }
    }

    async destroyTeam({ params }) {
        try {
            const teamId = params.id

            const task_team = await TaskTeam.query()
                .where({
                    team_id: teamId
                }).delete()
        } catch (err) {

        }
    }

    async destroyCase({ params }) {
        try {
            const caseId = params.id

            const task_team = await TaskTeam.query()
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

            const task_team = await TaskTeam.query()
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
