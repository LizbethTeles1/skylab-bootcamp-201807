'use strict'

const { Schema, Schema: { Types: { ObjectId } } } = require('mongoose')

module.exports = new Schema({
    dni: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    patients: [{
        type: ObjectId,
        ref: 'Patient'
    }]
})