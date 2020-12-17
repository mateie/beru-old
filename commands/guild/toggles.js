const { MessageEmbed, Channel } = require('discord.js');
const { Command } = require('discord.js-commando');
const { toLowerCase } = require('ffmpeg-static');
const Guild = require(`${process.cwd()}/schemas/Guilds`);

module.exports = class TogglesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'toggles',
            description: 'Update/Check Toggles inside the database for the guild',
            memberName: 'toggles',
            group: 'guild',
            args: [
                {
                    key: 'toggleName',
                    prompt: 'Which toggle do you want to change or check?',
                    type: 'string',
                    default: '',
                },
                {
                    key: 'toggleValue',
                    prompt: 'Enable it or Disable it?',
                    type: 'string',
                    oneOf: ['enable', 'disable'],
                    default: '',
                }
            ]
        });
    }

    run(message, { toggleName, toggleValue }) {
        let embed = new MessageEmbed()
            .setTitle(`${message.guild.name} Toggles Settings`);
        this.findToggles(message.guild.id)
            .then(toggles => {
                if (toggleName == '') {
                    for (let i = 1; i < Object.keys(toggles).length; i++) {
                        let toggleNameDB = Object.keys(toggles)[i];
                        let toggleValueDB = toggles[toggleName];
                        embed.addField(toggleNameDB, toggleValueDB ? 'Enabled' : 'Disabled', true);
                    }

                    return message.say(embed);
                } else {
                    if (toggleValue == '') {
                        if (typeof toggles[toggleName] == 'undefined') {
                            return message.say(`**${toggleName}** Toggle doesn't exist!`)
                        } else {
                            return message.say(`**${toggleName}** Toggle is set to **${toggles[toggleName] ? 'Enabled' : 'Disabled'}**`)
                        }
                    } else {
                        this.setToggle(message.guild.id, toggleName, toggleValue)
                            .then(() => {
                                message.say(`**${toggleName}** Toggle was **${toggleValue}d**`)
                            })
                            .catch(err => {
                                console.error(err)
                            });
                    }
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    findToggles(guild) {
        return new Promise((resolve, reject) => {
            Guild.findOne({
                id: guild,
            })
                .then(guild => {
                    guild.save();
                    resolve(guild.toggles);
                })
                .catch(err => {
                    console.error(err);
                    reject(err);
                });
        });
    }

    setToggle(guild, toggleName, toggleValue) {
        return new Promise((resolve, reject) => {
            this.findToggles(guild)
                .then(toggles => {
                    toggles[toggleName] = toggleValue == 'enable' ? true : false;
                    resolve(guild);
                })
                .catch(err => {
                    console.error(err);
                    reject(err);
                });
        });
    }
}