const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pp",
  aliases: ["pulapara","st","skipto"],
  description: "Pule para o número da fila selecionado",
  execute(message, args) {
    message.delete()
    if (!args.length)
      return message
        .reply(`escreva: ${message.client.prefix}${module.exports.name} <Número da fila>`)
        .catch(console.error).then(msg => msg.delete({timeout: 10000}));

    if (isNaN(args[0]))
      return message
        .reply(`escreva: ${message.client.prefix}${module.exports.name} <Número da fila> (-fila para ver a fila de musicas)`)
        .catch(console.error).then(msg => msg.delete({timeout: 10000}));

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Não há fila.").catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;

    if (args[0] > queue.songs.length)
      return message.reply(`A fila tem apenas ${queue.songs.length}!`).catch(console.error).then(msg => msg.delete({timeout: 7000}));

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ ${args[0] - 1} músicas puladas`).catch(console.error).then(msg => msg.delete({timeout: 5000}));
  }
};
