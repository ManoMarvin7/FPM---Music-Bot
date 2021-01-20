const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pular",
  aliases: ["s","skip"],
  description: "pular a música que está tocando",
  execute(message) {
    message.delete()
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Não tem como pular sem uma fila").catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ Música pulada.`).catch(console.error).then(msg => msg.delete({timeout: 5000}));
  }
};
