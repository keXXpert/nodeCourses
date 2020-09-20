const { Router } = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res) => {
    res.render('auth/login',
        {
            title: 'Login',
            isLogin: true,
            loginError: req.flash('loginError'),
            registerError: req.flash('registerError')
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
            const passwordCorrect = await bcrypt.compare(password, candidate.password)
            if (passwordCorrect) {
                req.session.user = candidate
                req.session.isAuthed = true
                req.session.save(err => {
                    if (err) throw err
                    res.redirect('/')
                })

            } else {
                req.flash('loginError', 'Username or password is incorrect')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Username or password is incorrect')
            res.redirect('/auth/login#login')
        }

    } catch (e) { console.log(e) }

})

router.post('/register', async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            req.flash('registerError', 'User with this email already exists')
            res.redirect('/auth/login#login')
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                password: hashedPassword,
                name,
                cart: { items: [] }
            })
            await user.save()
            res.redirect('/auth/login#register')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router