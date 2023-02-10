const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('El Email es incorrecto')
            }
        }
    },
    contraseña: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('contraseña')) {
                throw new Error('Contraseña no contiene "contraseña"')
            }
        }
    },
    edad: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('La edad debe ser un numero positivio')
            }
        }
    }
})

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('contraseña')) {
        user.contraseña = await bcrypt.hash(user.contraseña, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User