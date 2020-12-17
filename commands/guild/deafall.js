const { Command } = require('discord.js-commando');

module.exports = class DeafAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deafall',
            group: 'guild',
            description: 'Deaf all members in a current channel',
            memberName: 'deafall',
            aliases: ['dall', 'dfall'],
            clientPermissions: ['DEAFEN_MEMBERS'],
            userPermissions: ['DEAFEN_MEMBERS'],
        });
    }
    run(message) {
        const voiceChannelState = message.member.voice;
        const voiceChannel = message.guild.channels.cache.get(voiceChannelState.channelID);

        let inChannel = true;

        if(message.guild.voiceStates.cache.size < 1) {
            return message.say('All **Voice Channels** are empty');
        }

        let allDeafen = false;

        if(!voiceChannelState || !voiceChannelState.channelID) {
            inChannel = false;
        } else {
            message.guild.voiceStates.cache.forEach(state => {
                if(state.channelID === voiceChannelState.channelID) {
                    if(!state.deaf) {
                        state.setDeaf(true);
                        allDeafen = true;
                    } else {
                        state.setDeaf(false);
                        allDeafen = false;
                    }
                }
            });
        }

        if(!inChannel) {
            return message.say(`${message.author} you have to be in a Voice Channel`);
        }

        if(allDeafen) {
            return message.say(`${message.author} deafened **Members** in **${voiceChannel.name}**`);
        } else {
            return message.say(`${message.author} undeafened **Members** in **${voiceChannel.name}**`);
        }
    }
};