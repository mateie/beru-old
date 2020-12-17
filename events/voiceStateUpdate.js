const { client } = require('../index');

client.on('voiceStateUpdate', async (___, newState) => {
    if(
        newState.member.user.bot &&
        !newState.channelID &&
        newState.guild.musicData.songDispatcher &&
        newState.member.user.id === client.user.id
    ) {
        newState.guild.musicData.queue.length = 0;
        newState.guild.musicData.songDispacher.end();
    }

    if(
        newState.member.user.bot &&
        newState.channelID &&
        newState.member.user.id === client.user.id &&
        !newState.selfDeaf
    ) {
        newState.setSelfDeaf(true);
    }
});