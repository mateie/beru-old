const colorNames = require('colornames');
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const Guild = require(`${process.cwd()}/schemas/Guild`);

module.exports = class ChannelsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'channels',
            description: 'Update Channels inside the database',
            memberName: 'channels',
            group: 'guild',
            args: [
                {
                    key: 'channelName',
                    prompt: 'Which channel do you want to change or check',
                    type: 'string',
                    default: '',
                },
                {
                    key: 'channelValue',
                    prompt: 'Provide a channel',
                    type: 'channel',
                    default: '',
                    error: 'You provided an invalid text channel',
                }
            ],
            userPermissions: ['MANAGE_GUILD'],
        });
    }

    run(message, { channelName, channelValue }) {
        let embed = new MessageEmbed()
            .setTitle(`${message.guild.name} Channels Settings`);
        this.findChannels(message.guild.id)
            .then(channels => {
                if (channelName == '') {
                    for (let i = 1; i < Object.keys(channels).length; i++) {
                        let channelName = Object.keys(channels)[i];
                        let channelValue = channels[channelName];
                        embed.addField(channelName, channelValue != '' ? channelValue : 'None', true);
                    }

                    return message.say(embed);
                } else {
                    if (channelValue == '') {
                        if (typeof channels[channelName] == 'undefined') {
                            return message.say(`**${channelName}** Channel doesn't exist`);
                        } else {
                            return message.say(`**${channelName}** Channel is set to **${channels[channelName] != '' ? channelValue : 'None'}**`);
                        }
                    } else {
                        this.setChannel(message.guild.id, channelName, channelValue)
                        .then(() => {
                            message.say(`**${channelName}** Channel was set to **${channelValue}**`);
                        })    
                        .catch(err => {
                                console.error(err);
                            });
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    findChannels(guild) {
        return new Promise((resolve, reject) => {
            Guild.findOne({
                id: guild,
            })
                .then(guild => {
                    guild.save();
                    resolve(guild.channels);
                })
                .catch(err => {
                    console.error(err);
                    reject(err);
                });
        })
    }

    setChannel(guild, channelName, channelValue) {
        return new Promise((resolve, reject) => {
            this.findChannels(guild)
                .then(channels => {
                    channels[channelName] = channelValue.id;
                    resolve(guild);
                })
                .catch(err => {
                    console.error(err);
                    reject(err);
                });
        })
    }
}