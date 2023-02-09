const mongoose = require('mongoose')
const mongodb = require('mongodb')
const validator = require('validator')
const Course = require('./course')

const User = mongoose.model('User', {
    dni: {
        type: String,
        required: true,
        minlength: 9,
        trim: true,
        validate(value = '') {
            if (validator.isIdentityCard(value, 'ES')) {
                throw new Error('El dni no es valido')
            }
        }
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    edad: {
        type: Number,
        default: 0,
        required: true,
        validate(value = 0) {
            if (value < 0) {
                throw new Error('La edad debe ser un numero mayor que 0')
            }
        }
    }, 
    telefono: {
        type: String,
        required: true,
        trim: true,
        minlength: 9,
        validate(value = '') {
            if (!validator.isMobilePhone(value)) {
                throw new Error('El telefono es incorrecto')
            }
        }
    }
})

module.exports = User