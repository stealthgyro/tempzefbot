Update the config.json with your bot key... Some of the config.json options are just there for future-state.

A lot of my channel grouping work was based of CritCola's bot, and when I last checked their discord it was still broken so yeah at least their code is better formatted than mine, https://github.com/critcola/discord-auto-grouping

Sounds have been hardcoded, howeever if I ever get around to I want to implement something like the following https://github.com/markokajzer/discord-soundbot where you can dynamically add/remove sounds... or just do multple bots, but I tend to like doing things myself to learn more....

My parent and userLimit were set wrong, I've corrcted this in zef-discord-bot.js, also restored the updateChannel function node_modules/discord.js/src/client/rest/RESTMethods.js

createChannel hase an issue with permissions when it comes to 11.4.2, but grabbing a 11.4-dev seemed to fix all my issues.


This bot is not designed for multiple server AT ALL!

