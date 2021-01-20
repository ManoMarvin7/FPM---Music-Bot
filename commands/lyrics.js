const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "letra",
  aliases: ["ly", "lyrics"],
  description: "Mostra a letra da musica que está tocando",
  async execute(message) {
    message.delete()
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Não tem nada tocando").catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 5000}));

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `Letra de ${queue.songs[0].title} não encontrada.`;
    } catch (error) {
      lyrics = `Letra de ${queue.songs[0].title} não encontrada.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Letra")
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 60000}));
  }
};
