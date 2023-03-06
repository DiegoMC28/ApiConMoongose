const mongoose = require('mongoose')

const cursoSchema= new mongoose.Schema({

    nombre:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true,
        maxLength: 100
    },
    autor:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Usuario'
    },
    precio:{
        type: Number,
        required:true,
        min:0
    }
}, { timestamps: true })

cursoSchema.methods.toJSON = function () {
    const curso = this
    const cursoObject = curso.toObject()
    
    delete cursoObject.__v
    
    try{
        cursoObject.nombreAutor = cursoObject.autor.name
    } catch(e){
        cursoObject.nombreAutor = 'Eliminado'}
        
    delete cursoObject.autor

    return cursoObject
}

const Curso=mongoose.model('Curso',cursoSchema)
module.exports=Curso