const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jsonWT = require('jsonwebtoken')

const UsuarioSchema=new mongoose.Schema({

    nombre:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('El email no es correcto')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes('contraseña')) {
                throw new Error('Contraseña no puede contener "contraseña"')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
}, { timestamps: true }
)


UsuarioSchema.methods.toJSON= function(){
    const usuario=this
    const usuarioOnject= usuario.toObject()

    delete usuarioOnject.password
    delete usuarioOnject.tokens
    delete usuarioOnject.__v


    return usuarioOnject
}

UsuarioSchema.methods.generateAuthToken= async function(){
    const usuario=this
    const token = jsonWT.sign({_id: usuario._id.toString()},'pataton;')

    usuario.tokens= usuario.tokens.concat({token})
    await usuario.save()

    return token
}

UsuarioSchema.statics.findByCredentials = async (email, password) => {
    const usuario = await Usuario.findOne({email})

    if (!usuario) {
        throw new Error('No existe este email')
    }

    const coincide = await bcrypt.compare(password, usuario.password)

    if (!coincide) {
        throw new Error('Contraseña incorrecta')
    }

    return usuario
}

UsuarioSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const Usuario = mongoose.model('Usuario',UsuarioSchema)

module.exports= Usuario