const { Command } = require('discord.js-commando');

module.exports = class MuteDeafCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mutedeaf',
            group: 'guild',
            description: 'Deafs and Mutes members in a current channel',
            memberName: 'mutedeaf',
            aliases: ['md'],
            clientPermissions: ['MUTE_MEMBERS', 'DEAFEN_MEMBERS'],
            userPermissions: ['MUTE_MEMBERS', 'DEAFEN_MEMBERS'],
        });
    }

    run(message) {
        const voiceChannelState = message.member.voice;
        const voiceChannel = message.guild.channels.cache.get(voiceChannelState.channelID);

        let inChannel = true;

        if(message.guild.voiceStates.cache.size < 1) {
            return message.say('All **Voice Channels** are empty');
        }

        let allBoth = false;

        if(!voiceChannelState || !voiceChannelState.channelID) {
            inChannel = false;
        } else {
            message.guild.voiceStates.cache.forEach(state => {
                if(state.channelID === voiceChannelState.channelID) {
                    if(!state.mute && !state.deaf) {
                        state.setMute(true);
                        state.setDeaf(true);
                        allBoth = true;
                    } else {
                        state.setMute(false);
                        state.setDeaf(false);
                        allBoth = false;
                    }
                }
            });
        }

        if(!inChannel) {
            return message.say(`${message.author} you have to be in a Voice Channel`);
        }

        if(allBoth) {
            return message.say(`${message.author} muted and deafened **Members** in **${voiceChannel.name}**`);
        } else {
            return message.say(`${message.author} unmuted and undeafend **Members** in **${voiceChannel.name}**`);
        }
    }
};