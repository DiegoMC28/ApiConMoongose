const express=require('express')
const cors=require('cors')
require('./db/mongoose')

const cursoRouter= require('./routes/curso')
const usuarioRouter= require('./routes/usuario')
const compraRouter= require('./routes/compra')

const app=express()
const puerto = process.env.PORT || 3000

app.use(cors());
app.use(express.json())
app.use(cursoRouter)
app.use(usuarioRouter)
app.use(compraRouter)

app.listen(puerto, () => {
    console.log('Servidor abierto en el puerto: ' + puerto)
})