const { Router } = require('express')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res) => {
    res.render('auth/login',
        {
            title: 'Login',
            isLogin: true
        })
})
router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            if (password === candidate.password) {
                req.session.user = candidate
                req.session.isAuthed = true
                req.session.save(err => {
                    if (err) throw err
                    res.redirect('/')
                })

            } else res.redirect('/auth/login#login')
        } else res.redirect('/auth/login#login')

    } catch (e) { console.log(e) }

})

router.post('/register', async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) res.redirect('/auth/login#login')
        else {
            const user = new User({
                email,
                password,
                name,
                cart: { items: [] }
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router