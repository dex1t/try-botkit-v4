import { Botkit } from "botkit";
import {
  SlackAdapter,
  SlackEventMiddleware,
  SlackMessageTypeMiddleware
} from "botbuilder-adapter-slack";

const adapter = new SlackAdapter({
  clientSigningSecret: process.env.SLACK_CLIENT_SIGNING_SECRET,
  botToken: process.env.SLACK_BOT_OAUTH_TOKEN,
  redirectUri: ""
});
adapter.use(new SlackEventMiddleware());
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
  adapter: adapter
});

let memory = null; // TODO: make persistent to Redis or Mongo

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

controller.on("slash_command", async (bot, message) => {
  console.log(message);

  if (message.command == "/whisperbot-subscribe") {
    console.log(message.reference);
    memory = message.reference;
    // @ts-ignore there is implementation, but no types
    await bot.replyPrivate(
      message,
      `OK :+1: I'm subscribing \`${message.text}\` on Intercom.`
    );
  }
});

controller.webserver.get("/intercom", async (req, res) => {
  if (memory) {
    const bot2 = await controller.spawn(memory.conversation.id);
    // @ts-ignore there is implementation, but no types
    await bot2.startConversationInChannel(memory.conversation.id, memory.user);
    await bot2.say("got webhook");
  }
  res.send({});
});
