const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class NowPlayingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            group: 'music',
            memberName: 'nowplaying',
            aliases: ['np', 'currentplaying', 'currently-playing', 'now-playing'],
            guildOnly: true,
            description: 'Display currently playing song',
        });
    }

    run(message) {
        if (!message.guild.musicData.isPlaying && !message.guild.musicData.nowPlaying) {
            return message.reply('There is no song playing right now');
        }

        const video = message.guild.musicData.nowPlaying;
        let description;

        if (video) {
            if (video.duration == 'Live Stream') {
                description = 'Live Stream';
            } else {
                description = this.playbackBar(message, video);
            }
        }

        const title = message.guild.musicData.loopSong
            ? `${video.title} **On Loop**`
            : video.title;

        const videoEmbed = new MessageEmbed()
            .setThumbnail(video.thumbnail)
            .setTitle(title)
            .setDescription(description);

        message.channel.send(videoEmbed);
        return;
    }

    playbackBar(message, video) {
        const passedTimeInMS = message.guild.musicData.songDispatcher.streamTime;
        const passedTimeinMSObj = {
            seconds: Math.floor((passedTimeInMS / 1000) % 60),
            minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
            hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24),
        };

        const passedTimeFormatted = this.formatDuration(
            passedTimeinMSObj,
        );

        const totalDurationObj = video.rawDuration;
        const totalDurationFormatted = this.formatDuration(
            totalDurationObj,
        );

        let totalDurationInMS = 0;
        Object.keys(totalDurationObj).forEach(key => {
            if (key == 'hours') {
                totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 3600000;
            } else if (key == 'minutes') {
                totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 60000;
            } else if (key == 'seconds') {
                totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 100;
            }
        });

        const playBackBarLocation = Math.round(
            (passedTimeInMS / totalDurationInMS) * 10,
        );

        let playBack = '';

        for (let i = 1; i < 21; i++) {
            if (playBackBarLocation == 0) {
                playBack = ':white_circle:▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
                break;
            } else if (playBackBarLocation == 10) {
                playBack = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬:white_circle:';
                break;
            } else if (i == playBackBarLocation * 2) {
                playBack = playBack + ':white_circle:';
            } else {
                playBack = playBack + '▬';
            }
        }

        playBack = `${passedTimeFormatted} ${playBack} ${totalDurationFormatted}`;
        return playBack;
    }

    formatDuration(durationObj) {
        const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${durationObj.minutes ? durationObj.minutes : '00'
            }:${(durationObj.seconds < 10)
                ? ('0' + durationObj.seconds)
                : (durationObj.seconds
                    ? durationObj.seconds
                    : '00')
            }`;
        return duration;
    }
};