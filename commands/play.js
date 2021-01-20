const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Inicia uma música do YouTube ou Soundcloud",
  async execute(message, args) {
    message.delete()
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("Você precisa entrar em um canal de voz primeiro!").catch(console.error).then(msg => msg.delete({timeout: 8000}));
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`Você deve estar no mesmo canal que ${message.client.user}`).catch(console.error).then(msg => msg.delete({timeout: 8000}));

    if (!args.length)
      return message
        .reply(`escreva: ${message.client.prefix}play <YouTube URL / Nome do video / Soundcloud URL>`).then(msg => msg.delete({timeout: 6000}))
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Não tenho permissão para me conectar nesse canal de voz.").then(msg => msg.delete({timeout: 5000}));
    if (!permissions.has("SPEAK"))
      return message.reply("Eu não posso colocar musicas nesse canal, verifique as permissões.").then(msg => msg.delete({timeout: 5000}));

//----------------------------------------------------------------------------------------------------------------------------------------------------------//

      
// ta olhando oq? seu esquizofrênico...


//----------------------------------------------------------------------------------------------------------------------------------------------------------//

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        if (error.statusCode === 404)
          return message.reply("Não foi possivel achar esse audio").catch(console.error).then(msg => msg.delete({timeout: 5000}));
        return message.reply("Não encontrei esse áudio no soundcloud...").catch(console.error).then(msg => msg.delete({timeout: 5000}));
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply("Não encontrei nada, coloque por link ou escreva o titulo exatamente com está no video...").catch(console.error).then(msg => msg.delete({timeout: 12000}));
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(`✅ **${song.title}** Adicionado à fila pelo ${message.author}`).then(msg => msg.delete({timeout: 7000}))
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`Não foi possível entrar no canal... ${error}`).catch(console.error);
    }
  }
};
