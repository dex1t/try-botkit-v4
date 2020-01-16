module.exports = controller => {
  let memory = null; // TODO: make persistent to Redis or Mongo

  controller.on("slash_command", async (bot, message) => {
    if (message.command == "/whisperbot-subscribe") {
      memory = message.reference;
      await bot.replyPrivate(
        message,
        `OK :+1: I'm subscribing \`${message.text}\` on Intercom.`
      );
    }
  });

  controller.webserver.get("/intercom", async (req, res) => {
    if (memory) {
      const bot2 = await controller.spawn(memory.conversation.id);
      await bot2.startConversationInChannel(
        memory.conversation.id,
        memory.user
      );
      await bot2.say("got webhook");
    }
    res.send({});
  });
};
