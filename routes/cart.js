const { Router } = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/course')
const router = Router()

function countPrice(courses) {
    return courses.reduce((total, course) => total += course.price * course.count, 0)
}

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/cart')
})

router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()
    const cart = user.cart.items
    const courses = cart.map(c => ({ ...c.courseId._doc, count: c.count, id: c.courseId._id }))
    res.render('cart', {
        title: 'Shopping Cart',
        isCart: true,
        courses,
        price: countPrice(courses)
    })
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = user.cart.items.map(c => ({ ...c.courseId._doc, count: c.count, id: c.courseId.id }))
    const cart = {
        courses,
        price: countPrice(courses)
    }
    res.status(200).json(cart)
})

module.exports = router