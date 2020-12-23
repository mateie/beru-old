/* eslint-disable no-async-promise-executor */
const { MessageEmbed } = require('discord.js');
const User = require('../schemas/User');
const { Rank } = require('canvacord');

module.exports = class BeruUsers {
    constructor(client) {
        this.client = client;
    }

    async giveUserXP(member, amount = 1) {
        try {
            let userXP = await User.findOne({
                id: member.user.id,
            });

            if(!userXP) {
                const newXP = new User({
                    id: member.user.id,
                    username: member.user.username,
                });

                newXP.xp += amount;
                return newXP.save();
            } else {
                userXP.xp += amount;
            }

            userXP.save();
        } catch (err) {
            console.error('Error while saving XP');
            console.error(err);
        }
    }

    async getUserXP(member) {
        const userXP = await User.findOne({
            id: member.user.id,
        });

        if (!userXP) {
            const newXP = new User({
                id: member.user.id,
                username: member.user.username,
            });

            await userXP.save();
            return newXP;
        }

        return userXP;
    }

    async getXPCard(member) {
        const userXP = await this.getUserXP(member);
        const cardInfo = await this.getCardData(userXP, member);

        const image = new Rank()
            .registerFonts()
            .setBackground('COLOR', cardInfo.background)
            .setLevelColor(cardInfo.text)
            .setRankColor(cardInfo.text)
            .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setStatus(member.presence.status)
            .setCurrentXP(cardInfo.currentXP)
            .setRequiredXP(cardInfo.neededXP)
            .setLevel(cardInfo.level)
            .setRank(cardInfo.rank)
            .renderEmojis(true)
            .setProgressBar("#FFFFFF", "COLOR");

        return await image.build();
    }

    async getXPEmbed(member) {
        const userXP = this.getUserXP(member);

        const { neededXP, rank, currentXP } = await this.getCardData(userXP, member);

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${member.nickname || member.user.username}'s XP`)
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`
                **Rank**: #${rank}
                **XP**: ${currentXP}
                **Level**: ${userXP.level}
                **XP Required to level up**: ${neededXP}
            `);

        return embed;
    }

    async getCardData(userXP) {
        const currentXP = userXP.xp - this.calculateXPForLevel(userXP.level);
        const neededXP = this.calculateRequiredXP(userXP.xp) + currentXP;
        const rank = await User.getRank(userXP);

        return {
            rank: rank,
            level: userXP.level,
            neededXP: neededXP,
            currentXP: currentXP,
            background: userXP.cardSettings.background,
            text: userXP.cardSettings.text,
        };
    }

    calculateLevel(xp) {
        return Math.floor(0.1 * Math.sqrt(xp));
    }

    calculateRequiredXP(xp) {
        let currentLevel = this.calculateLevel(xp);
        const nextLevel = this.calculateLevel(xp) + 1;

        let neededXP = 0;
        while (currentLevel < nextLevel) {
            neededXP++;
            currentLevel = this.calculateLevel(xp + neededXP);
        }

        return neededXP;
    }

    calculateXPForLevel(level) {
        let xp = 0;
        let currentLevel = 0;

        while (currentLevel != level) {
            xp++;
            currentLevel = this.calculateLevel(xp);
        }

        return xp;
    }
};