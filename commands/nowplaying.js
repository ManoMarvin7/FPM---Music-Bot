const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
  aliases: ["ta"],
  description: "Mostra a musica que está tocando",
  execute(message) {
    message.delete()
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Não tem nada tocando.").catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 5000}));
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("Está tocando")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor("F.P'Music")
      .addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );

    if (song.duration > 0)
      nowPlaying.setFooter("Tempo restante: " + new Date(left * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying).catch(console.error).then(msg => msg.delete({timeout: 30000}));
  }
};
