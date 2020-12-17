const { Modifiers } = require('chalk');
const { Command } = require('discord.js-commando');
const e = require('express');
const Check = require(`${process.cwd()}/util/check`);

const Users = require(`${process.cwd()}/schemas/Users`);
const Guilds = require(`${process.cwd()}/schemas/Guilds`);

module.exports = class ResetDatabaseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resetdatabase',
            memberName: 'resetdatabase',
            description: 'Resets the whole database',
            group: 'owner',
            aliases: ['resetdb', 'resdb'],
            args: [
                {
                    key: 'which',
                    prompt: 'Which database should reset?',
                    type: 'string',
                    oneOf: ['users', 'guilds', 'both'],
                    default: 'both',
                }
            ],
            ownerOnly: true,
        });

        this.check = new Check(client);
    }

    run(message, { which }) {
        message.say(`**Resetting ${which} Database...**`)
            .then(sentMessage => {
                setTimeout(() => {
                    if (which == 'users') {
                        this.resetUsers(sentMessage);
                    } else if (which == 'guilds') {
                        this.resetGuilds(sentMessage);
                    } else {
                        this.resetGuilds(sentMessage)
                        .then(sentMessage => {
                            this.resetUsers(sentMessage)
                            .catch(err => {
                                console.error(err);
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        })

                    }
                }, 1000);
            })
            .catch(err => {
                console.error(err);
            });
    }

    resetUsers(message) {
        return new Promise((resolve, reject) => {
            Users.collection.drop((err, result) => {
                if (err) reject(err);
                if (result) {
                    setTimeout(() => {
                        message.edit('**Deleted Users Database...**')
                            .then(sentMessage => {
                                setTimeout(() => {
                                    this.check.users();
                                    sentMessage.edit('**Created Users Database...**');
                                    resolve(sentMessage);
                                }, 3000);
                            })
                            .catch(err => {
                                console.error(err);
                                reject(err);
                            }, 2000);
                    });
                }
            });
        })
    }

    resetGuilds(message) {
        return new Promise((resolve, reject) => {
            Guilds.collection.drop((err, result) => {
                if (err) reject(err);
                if (result) {
                    setTimeout(() => {
                        message.edit('**Deleted Guilds Database...**')
                            .then(sentMessage => {
                                setTimeout(() => {
                                    this.check.guilds();
                                    sentMessage.edit('**Created Guilds Database...**');
                                    resolve(sentMessage);
                                }, 3000);
                            })
                            .catch(err => {
                                console.error(err);
                                reject(err);
                            }, 2000);
                    });
                }
            });
        })
    }
}