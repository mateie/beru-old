const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class ShuffleQueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shuffle',
            memberName: 'shuffle',
            group: 'music',
            description: 'Shuffle Song Queue',
            guildOnly: true,
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
        } else if (message.guild.musicData.loopSong) {
            message.reply(
                'Turn off the **loop** command before using the **shuffle** command',
            );
            return;
        }
        if (message.guild.musicData.queue.length < 1) {
            return message.say('There are no songs in queue');
        }

        ShuffleQueueCommand.shuffleQueue(message.guild.musicData.queue);

        const titleArray = [];
        message.guild.musicData.queue.slice(0, 10).forEach(obj => {
            titleArray.push(obj.title);
        });

        let numOfEmbedFields = 10;
        if (titleArray.length < 10) numOfEmbedFields = titleArray.length;

        const queueEmbed = new MessageEmbed()
            .setTitle('New Music Queue');

        for (let i = 0; i < numOfEmbedFields; i++) {
            queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
        }

        return message.say(queueEmbed);
    }

    static shuffleQueue(queue) {
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
    }
};