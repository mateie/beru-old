const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = class LyricsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            memberName: 'lyrics',
            aliases: ['lr'],
            description: 'Get lyrics of currently playing song or provided one',
            group: 'music',
            throttling: {
                usages: 1,
                duration: 10,
            },
            args: [
                {
                    key: 'songName',
                    default: '',
                    type: 'string',
                    prompt: 'What song lyrics would you like to get?',
                },
            ],
        });
    }

    async run(message, { songName }) {
        if (songName == '' && message.guild.musicData.isPlaying) {
            songName = message.guild.musicData.nowPlaying.title;
        } else if (songName == '' && !message.guild.musicData.isPlaying) {
            return message.say(
                'There is no song playing right now, please try again with a song name or play a song first',
            );
        }

        const sentMessage = await message.channel.send(
            '** Searching for Lyrics **',
        );

        songName = songName.replace(/ *\([^)]*\) */g, '');

        songName = songName.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            '',
        );

        console.log(songName);
        LyricsCommand.searchSong(songName)
        .then(url => {
            LyricsCommand.getSongPageURL(url)
            .then(url => {
                LyricsCommand.getLyrics(url)
                .then(lyrics => {
                    if(lyrics.length > 4095) {
                        message.say('Lyrics are too lojng to be returned in embed');
                        return;
                    }

                    if(lyrics.length > 2048) {
                        const lyricsEmbed = new MessageEmbed()
                        .setDescription(lyrics.trim())
                        .setFooter('Genius.com');

                        return sentMessage.edit('', lyricsEmbed);
                    } else {
                        const firstLyricsEmbed = new MessageEmbed()
                        .setDescription(lyrics.slice(0, 2048))
                        .setFooter('Genius.com');

                        const secondLyricsEmbed = new MessageEmbed()
                        .setDescription(lyrics.slice(2048, lyrics.length))
                        .setFooter('Genius.com');

                        sentMessage.edit('', firstLyricsEmbed);
                        message.channel.send(secondLyricsEmbed);
                        return;
                    }
                })
                .catch(err => {
                    message.say(err);
                    return;
                });
            })
            .catch(err => {
                message.say(err);
                return;
            });
        })
        .catch(err => {
            message.say(err);
            return;
        });
    }

    static searchSong(query) {
        return new Promise(async (resolve, reject) => {
            const searchURL = `https://api.genius.com/search?1=${encodeURI(query)}`;
            const headers = {
                Authorization: `Bearer ${process.env.GENIUS_API}`,
            };

            try {
                const body = await fetch(searchURL, { headers });
                const result = await body.json();
                console.log(result);
                const songPath = result.response.hits[0].result.api_path;
                resolve(`https://api.genius.com${songPath}`);
            } catch (e) {
                reject('No song was found for this query');
            }
        });
    }

    static getSongPageURL(url) {
        return new Promise(async (resolve, reject) => {
            const headers = {
                Authorization: `Bearer ${process.env.GENIUS_API}`,
            };

            try {
                const body = await fetch(url, { headers });
                const result = await body.json();
                if (!result.response.song.url) {
                    reject('There was a problem finding a URL for this song');
                } else {
                    resolve(result.response.song.url);
                }
            } catch (e) {
                console.error(e);
                reject('There was a problem finding a URL for this song');
            }
        });
    }

    static getLyrics(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url);
                const text = await response.text();
                const $ = cheerio.load(text);
                let lyrics = $('.lyrics')
                    .text()
                    .trim();

                if (!lyrics) {
                    $('.Lyrics_Container-sc-1ynbvzw-2')
                        .find('br')
                        .replaceWith('\n');

                    lyrics = $('.Lyrics_Container-sc-1ynbvzw-2').text();
                    if (!lyrics) {
                        reject('There was a problem fetching lyrics for this song, try again or try a different song');
                    } else {
                        resolve(lyrics.replace(/(\[.+\])/g, ''));
                    }
                } else {
                    resolve(lyrics.replace(/(\[.+\])/g, ''));
                }
            } catch (e) {
                console.error(e);
                reject('There was a problem fetching lyrics for this song, try again or try a different song');
            }
        });
    }
};