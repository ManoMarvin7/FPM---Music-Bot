const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "Coloca a musica em loop",
  execute(message) {
    message.delete()
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Não tem nada tocando").catch(console.error).catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(`O Loop agora está ${queue.loop ? "**ligado**" : "**desligado**"}`).catch(console.error).then(msg => msg.delete({timeout: 5000}))
      .catch(console.error);
  }
};
