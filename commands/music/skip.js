const { Command } = require('discord.js-commando');

module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: ['skip-song', 'advance-song'],
            memberName: 'skip',
            guildOnly: true,
            group: 'music',
            description: 'Skip currently playing song',
        });
    }

    run(message) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.reply('Join a channel and try again');

        if (
            typeof message.guild.musicData.songDispatcher == 'undefined' ||
            message.guild.musicData.songDispatcher == null
        ) {
            return message.reply('There is no song playing right now!');
        } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
            message.reply(
                `You must be in the same voice channel as the bot's in order to use that!`,
            );
            return;
        }

        message.guild.musicData.loopSong = false;
        message.guild.musicData.songDispatcher.end();
    }
};