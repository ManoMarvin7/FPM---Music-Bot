const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "continuar",
  aliases: ["r", "resume"],
  description: "Retomar a musica",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Não há nada tocando.").catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ Pause desfeito`).catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 8000}));
    }

    return message.reply("A música não está pausada.").catch(console.error).then(msg => msg.delete({timeout: 5000}));
  }
};
