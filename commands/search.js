const { MessageEmbed } = require("discord.js");
const { YOUTUBE_API_KEY } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "procurar",
  aliases: ["buscar","search"],
  description: "Pesquisa e escolhe a musica para reproduzir",
  async execute(message, args) {
    message.delete()
    if (!args.length)
      return message.reply(`Escreva: ${message.client.prefix}${module.exports.name} <Nome do video>`).catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (message.channel.activeCollector)
      return message.reply("Já tem uma procura em andamento...").then(msg => msg.delete({timeout: 5000}));
    if (!message.member.voice.channel)
      return message.reply("Você precisa estar em um canal de voz").catch(console.error).then(msg => msg.delete({timeout: 5000}));

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(`**Responda com o número da música que deseja colocar**`)
      .setDescription(`Resultados para: ${search}`)
      .setColor("#F8AA2A");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      var resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /(^[1-9][0-9]{0,1}$)/g;
        return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;

      message.channel.activeCollector = false;
      message.client.commands.get("play").execute(message, [choice]);
      resultsMessage.delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
    }
  }
};
