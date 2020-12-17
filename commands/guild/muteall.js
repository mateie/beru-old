const { Command } = require('discord.js-commando');

module.exports = class MuteAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'muteall',
            group: 'guild',
            description: 'Mute all members in a current channel',
            memberName: 'muteall',
            aliases: ['mall', 'mtall'],
            clientPermissions: ['MUTE_MEMBERS'],
            userPermissions: ['MUTE_MEMBERS'],
        });
    }

    run(message) {
        const voiceChannelState = message.member.voice;
        const voiceChannel = message.guild.channels.cache.get(voiceChannelState.channelID);

        let inChannel = true;

        if(message.guild.voiceStates.cache.size < 1) {
            return message.say('All **Voice Channels** are empty');
        }

        let allMuted = false;

        if(!voiceChannelState || !voiceChannelState.channelID) {
            inChannel = false;
        } else {
            message.guild.voiceStates.cache.forEach(state => {
                if(state.channelID === voiceChannelState.channelID) {
                    if(!state.mute) {
                        state.setMute(true);
                        allMuted = true;
                    } else {
                        state.setMute(false);
                        allMuted = false;
                    }
                }
            });
        }
        if(!inChannel) {
            return message.say(`${message.author} you have to be in a Voice Channel`);
        }

        if(allMuted) {
            return message.say(`${message.author} muted **Members** in **${voiceChannel.name}**`);
        } else {
            return message.say(`${message.author} unmuted **Members** in **${voiceChannel.name}**`);
        }
    }
};