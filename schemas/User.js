const mongoose = require('mongoose');
const { calculateLevel } = require('../util/xp');

const usersSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    cardSettings: {
        background: {
            type: String,
            default: '#301934',
        },
        text: {
            type: String,
            default: "#ffffff",
        },
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
});

usersSchema.pre('save', function(next) {
    const currentLevel = calculateLevel(this.xp);
    this.level = currentLevel;
    next();
});

usersSchema.statics.getRank = async function(user) {
    const allUsers = await this.find();
    const sorted = allUsers.sort((a, b) => b.xp - a.xp);
    const mapped = sorted.map((u, i) => ({
        id: u.id,
        xp: u.xp,
        rank: i + 1,
    }));

    return mapped.find(u => u.id == user.id).rank;
};

module.exports = mongoose.model('User', usersSchema);