const express= require('express')
const Compra = require('../models/compra')
const auth = require('../middleware/autentificar')
const router = new express.Router()


router.post('/compra/crear',auth, async (req, res) => {
    
    try{
        const compra = await Compra.findOne({id_usuario: req.usuario._id, id_curso: req.body.id_curso})
        if(compra){
            return res.status(409).send({ error: 'Ya has comprado este curso' })
        }
        else{
            const nuevaCompra= new Compra({ id_usuario: req.usuario._id, id_curso: req.body.id_curso , precio:req.body.precio})
            await nuevaCompra.save()
            res.status(201).send(nuevaCompra)
        }
    }catch(e){
        res.status(500).send({ error: 'Error al crear la compra' })
    }

})

module.exports = router