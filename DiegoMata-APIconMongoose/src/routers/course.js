const Course = require('../models/course')
const express = require('express')
const router = new express.Router()

router.post('/course', async (req, res) => {
    const course = new Course(req.body)

    try {
        await course.save()
        res.status(201).send(course)
    } catch (e) {
        res.status(400).send()
    }
})


router.get('/courses', async (req, res)=>{
    try {
        const courses = await Course.find({})
        res.status(200).send(courses)
    }catch (e) {
        res.status(500).send()
    }

})

router.get('/course/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const course = await Course.findById(_id)
        

        if (!course) {
            return res.status(404).send()
        }

        res.status(200).send(course)

    }catch (e){
        res.status(500).send();
    }

})

router.patch('/course/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['nombre', 'puntuacion']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: '¡Error al actualizar!' })
    }

    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!course) {
            return res.status(404).send()
        }

        res.send(course)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/course/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id)

        if (!course) {
            res.status(404).send()
        }

        res.send(course)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router