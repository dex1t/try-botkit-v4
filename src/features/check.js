module.exports = controller => {
  controller.webserver.get("/", async (req, res) => {
    res.send(`It works! This app is running Botkit ${controller.version}.`);
  });

  controller.on("app_mention", async (bot, message) => {
    if (message.incoming_message.channelData.text.includes("ping")) {
      await bot.reply(message, "pong :wave:");
    } else {
      await bot.reply(message, "I received mention :+1:");
    }
  });
};
