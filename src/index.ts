import { Botkit } from "botkit";
import { SlackAdapter, SlackEventMiddleware } from "botbuilder-adapter-slack";

const adapter = new SlackAdapter({
  clientSigningSecret: process.env.SLACK_CLIENT_SIGNING_SECRET,
  botToken: process.env.SLACK_BOT_OAUTH_TOKEN,
  redirectUri: ""
});
adapter.use(new SlackEventMiddleware());

const controller = new Botkit({
  adapter: adapter
});

controller.webserver.get("/", (req, res) => {
  res.send(`It works! This app is running Botkit ${controller.version}.`);
});

controller.on("app_mention", async (bot, message) => {
  if (message.incoming_message.channelData.text.includes("ping")) {
    await bot.reply(message, "pong :wave:");
  } else {
    await bot.reply(message, "I received mention :+1:");
  }
});
