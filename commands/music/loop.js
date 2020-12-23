const { Command } = require('discord.js-commando');

module.exports = class LoopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            group: 'music',
            memberName: 'loop',
            guildOnly: true,
            description: 'Loop currently playing song',
        });
    }

    run(message) {
        if(!message.guild.musicData.isPlaying) {
            return message.reply('There\'s no song playing right now');
        } else if(message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            message.reply('You must be in a same voice channel as the bot, to use this');
            return;
        }

        if(message.guild.musicData.loopSong) {
            message.guild.musicData.loopSong = false;
            message.say(`**${message.guild.musicData.nowPlaying.title}** is not longer on loop :arrow_right_hook:`);
        } else {
            message.guild.musicData.loopSong = true;
            message.say(`**${message.guild.musicData.nowPlaying.title}** is now playing on loop :arrows_counterclockwise:`);
        }
    }
};