const { Command } = require('discord.js-commando');

module.exports = class MoveSongCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'move',
            memberName: 'move',
            aliases: ['m', 'movesong'],
            description: 'Move song to a desired position in queue',
            group: 'music',
            throttling: {
                usages: 1,
                duration: 5,
            },
            args: [
                {
                    key: 'oldPosition',
                    type: 'integer',
                    prompt: 'What is the position of the song you want to move',
                },
                {
                    key: 'newPosition',
                    type: 'integer',
                    prompt: 'What position do you want to move the song to?',
                },
            ],
        });
    }

    async run(message, { oldPosition, newPosition }) {
        if (
            oldPosition < 1 ||
            oldPosition > message.guild.musicData.queue.length ||
            newPosition < 1 ||
            newPosition > message.guild.musicData.queue.length ||
            oldPosition == newPosition
        ) {
            message.reply('Try again and enter a valid song position number');
            return;
        }

        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.reply('Join a channel and try again');
            return;
        }

        if (
            typeof (message.guild.musicData.songDispatcher == 'undefined') ||
            message.guild.musicData.songDispatcher == null
        ) {
            return message.reply('There is not song playing right now');
        } else if(voiceChannel.id !== message.guild.me.voice.channel.id) {
            message.reply('You have to be in the same voice channel as the bot\'s in order to use that');
            return;
        } else if(message.guild.musicData.loopSong) {
            message.reply('**loop** command is on, turn it off before using **move** command');
            return;
        }

        const songName = message.guild.musicData.queue[oldPosition - 1].title;

        MoveSongCommand.array_move(
            message.guild.musicData.queue,
            oldPosition - 1,
            newPosition - 1,
        );

        message.channel.send(`**${songName}** moved to position ${newPosition}`);
    }

    static array_move(arr, old_index, new_index) {
        while(old_index < 0) {
            old_index += arr.length;
        }

        while(new_index < 0) {
            new_index += arr.length;
        }

        if(new_index >= arr.length) {
            let k = new_index - arr.length + 1;
            while(k--) {
                arr.push(undefined);
            }
        }

        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }
};