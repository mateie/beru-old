const fs = require('fs');
const mongoose = require('mongoose');

module.exports = class Loader {
    constructor(client) {
        this.client = client;
    }

    registry() {
        this.client.registry
        .registerDefaultTypes()
        .registerGroups([
            ['fun', 'Fun Commands'],
            ['guild', 'Guild Commands'],
            ['music', 'Music Commands'],
            ['nsfw', 'NSFW Commands'],
            ['econ', 'Economy Commands'],
            ['customization', 'Customization Commands'],
            ['misc', 'Misc Commands'],
            ['owner', 'Owner Commands'],
        ])
        .registerDefaultGroups()
        .registerDefaultCommands({
            eval: false,
            prefix: false,
            unknownCommand: false,
        })
        .registerCommandsIn(`${process.cwd()}/commands`);

        console.info('Registry Loaded');
    }

    events() {
        let totalEvents = 0;

        let files = fs.readdirSync('./events/');
        let jsFiles = files.filter(f => f.split('.').pop() === 'js');
        totalEvents += jsFiles.length;

        jsFiles.forEach(e => {
            require(`../events/${e}`);
            console.info(`${e} loaded`);
        });

        if(totalEvents > 0) {
            console.info(`${totalEvents} events loaded`);
        } else {
            console.warn('Events not found');
        }
    }

    db() {
        mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.info('Connected to the Database'))
        .catch(err => console.error(err));
    }
};