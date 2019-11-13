'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

// Routing for auth
Route.post('login', 'AuthController.login')
Route.post('register', 'UserController.store')
// Route.post('logout', 'AuthController.logout')

Route
  .group(() => {
    // Routing for agenda
    Route.get('agenda', 'AgendaController.index')
    Route.get('agenda/:id', 'AgendaController.show')
    Route.get('agenda/user/:id', 'AgendaController.showUserAgenda')
    Route.post('agenda', 'AgendaController.store')
    Route.put('agenda/:id', 'AgendaController.update')
    Route.delete('agenda/:id/delete', 'AgendaController.destroy')

    // Routing for car
    Route.get('car', 'CarController.index')
    Route.get('car/:id', 'CarController.show')
    Route.post('car', 'CarController.store')
    Route.put('car/:id', 'CarController.update')
    Route.delete('car/:id/delete', 'CarController.destroy')

    // Routing for case entry
    Route.get('case-entry', 'CaseEntryController.index')
    Route.get('case-entry/:id', 'CaseEntryController.show')
    Route.post('case-entry', 'CaseEntryController.store')
    Route.put('case-entry/:id', 'CaseEntryController.update')
    Route.delete('case-entry/:id/delete', 'CaseEntryController.destroy')

    // Routing for case report
    Route.get('case-report', 'CaseReportController.index')
    Route.get('case-report/:id', 'CaseReportController.show')
    Route.post('case-report', 'CaseReportController.store')
    Route.put('case-report/:id', 'CaseReportController.update')
    Route.delete('case-report/:id/delete', 'CaseReportController.destroy')

    
    // Routing for category
    Route.get('category', 'CategoryController.index')
    Route.get('category/:id', 'CategoryController.show')
    Route.post('category', 'CategoryController.store')
    Route.put('category/:id', 'CategoryController.update')
    Route.delete('category/:id/delete', 'CategoryController.destroy')

    // Routing for checkpoint
    Route.get('checkpoint', 'CheckpointController.index')
    Route.get('checkpoint/:id', 'CheckpointController.show')
    Route.post('checkpoint', 'CheckpointController.store')
    Route.put('checkpoint/:id', 'CheckpointController.update')
    Route.delete('checkpoint/:id/delete', 'CheckpointController.destroy')
    
    // Routing for history
    Route.get('history', 'HistoryController.index')
    Route.get('history-distinct', 'HistoryController.historyDistinct')
    Route.get('history/:id', 'HistoryController.show')
    Route.post('history', 'HistoryController.store')
    Route.put('history/:id', 'HistoryController.update')
    Route.delete('history/:id/delete', 'HistoryController.destroy')

    // Routing for location
    Route.get('location', 'LocationController.index')
    Route.get('location/:id', 'LocationController.show')
    Route.post('location', 'LocationController.store')
    Route.put('location/:id', 'LocationController.update')
    Route.delete('location/:id/delete', 'LocationController.destroy')

    /*
      Routing for member, kinda different from others
      because this one is pivot table
    */
    // Show ALL
    Route.get('member', 'MemberController.index')
    // Show USERS IN TEAM
    Route.get('member/team/:id', 'MemberController.showByTeam')
    // Show TEAMS where user_id = params.id
    Route.get('member/user/:id', 'MemberController.showByUser')
    // You need to post team_id and user_id
    Route.post('member', 'MemberController.store')
    // Delete TEAM
    Route.delete('member/team/:id/delete', 'MemberController.destroyTeam')
    // Delete USER IN ALL TEAMS
    Route.delete('member/user/:id/delete', 'MemberController.destroyUser')
    // Delete USER FROM TEAM
    Route.delete('member/:team_id/:user_id/delete', 
      'MemberController.destroyUserFromTeam')

    /*
      Routing for task team, kinda different from others
      because this one is pivot table
    */
    // Show ALL
    Route.get('task_team', 'TaskTeamController.index')
    // Show CASE IN TEAM
    Route.get('task_team/team/:id', 'TaskTeamController.showByTeam')
    // Show TEAMS where case_id = params.id
    Route.get('task_team/case/:id', 'TaskTeamController.showByCase')
    // You need to post team_id and user_id
    Route.post('task_team', 'TaskTeamController.store')
    // Delete TEAM FROM ALL CASE
    Route.delete('task_team/team/:id/delete', 'TaskTeamController.destroyTeam')
    // Delete CASE FROM ALL TEAMS
    Route.delete('task_team/case/:id/delete', 'TaskTeamController.destroyCase')
    // Delete CASE FROM TEAM
    Route.delete('task_team/:team_id/:case_id/delete', 
      'TaskTeamController.destroyCaseFromTeam')
    
    // Routing for patrol report
    Route.get('patrol-report', 'PatrolReportController.index')
    Route.get('patrol-report/:id', 'PatrolReportController.show')
    Route.post('patrol-report', 'PatrolReportController.store')
    Route.put('patrol-report/:id', 'PatrolReportController.update')
    Route.delete('patrol-report/:id/delete', 'PatrolReportController.destroy')

    // Routing for role
    Route.get('role', 'RoleController.index')
    Route.get('role/:id', 'RoleController.show')
    Route.post('role', 'RoleController.store')
    Route.put('role/:id', 'RoleController.update')
    Route.delete('role/:id/delete', 'RoleController.destroy')

    // Routing for team
    Route.get('team', 'TeamController.index')
    Route.get('team/:id', 'TeamController.show')
    Route.post('team', 'TeamController.store')
    Route.put('team/:id', 'TeamController.update')
    Route.delete('team/:id/delete', 'TeamController.destroy')

    // Routing for user
    Route.get('user', 'UserController.index')
    Route.get('user/:id', 'UserController.show')
    Route.post('user', 'UserController.store')
    Route.put('user/:id', 'UserController.update')
    Route.delete('user/:id/delete', 'UserController.destroy')

  })
  .middleware(['auth'])