const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "embaralhar",
  aliases:["emb", "shuffle"],
  description: "embaralha as musicas da fila",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Não há fila.").catch(console.error).then(msg => msg.delete({timeout: 5000}));
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(`${message.author} 🔀 embaralhou a fila`).catch(console.error).then(msg => msg.delete({timeout: 7000}));
  }
};
