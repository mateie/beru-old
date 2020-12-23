const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const Search = require('usetube');
const youtube = new Youtube(process.env.YOUTUBE_API);

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['play-song', 'add'],
            memberName: 'play',
            group: 'music',
            description: 'Play any song or playlist from youtube',
            guildOnly: true,
            clientPermissions: ['SPEAK', 'CONNECT'],
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                    key: 'query',
                    prompt: 'What song or playlist would like to listen to?',
                    type: 'string',
                    validate: function(query) {
                        return query.length > 0 && query.length < 200;
                    },
                },
            ],
        });
    }

    async run(message, { query }) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            message.reply('Join a **Voice Channel** and try again');
            return;
        }

        if (!query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/) && query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
            let searchResults = await Search.searchVideo(query);
            if (searchResults.tracks.length > 0) {
                query = searchResults.tracks[0];

                const id = query.id;
                const video = await youtube.getVideoByID(id).catch(e => {
                    console.error(e);
                    message.reply('There was a problem getting the video you provided!');
                    return;
                });

                message.guild.musicData.queue.push(
                    PlayCommand.constructSongObj(video, voiceChannel, message.member.user),
                );

                if (message.guild.musicData.isPlaying == false || typeof (message.guild.musicData.isPlaying == 'undefined')) {
                    message.guild.musicData.isPlaying = true;
                    return PlayCommand.playSong(message.guild.musicData.queue, message);
                } else if (message.guild.musicData.isPlaying == true) {
                    message.say(`${video.title} added to the queue`);
                    return;
                }
            }
        } else {
            if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
                const playlist = await youtube.getPlaylist(query).catch(function() {
                    message.say('Playlist is either private or it does not exist!');
                    return;
                });

                const vidoesArr = await playlist.getVideos().catch(function() {
                    message.say('There was a problem getting one of the videos in the playlist');
                    return;
                });

                for (let i = 0; i < vidoesArr.length; i++) {
                    if (vidoesArr[i].raw.status.privacyStatus == 'private') {
                        continue;
                    } else {
                        try {
                            const video = await vidoesArr[i].fetch();

                            message.guild.musicData.queue.push(
                                PlayCommand.constructSongObj(
                                    video,
                                    voiceChannel,
                                    message.member.user,
                                ),
                            );
                        } catch (err) {
                            return console.error(err);
                        }
                    }
                }

                if (message.guild.musicData.isPlaying == false) {
                    message.guild.musicData.isPlaying = true;
                    return PlayCommand.playSong(message.guild.musicData.queue, message);
                } else if (message.guild.musicData.isPlaying == true) {
                    message.say(
                        `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`,
                    );
                    return;
                }
            }

            if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
                query = query
                    .replace(/(>|<)/gi, '')
                    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

                const id = query[2].split(/[^0-9a-z_-]/i)[0];
                const video = await youtube.getVideoByID(id).catch(e => {
                    console.error(e);
                    message.say('There was a problem getting the video you provided!');
                    return;
                });

                message.guild.musicData.queue.push(
                    PlayCommand.constructSongObj(video, voiceChannel, message.member.user),
                );

                if (message.guild.musicData.isPlaying == false || typeof (message.guild.musicData.isPlaying == 'undefined')) {
                    message.guild.musicData.isPlaying = true;
                    return PlayCommand.playSong(message.guild.musicData.queue, message);
                } else if (message.guild.musicData.isPlaying == true) {
                    message.say(`${video.title} added to the queue`);
                    return;
                }
            }
        }

        const videos = await youtube.searchVideos(query, 5).catch(async function() {
            await message.say(
                'There was a problem searching the video you requested',
            );
            return;
        });

        if (videos.length < 5 || !videos) {
            message.say(
                'I couldn\'t find whatever you\'re looking for',
            );
            return;
        }

        const vidNameArr = [];
        for (let i = 0; i < videos.length; i++) {
            vidNameArr.push(`${i + 1}: ${videos[i].title}`);
        }
        vidNameArr.push('exit');

        const embed = new MessageEmbed()
            .setTitle('Choose a song by commenting a number between 1 and 5')
            .addField('Song :one:', vidNameArr[0])
            .addField('Song :two:', vidNameArr[1])
            .addField('Song :three:', vidNameArr[2])
            .addField('Song :four:', vidNameArr[3])
            .addField('Song :five:', vidNameArr[4])
            .addField('Exit :arrow_backward:', 'exit');

        let songEmbed = await message.channel.send({ embed });

        message.channel
            .awaitMessages(
                msg => {
                    return (msg.content > 0 && msg.content < 6) || msg.content === 'exit';
                },
                {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                },
            )
            .then(response => {
                const videoIndex = parseInt(response.first().content);
                if (response.first().content === 'exit') {
                    songEmbed.delete();
                    return;
                }
                youtube
                    .getVideoByID(videos[videoIndex - 1].id)
                    .then(video => {
                        if (video.raw.snippet.liveBroadcastContent === 'live') {
                            songEmbed.delete();
                            return message.say('Live streams are not supported');
                        }

                        message.guild.musicData.queue.push(
                            PlayCommand.constructSongObj(
                                video,
                                voiceChannel,
                                message.member.user,
                            ),
                        );

                        if (message.guild.musicData.isPlaying == false) {
                            message.guild.musicData.isPlaying = true;
                            if (songEmbed) {
                                songEmbed.delete();
                            }

                            PlayCommand.playSong(message.guild.musicData.queue, message);
                        } else if (message.guild.musicData.isPlaying == true) {
                            if (songEmbed) {
                                songEmbed.delete();
                            }
                            message.say(`${video.title} added to the queue`);
                            return;
                        }
                    })
                    .catch(() => {
                        message.say('Error trying to get the video ID from youtube');
                        return;
                    });
            })
            .catch(() => {
                if (songEmbed) {
                    songEmbed.delete();
                }
                message.say('Please try again and enter a number between 1 and 5 or exit');
                return;
            });
    }

    static playSong(queue, message) {
        const classThis = this;
        queue[0].voiceChannel
            .join()
            .then(conn => {
                const dispatcher = conn
                    .play(ytdl(queue[0].url, {
                        quality: 'highestaudio',
                        highWaterMark: 1 << 25,
                    }))
                    .on('start', () => {
                        message.guild.musicData.songDispatcher = dispatcher;
                        dispatcher.setVolume(message.guild.musicData.volume);
                        const videoEmbed = new MessageEmbed()
                            .setThumbnail(queue[0].thumbnail)
                            .addField('Now Playing:', queue[0].title)
                            .addField('Duration:', queue[0].duration)
                            .setFooter(`Requested by ${queue[0].memberDisplayName}`, queue[0].memberAvatar);

                        if (queue[1] && !message.guild.musicData.loopSong) {
                            videoEmbed.addField('Next Song:', queue[1].title);
                        }
                        message.say(videoEmbed);
                        message.guild.musicData.nowPlaying = queue[0];
                        queue.shift();
                        return;
                    })
                    .on('finish', () => {
                        queue = message.guild.musicData.queue;
                        if (message.guild.musicData.loopSong) {
                            queue.unshift(message.guild.musicData.nowPlaying);
                        }

                        if (queue.length >= 1) {
                            classThis.playSong(queue, message);
                            return;
                        } else {
                            message.guild.musicData.isPlaying = false;
                            message.guild.musicData.nowPlaying = null;
                            message.guild.musicData.songDispatcher = null;
                            if (message.guild.me.voice.channel && message.guild.musicData.skipTimer) {
                                message.guild.me.voice.channel.leave();
                                message.guild.musicData.skipTimer = false;
                                return;
                            }

                            if (message.guild.me.voice.channel) {
                                setTimeout(function onTimeOut() {
                                    if (message.guild.musicData.isPlaying == false && message.guild.me.voice.channel) {
                                        message.guild.me.voice.channel.leave();
                                    }
                                }, 90000);
                            }
                        }
                    })
                    .on('error', e => {
                        message.say('Cannot play song');
                        console.error(e);
                        message.guild.musicData.queue.length = 0;
                        message.guild.musicData.isPlaying = false;
                        message.guild.musicData.nowPlaying = null;
                        message.guild.musicData.loopSong = false;
                        message.guild.musicData.songDispatcher = null;
                        message.guild.me.voice.channel.leave();
                        return;
                    });
            })
            .catch(e => {
                console.error(e);
                message.say('I have no permission to join your channel!');
                message.guild.musicData.queue.length = 0;
                message.guild.musicData.isPlaying = false;
                message.guild.musicData.nowPlaying = null;
                message.guild.musicData.loopSong = false;
                message.guild.musicData.songDispatcher = null;
                if (message.guild.me.voice.channel) {
                    message.guild.me.voice.channel.leave();
                }
                return;
            });
    }

    static constructSongObj(video, voiceChannel, user) {
        let duration = this.formatDuration(video.duration);
        if (duration == '00:00') duration = 'Live Stream';
        return {
            url: `https://www.youtube.com/watch?v=${video.raw.id}`,
            title: video.title,
            rawDuration: video.duration,
            duration,
            thumbnail: video.thumbnails.high.url,
            voiceChannel,
            memberDisplayName: user.username,
            memberAvatar: user.avatarURL('webp', false, 16),
        };
    }

    static formatDuration(durationObj) {
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