Update the config.json with your bot key... Some of the config.json options are just there for future-state.

A lot of my channel grouping work was based of CritCola's bot, and when I last checked their discord it was still broken so yeah at least their code is better formatted than mine, https://github.com/critcola/discord-auto-grouping

Sounds have been hardcoded, howeever if I ever get around to I want to implement something like the following https://github.com/markokajzer/discord-soundbot where you can dynamically add/remove sounds... or just do multple bots, but I tend to like doing things myself to learn more....

My parent and userLimit were set wrong, I've corrcted this in zef-discord-bot.js, also restored the updateChannel function node_modules/discord.js/src/client/rest/RESTMethods.js

Something not in that is I updated the createChannel method as well
permission_overwrites: overwrites,
since I'm passing that directly, not really sure why it was trying to pull some other method.

This is bascially to actually be aware of the parent category of a channel.


This bot is not designed for multiple server AT ALL!

