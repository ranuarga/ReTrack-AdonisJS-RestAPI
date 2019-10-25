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
    // Routing for role
    Route.get('role', 'RoleController.index')
    Route.get('role/:id', 'RoleController.show')
    Route.post('role', 'RoleController.store')
    Route.put('role/:id', 'RoleController.update')
    Route.delete('role/:id/delete', 'RoleController.destroy')

    // Routing for user
    Route.get('user', 'UserController.index')
    Route.post('user', 'UserController.store')
    Route.put('user/:id', 'UserController.update')

    // Routing for history
    Route.get('history', 'HistoryController.index')
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
  })
  .middleware(['auth'])