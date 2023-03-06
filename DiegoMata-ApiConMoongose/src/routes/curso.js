const express = require('express')
const Curso = require('../models/curso')
const Compra = require('../models/compra')
const auth = require('../middleware/autentificar')
const router = new express.Router()

router.post('/course/create', auth , async(req,res)=>{
    const curso = new Curso({
        ...req.body,
        autor: req.usuario._id})
    
    try {
        await curso.save()
        res.status(201).send(curso) 
    } catch (error) {
        res.status(400).send(error)
    }

})

router.get('/course/:id',auth ,async (req,res)=>{

    const _id=req.params.id

    try {
        const curso=await Curso.findById(_id).populate('autor')
        if(!curso){
            return res.status(404).send()
        }
        res.status(200).send(curso)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/courses/byUser',auth,async (req,res)=>{

    try{
        const cursos=await Curso.find({id_usuario: req.usuario._id}).populate('autor')
        res.send(cursos)

    } catch(e){
        res.status(500).send(e)
    }
})

router.get('/course/allByUser', auth, async (req,res)=>{

    try{
        const cursos=await Curso.find({}).populate('autor')
        res.send(cursos)

    } catch(e){
        res.send(e)
    }
})

router.get('/course/allCourses', auth, async (req,res)=>{
    try{
        const cursos=await Curso.find({autor: {$ne: req.usuario._id}}).populate('autor')
        const cursosConCompra = await Promise.all(cursos.map(async (curso) => {
            const compra = await Compra.findOne({ id_usuario: req.usuario._id, id_curso: curso._id }).lean()
                if (compra) {
                return {  _id: curso._id,
                    nombre: curso.nombre,
                    descripcion: curso.descripcion,
                    precio: curso.precio,
                    comprado: true}
                } else {
                return {  _id: curso._id,
                    nombre: curso.nombre,
                    descripcion: curso.descripcion,
                    precio: curso.precio,
                    comprado: false }
                }
          }))
        res.send(cursosConCompra)      
    } catch(e){
        res.status(500).send(e)
    }
})

router.patch('/course/update/:id', auth, async(req,res)=>{
    // Hago las comparaciones necesarias para los campos obligatorios
    const actualizaciones= Object.keys(req.body)
    const comparar=['nombre','descripcion','precio']
    const operacionValida=actualizaciones.every((actualizacion)=>comparar.includes(actualizacion))

    if(!operacionValida){
        return res.status(400).send({ error: 'Actualizacion no valida' })
    }

    try {
        const curso=await Curso.findById({_id:req.params.id, autor: req.usuario._id}).populate('autor')
        if(!curso){
            return res.status(404).send()
        }
        actualizaciones.forEach((actu)=>curso[actu]=req.body[actu])
        await curso.save()
        res.send(curso)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.delete('/course/delete/:id', auth, async (req,res)=>{

    try {
        const curso=await Curso.findByIdAndDelete(req.params.id)
        if(!curso){
            return res.status(404).send()
        }
        res.send(curso)
    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router