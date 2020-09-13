const express = require('express')
const path = require('path')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const app = express()
const mongoose = require('mongoose')
const homeRoutes = require('./routes/home')
const cartRoutes = require('./routes/cart')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')
const User = require('./models/user')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5f5a700d917c3c08946bb671')
        req.user = user
        next()
    } catch (e) { console.log(e) }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)

async function start() {
    const url = `mongodb+srv://kexxpert:77rgYuBHChQIvJCq@cluster0.92cis.mongodb.net/express`
    const PORT = process.env.PORT || 5000
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'kexxpert@ya.ru',
                name: 'keXXpert',
                cart: { items: [] }
            })
            await user.save()
        }
        app.listen(PORT, () => console.log('Server started on port: ' + PORT))
    } catch (e) {
        console.log(e)
    }

}

start()



