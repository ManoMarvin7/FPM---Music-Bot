const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "ajuda", "hp"],
  description: "Mostra todos os comandos e suas funções",
  execute(message) {
    message.delete()
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("F.P'Music")
      .setDescription("Lista de comandos")
      .setFooter("First Phoenix Music © - 2020")
      .setColor("#F8AA2A");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error).then(msg => msg.delete({timeout: 150000}));
  }
};
