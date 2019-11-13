'use strict'
const Category = use('App/Models/Category')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    try {
      const category = await Category.query()
        .fetch()

      return category
    } catch (err) {
      return response.status(err.status)
    }
  }

  /**
   * Render a form to be used for creating a new category.
   * GET categories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request }) {
    const category = new Category()
    category.category_name = request.input('category_name')

    await category.save()
    return category
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response}) {
    try {
      const categoryId = params.id

      let category = await Category
        .findOrFail(params.id)

      category = await Category.query()
          .where({
              category_id: categoryId
          }).fetch()

      // if (category.rows.length === 0) {
      //     return response
      //     .status(404)
      //     .send({ message: {
      //         error: 'No category found'
      //     } })
      // }

      return category
  } catch (err) {
      if (err.name === 'ModelNotFoundException') {
          return response
          .status(err.status)
          .send({ message: {
              error: 'No category found'
          } })
      }
      return response.status(err.status)
  }
  }

  /**
   * Render a form to update an existing category.
   * GET categories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const categoryId = params.id 
        const category_name = request.input('category_name')

        const category = await Category.findByOrFail('category_id', categoryId)

        category.category_name = category_name

        await category.save()

        return category
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    try {
      const categoryId = params.id

      const category = await Category.query()
          .where({
              category_id: categoryId
          }).delete()
    } catch (err) {
        
    }
  }
}

module.exports = CategoryController
