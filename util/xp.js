module.exports = {
    rankEmoji(place) {
        let emojis = {
            1: "🏆",
            2: "🥈",
            3: "🏅",
            else: "🎖",
        };

        if(emojis[place]) {
            return emojis[place];
        } else {
            return emojis.else;
        }
    },

    calculateLevel(xp) {
        return Math.floor(0.1 * Math.sqrt(xp));
    },
};