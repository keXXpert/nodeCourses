const path = require('path')
const fs = require('fs')
const { resolve } = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
)

class Cart {
    static async add(course) {
        const cart = await Cart.fetch()
        const idx = cart.courses.findIndex(item => item.id === course.id)
        const candidate = cart.courses[idx]
        if (candidate) {
            candidate.count++
        } else {
            course.count = 1
            cart.courses.push(course)
        }
        cart.price += +course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(
                p,
                JSON.stringify(cart),
                (err) => {
                    if (err) reject(err)
                    else resolve()
                }
            )

        })
    }

    static async delete(id) {
        const cart = await Cart.fetch()
        const idx = cart.courses.findIndex(item => item.id === id)
        const course = cart.courses[idx]
        cart.price -= course.price

        if (course.count > 1) {
            cart.courses[idx].count--
        } else {
            cart.courses.splice(idx, 1)
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(
                p,
                JSON.stringify(cart),
                (err) => {
                    if (err) reject(err)
                    else resolve(cart)
                }
            )

        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                p,
                'utf-8',
                (err, content) => {
                    if (err) reject(err)
                    else resolve(JSON.parse(content))
                }
            )

        })

    }
}


module.exports = Cart