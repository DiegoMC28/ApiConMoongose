const mongoose = require('mongoose')


const compraSchema= new mongoose.Schema({

    id_usuario:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Usuario'
    },
    id_curso:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Curso'
    },
    precio:{  
        type: Number,
        required:true,
        min:0
    },
}, { timestamps: true }
)

const Compra=mongoose.model('Compra',compraSchema)

module.exports=Compra