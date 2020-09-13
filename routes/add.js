const { Router } = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', (req, res) => {
    res.status(200)
    res.render('add', {
        title: 'Add new Course',
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    const { title, price, img } = req.body
    const course = new Course({
        title,
        price,
        img,
        userId: req.user
    })
    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router