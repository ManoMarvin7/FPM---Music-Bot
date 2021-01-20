module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("Você precisa entrar em um canal de voz primeiro").catch(console.error).then(msg => msg.delete({timeout: 5000}));
      return false;
    }

    return true;
  }
};
