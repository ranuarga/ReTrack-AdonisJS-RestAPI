'use strict'
const Category = use('App/Models/Category')

class CategoryController {

  async index ({ response }) {
    try {
      const category = await Category.query()
        .fetch()

      return category
    } catch (err) {
      return response.status(err.status)
    }
  }

  async store ({ request }) {
    const category = new Category()
    category.category_name = request.input('category_name')

    await category.save()
    return category
  }

  async show ({ params, response}) {
    try {
      const categoryId = params.id

      let category = await Category
        .findOrFail(params.id)

      category = await Category.query()
          .where({
              category_id: categoryId
          }).first()

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

  async update ({ params, request }) {
    const categoryId = params.id 
        const category_name = request.input('category_name')

        const category = await Category.findByOrFail('category_id', categoryId)

        category.category_name = category_name

        await category.save()

        return category
  }

  async destroy ({ params }) {
    try {
      const categoryId = params.id

      let category = await Category.findByOrFail(categoryId)

      category = await Category.query()
          .where({
              category_id: categoryId
          }).delete()
    } catch (err) {
        if (err.name === 'ModelNotFoundException') {
          return response
          .status(err.status)
          .send({ message: {
              error: 'No Category Found'
          } })
      }
      return response.status(err.status)
    }
  }

}

module.exports = CategoryController
