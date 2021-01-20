const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
  description: "Pausa a musica em reprodução",
  execute(message) {
    message.delete()
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Não tem nada tocando").catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ musica pausada.`).catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 8000}));
    }
  }
};
