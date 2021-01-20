const { canModifyQueue } = require("../util/EvobotUtil");


module.exports = {
  name: "stop",
  aliases:["parar","dc"],
  description: "Para completamente a música",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("Não tem nada tocando").catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ musica parada!`).catch(console.error).then(msg => msg.delete({timeout: 6000}));
  }
};
