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

// Routing for police
Route.get('police', 'PoliceController.index')
Route.get('police/:id', 'PoliceController.show')
Route.post('police', 'PoliceController.store')
Route.put('police/:id', 'PoliceController.update')
Route.delete('police/:id/delete', 'PoliceController.destroy')

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

// Routing for administrator
Route.get('administrator', 'AdministratorController.index')
Route.get('administrator/:id', 'AdministratorController.show')
Route.post('administrator', 'AdministratorController.store')
Route.put('administrator/:id', 'AdministratorController.update')
Route.delete('administrator/:id/delete', 'AdministratorController.destroy')
