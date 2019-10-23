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

Route.get('police', 'PoliceController.index')
Route.get('police/:id', 'PoliceController.show')
Route.post('police', 'PoliceController.store')
Route.put('police/:id', 'PoliceController.update')
Route.delete('police/:id/delete', 'PoliceController.destroy')

Route.get('history', 'HistoryController.index')
Route.get('history/:id', 'HistoryController.show')
Route.post('history', 'HistoryController.store')
Route.put('history/:id', 'HistoryController.update')
Route.delete('history/:id/delete', 'HistoryController.destroy')
