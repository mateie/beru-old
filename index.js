require('dotenv').config();
const BeruCommandoClient = require(`${process.cwd()}/classes/BeruCommandoClient`);
const { Structures } = require('discord.js');

Structures.extend('Guild', (Guild) => {
    class BeruGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                songDispatcher: null,
                skipTimer: false,
                loopSong: false,
                volume: 1,
            };
        }
    }

    return BeruGuild;
});

const client = new BeruCommandoClient({
    commandPrefix: 'b!',
    owner: process.env.OWNER_ID,
});

module.exports = {
    client: client,
};

const Loader = require('./util/loader');
const load = new Loader(client);

load.db();
load.registry();
load.events();

client.login(process.env.BOT_TOKEN);