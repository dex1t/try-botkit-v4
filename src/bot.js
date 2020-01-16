const { Botkit } = require("botkit");
const {
  SlackAdapter,
  SlackMessageTypeMiddleware,
  SlackEventMiddleware
} = require("botbuilder-adapter-slack");

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

controller.ready(() => {
  controller.loadModules(__dirname + "/features");
});
