const mongoose = require('mongoose')

const Course = mongoose.model('Course', {
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    puntuacion: {
        type: Number,
        default: 0
    }
})

module.exports = Course