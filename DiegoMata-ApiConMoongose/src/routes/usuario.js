const express = require('express')
const Usuario = require('../models/usuario')
const auth = require('../middleware/autentificar')
const router = new express.Router()

router.post('/user/create', async(req,res)=>{
    const usuario = new Usuario(req.body)

    try {
        await usuario.save()
        res.status(201).send(usuario) 
    } catch (error) {
        res.status(400).send(error)
    }

})
router.post('/user/login',async (req,res)=>{
    try {
        const usuario = await Usuario.findByCredentials(req.body.email, req.body.password)
        const token = await usuario.generateAuthToken()
        res.send({ usuario, token })
    } catch (error) {
        res.status(400).send.error
    }
})

router.get('/user/me', auth, async (req,res)=>{
    res.send(req.usuario)
})

router.get('/user/logout', auth, async (req,res)=>{
    try {
        req.usuario.tokens = req.usuario.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.usuario.save()

        res.send()
    } catch (error) {
        res.status(500).send.error
    }
})

router.patch('/user/update', auth, async(req,res)=>{
    const actualizaciones= Object.keys(req.body)
    const comparar=['nombre','email','password']
    const operacionValida=actualizaciones.every((actualizacion)=>comparar.includes(actualizacion))
    
    if(!operacionValida){
        return res.status(400).send({ error: 'Actualizacion no valida' })
    }

    try {
        actualizaciones.forEach((actu)=>req.usuario[actu]=req.body[actu])
        await req.usuario.save()
        res.send(req.usuario)
    } catch (error) {
        return res.status(400).send()
    }

})

router.delete('/user/delete', auth, async (req,res)=>{

    try {
        await req.usuario.remove()
        res.send(req.usuario)
    } catch (error) {
        res.status(500).send.error
    }

})

module.exports = router