const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "remove",
  description: "Remover música da fila",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Não tem nada na fila.").catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`escreva: ${message.client.prefix}remove <Numero na fila>`).then(msg => msg.delete({timeout: 10000}));
    if (isNaN(args[0])) return message.reply(`escreva: ${message.client.prefix}remove <Numero na fila>`).then(msg => msg.delete({timeout: 10000}));

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ removido(a) **${song[0].title}** da fila.`).then(msg => msg.delete({timeout: 7000}));
  }
};
