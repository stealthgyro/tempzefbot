Update the config.json with your bot key... Some of the config.json options are just there for future-state.

A lot of my channel grouping work was based of CritCola's bot, and when I last checked their discord it was still broken so yeah at least their code is better formatted than mine, https://github.com/critcola/discord-auto-grouping

Sounds have been hardcoded, howeever if I ever get around to I want to implement something like the following https://github.com/markokajzer/discord-soundbot where you can dynamically add/remove sounds... or just do multple bots, but I tend to like doing things myself to learn more....

Very very very important, I customozied DiscordJS 11.1.0 because I wanted it to support categories and how they were doing it was not working well not to mention a whole host of issues, instead of waiting on them I made changes. so your node_modules can be pulled via npm pull or something along those lines, it would be a good idea to use my version especially when it comes to moving rooms around.

More specifically I modified the following files
node_modules/discord.js/src/client/rest/RESTMethods.js - https://i.imgur.com/6DSWKoT.png
node_modules/discord.js/src/structures/GuildChannel.js - https://i.imgur.com/ZarWcmO.png



This bot might function if connected to multiple servers, but nothing has been designed with that in mind.

