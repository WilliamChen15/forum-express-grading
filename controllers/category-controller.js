const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      const category = req.params.id ? await Category.findByPk(req.params.id, { raw: true }) : null
      res.render('admin/categories', {
        categories,
        category
      })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    try {
      const category = await Category.findOne({ where: { name } })
      if (category) throw new Error('The category is already exist') // 新增的類別名稱已經存在
      await Category.create({ name })
      return res.redirect('/admin/categories')
    } catch (err) {
      return next(err)
    }
  },
  putCategory: async (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")
      const existingCategory = await Category.findOne({ where: { name } })
      if (existingCategory && existingCategory.id !== req.params.id) {
        throw new Error('Category name already exists') // 修改的類別名稱已經存在
      }
      await category.update({ name })
      return res.redirect('/admin/categories')
    } catch (err) {
      return next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category didn't exist!")
      await category.update({ isDelete: true }) // 軟刪除
      return res.redirect('/admin/categories')
    } catch (err) {
      return next(err)
    }
  }
}
module.exports = categoryController
