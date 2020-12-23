const mongoose = require('mongoose');

const guildsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    channels: {
        join: {
            type: String,
            default: "",
        },
        leave: {
            type: String,
            default: "",
        },
        commands: {
            type: String,
            default: "",
        },
    },
    toggles: {
        join: {
            type: Boolean,
            default: false,
        },
        leave: {
            type: Boolean,
            default: false,
        },
        strict: {
            type: Boolean,
            default: false,
        },
    },
    cardSettings: {
        background: {
            type: String,
            default: '#000000',
        },
        border: {
            type: String,
            default: "#301934",
        },
        user: {
            type: String,
            default: "#ffffff",
        },
        message: {
            type: String,
            default: "#ffffff",
        },
        title: {
            type: String,
            default: "#ffffff",
        },
    },
});

module.exports = mongoose.model('Guild', guildsSchema);