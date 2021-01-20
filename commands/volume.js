const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Alterar o volume",
  execute(message, args) {
    message.delete()
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Não tem nada tocando").catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member))
      return message.reply("Você precisa estar no canal de voz").catch(console.error).then(msg => msg.delete({timeout: 5000}));

    if (!args[0]) return message.reply(`🔊 Volume alterado para: **${queue.volume}%**`).catch(console.error).then(msg => msg.delete({timeout: 8000}));
    if (isNaN(args[0])) return message.reply("Use um número para definir o volume.").catch(console.error).then(msg => msg.delete({timeout: 10000}));
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Um número entre 0 - 100.").catch(console.error).then(msg => msg.delete({timeout: 8000}));

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`Volume em: **${args[0]}%**`).catch(console.error).then(msg => msg.delete({timeout: 5000}));
  }
};
