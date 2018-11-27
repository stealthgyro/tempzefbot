var fs = require('fs');
const Discord = require('discord.js');
const sql = require('sqlite');
var config = require('./config.json');
var roller = require('roller');
//const MessageHandler = require('./src/MessageHandler.js');
//const Util = require('./src/Util.js');
const client = new Discord.Client({
	autoReconnect: true
});

const prefix = '+';
var isVoiceReady = true;
sql.open('./db.sqlite');

/********Connect and perform routine maintenance.******/
client.on('ready', () => {
	//var find_afk = client.channels.find('name', String.fromCodePoint('0x231b') + 'AFK');
	console.log('[' + new Date().toISOString() + '] Connected!');

	// Set the online status.
	client.user.setStatus('online');

	// Order the channels.
	// orderChannels();
	simpleOrderChannels();

});
/********Connect and perform routine maintenance.******/


/*******Ignore DM channels and bots.*******/
client.on('message', message => {
	if (message.author.bot) return; // Ignore bots.
	if (message.channel.type === 'dm') return; // Ignore DM channels.
});
/*******Ignore DM channels and bots.*******/

/*******Dice Rolls*****/
//you can roll anywhere.
client.on("message", function(message) {
	var channel_id = message.channel.id;
	//var regexp = new RegExp("/^\\" + prefix + "roll ([1-9][0-9]*)d([1-9][0-9]*)/"); //failed to use prefix variable idea
	//var match_data = message.content.match(regexp); //failed to use prefix variable idea
	var match_data = message.content.match(/^\/roll ([1-9][0-9]*)d([1-9][0-9]*)/); //know it works with /roll

	if (match_data) {
		var n_dice = parseInt(match_data[1], 10);
		var n_sides = parseInt(match_data[2], 10);
		var inlineMsg = message.content.substring(match_data[0].length);

		if (n_dice > 10000) {
			message.reply("Unfortunately for you, computers have a limited amount of memory, so unless you want me to run out, stop sending ludicrous numbers. Thanks.");
			return;
		}

		console.log("rolling " + n_dice + "d" + n_sides + inlineMsg);
		var dice = roller.roll(n_dice, n_sides);

		var message_content = "";
		var roll_user = message.author;
		var sum;

		if (n_dice > 1) {
			sum = dice.reduce(function(prev, curr) {
				return prev + curr;
			});

			message_content = " rolled " + n_dice + " dice: " + dice.join(", ") + " (" + sum + ")" + inlineMsg;
		} else {
			message_content = " rolled " + dice[0] + inlineMsg;
		}

		if (message_content.length > 2000) {
			var sum_message = "The length of the response exceeds Discord's message length limit. However, the sum of the rolls was " + sum + inlineMsg;

			message.reply(sum_message);
			return;
		}

		message.reply(message_content);
	}
});
/*******Dice Rolls*****/


/******Add/Remove/list Groups permissions************/
//maybe a database that we can add users, or maybe justa role, I'm thinking just a role....

/******Add/Remove/list Groups permissions************/

/******Add/Remove/list Groups************/
client.on('message', message => {
	if (message.channel.name === 'bot-commands') {
		if (message.content.startsWith(prefix + "addGroup:")) {
			//console.log(message);
			var newGroupName = message.content.split(':')[1].trim();
			sql.get('SELECT * FROM groups WHERE name = ?', newGroupName).then(row => {
				if (!row) {
					sql.run('INSERT INTO groups (name) VALUES (?)', [newGroupName]);
					var msg = '';
					sql.each(`SELECT name FROM groups WHERE name IS NOT NULL ORDER BY name`, function(err, row) {
						msg += row.name + "\n";
					}).then(txt => {
						//console.log(msg);
						//console.log(txt); //apparently this is the count.
						message.reply("There are now " + txt + " room names available, listed below.\n" + msg);
					});
					//message.reply(`${newGroupName} has been added to the list`);
				} else {
					message.reply('? is already in the database', newGroupName);
				}
			});
		}

		if (message.content.startsWith(prefix + "removeGroup:")) {
			var rmGrp = message.content.split(":")[1].trim();
			sql.get('SELECT * FROM groups WHERE name = ?', rmGrp).then(row => {
				if (!row) {
					message.reply('? was not found could not remove', rmGrp);
				} else {
					sql.run('DELETE FROM groups WHERE name = ?', rmGrp);
					var msg = '';
					sql.each(`SELECT name FROM groups WHERE name IS NOT NULL ORDER BY name`, function(err, row) {
						msg += row.name + "\n";
					}).then(txt => {
						//console.log(msg);
						//console.log(txt); //apparently this is the count.
						message.reply("There are now " + txt + " room names available, listed below.\n" + msg);
					});
					//message.reply(`${rmGrp} removed`);
				}
			});
		}

		if (message.content.startsWith(prefix + "removeGroupById:")) {
			var rmGrp = message.content.split(":")[1].trim();
			sql.get('SELECT * FROM groups WHERE number = ?', rmGrp).then(row => {
				if (!row) {
					message.reply('? was not found could not remove', rmGrp);
				} else {
					sql.run('DELETE FROM groups WHERE number = ?', rmGrp);
					var msg = '';
					sql.each(`SELECT name,number FROM groups WHERE name IS NOT NULL ORDER BY number`, function(err, row) {
						msg += row.number + ". " + row.name + "\n";
					}).then(txt => {
						//console.log(msg);
						//console.log(txt); //apparently this is the count.
						message.reply("There are now " + txt + " room names available, listed below.\n" + msg);
					});
					//message.reply(`${rmGrp} removed`);
				}
			});
		}

		if (message.content.startsWith(prefix + "groupList")) {
			var msg = '';
			sql.each(`SELECT name FROM groups WHERE name IS NOT NULL ORDER BY name`, function(err, row) {
				msg += row.name + "\n";
			}).then(txt => {
				//console.log(msg);
				//console.log(txt); //apparently this is the count.
				message.reply("There are " + txt + " room names available, listed below.\n" + msg);
			});
		}

		if (message.content.startsWith(prefix + "listGroups")) {
			var msg = '';
			sql.each(`SELECT name,number FROM groups WHERE name IS NOT NULL ORDER BY number`, function(err, row) {
				msg += row.number + ". " + row.name + "\n";
			}).then(txt => {
				//console.log(msg);
				//console.log(txt); //apparently this is the count.
				message.reply("There are " + txt + " room names available, listed below.\n" + msg);
			});
		}
	}

});
/******Add/Remove/list Groups************/


/******hardcoded airhorn sound*****/
/*client.on('message', message => {
	if (message.content == "!airhorn") {
		var voiceChannel = message.member.voiceChannel;
		playSound(voiceChannel, './sounds/airhorn.wav');
	}
});*/
/******hardcoded airhorn sound*****/

/******users leaving*****/
client.on('guildMemberRemove', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'logs');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`User, ${member} has left the Discord.`);
});
/******users leaving*****/

/******hardcoded debug order check*****/
client.on('message', message => {
	if (message.channel.name === 'airhorn') {
		if (message.content == "!airhorn") {
			var voiceChannel = message.member.voiceChannel;
			playSound(voiceChannel, './sounds/airhorn.wav');
		}
		if (message.content == "!orderCheck") {
			_checking2(function(result) {
				result.forEach(function(channel) {
					console.log(channel.name + " @ " + channel.position);
				});
			});
		}
	}
});

client.on('message', message => {
	if (message.content == "!orderNow") {
		simpleOrderChannels();
		// orderChannels();
	}
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "what is my avatar"
  if (message.content === 'what is my avatar') {
    // Send the user's avatar URL
    if(message.author.avatar){
    	message.reply(message.author.avatar);
    }else{
    	message.reply("you don't have one you heathen");
    }
  }
});
/******hardcoded debug order check*****/

/********************Hardcoded sounds because Aaron really wanted it so this was quicker**********/
client.on('message', message => {
	if (message.content.startsWith("!hitme")) {
		var voiceChannel = message.member.voiceChannel;
		switch (message.author.username) {
			case "VisualIdle":
				playSound(voiceChannel, './sounds/MondayNightFootball.mp3');
				break;
			case "Gyro":
				playSound(voiceChannel, './sounds/droctagonapus.mp3');
				break;
			case "Jason Christ":
				playSound(voiceChannel, './sounds/droctagonapus.mp3');
				break;
			case "I3adI3illy":
				playSound(voiceChannel, './sounds/Nope.mp3');
				break;
			default:
				var NotCoolEnoughSounds = ['./sounds/AdditionalSupplyDepotsRequired.mp3', './sounds/MoreVespeneGas.mp3', './sounds/SpawnMoreOverlords.mp3'];
				NotCoolEnoughSounds.sort(function() {
					return 0.5 - Math.random()
				});
				var NotCoolEnough = NotCoolEnoughSounds[0];
				var voiceChannel = message.member.voiceChannel;
				playSound(voiceChannel, NotCoolEnoughSounds[0]);
		}
	}
});
/********************Hardcoded sounds because Aaron really wanted it so this was quicker*********/


/********Fighting I3illy for making sure AFK is on the bottom********/
//So because of that, there are conditions surround with how AFK works. Making this code a little more complicated then it probably needed to be, but that's what happens with fighting admins.

client.on('guildUpdate', (guildB4, guildNew) => {
	//console.log("guild update running");
	if (client.channels.find('name', String.fromCodePoint('0x231b') + 'AFK').id != guildNew.afkChannelID) { //if the AFK channel is changed via server settings doesn't equal the proper name
		guildNew.setAFKChannel(client.channels.find('name', String.fromCodePoint('0x231b') + 'AFK').id); //Set the AFK channel room as the new AFK room.
	}
});

client.on('channelUpdate', (chanB4, chanNew) => { //someone modified a channel
	if (chanNew.id == chanNew.guild.afkChannelID) { //If this channel is the AFK channel
		if (chanNew.name != String.fromCodePoint('0x231b') + "AFK") { //if someone tried to rename it...
			console.log("AFK Rename attempt");
			chanNew.setName(String.fromCodePoint('0x231b') + "AFK"); //set that shit back.
		}
		_checkLargest(function(result) {
			if (chanNew.position < result) {
				console.log("afk channel move attempt"); //log that shit
				var x = result + 100;
				chanNew.edit({
						position: x
					}).then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
					.catch(console.error);
			}
		});
	}
});

//We need spaces between channels, basically if number is below 100 let's reorganize them.
client.on('channelUpdate', (chanB4, chanNew) => { //someone modified a channel
	//console.log("chanNew.position: " + chanNew.position);
	if (chanNew.position < 100) {
		chanNew.edit({
				position: (chanNew.position + 1) * 100
			})
			.then(newChannel => {
				console.log(`Channel ${newChannel.name} new position is ${newChannel.position}`); //position...
			})
	}
});

// Reorder channels when one is created.
client.on('channelCreate', function(channel) {
	if (channel.name == String.fromCodePoint('0x231b') + "AFK") { //someone tries to confuse the bot with a new channel as the same name of the AFK
		if (channel.guild.afkChannelID != null) { //and there is already an AFK channel
			channel.edit({
					name: "Fake AFK",
					position: channel.position - 2
				})
				.then(newChannel => {
					console.log(`Channel's new name is ${newChannel.name}`); //it gets renamed to Fake AFK and we order the channels again.
					simpleOrderChannels();
					// orderChannels();
				})
				.catch(console.error);
		}
	} else if (!channel.name.startsWith(String.fromCodePoint('0x2501'))) {
		simpleOrderChannels();
		// orderChannels();
	}
});



// Reorder channels when one is deleted.
client.on('channelDelete', function(channel) {
	if (channel.name == String.fromCodePoint('0x231b') + "AFK") {
		console.log("afk channel delete attempt");
		var guildd = channel.guild;
		guildd.createChannel(String.fromCodePoint('0x231b') + 'AFK', 'voice')
			.then(channel => {
				guildd.setAFKChannel(channel);
				channel.edit({
					parent_id: channel.parentID,
					position: channel.position + 50
				})
			})
			.catch(console.error);
	} else if (!channel.name.startsWith(String.fromCodePoint('0x2501'))) {
		simpleOrderChannels();
		// orderChannels();
	}
});
/********Fighting I3illy for making sure AFK is on the bottom********/


// Trigger on VOICE_STATE_UPDATE events.
//***************Creating rooms when joining one******************/
client.on('voiceStateUpdate', (oldMember, member) => {

	// Check if the user entered a new channel.
	if (member.voiceChannelID) {
		const newChannel = member.guild.channels.get(member.voiceChannelID);
		const guildd = member.guild;

		//console.log(newChannel.bitrate);

		// If the user entered a game channel (prefixed with a game controller unicode emoji), group them into their own channel.
		//https://emojipedia.org or where I get the code i.e. video game https://emojipedia.org/video-game/ is the controller https://emojipedia.org/emoji/%F0%9F%8E%AE/ Codepoints U+1F3AE becomes String.fromCodePoint('0x1F3AE')
		if (newChannel.name.startsWith(String.fromCodePoint('0x1F3AE'))) {
			randomGroupName(function(groupName) {
				//newChannel.clone(String.fromCodePoint('0x2501') + " " + groupName, true)
				guildd.createChannel(String.fromCodePoint('0x2501') + " " + groupName, 'voice', newChannel.permissionOverwrites)
					.then(createdChannel => {
						// console.log("userLimit: " + newChannel.userLimit);
						// console.log("bitrate: " + oldMember.bitrate);
						createdChannel.edit({
								bitrate: newChannel.bitrate * 1000,
								parent_id: newChannel.parentID,
								position: newChannel.position + 1,
								user_limit: newChannel.userLimit
							})
							.then(createdChannel => {
								member.setVoiceChannel(createdChannel)
									.then(console.log('[' + new Date().toISOString() + '] Moved user "' + member.user.username + '#' + member.user.discriminator + '" (' + member.user.id + ') to ' + createdChannel.type + ' channel "' + createdChannel.name + '" (' + createdChannel.id + ') at position ' + createdChannel.position))
									.catch("A" + console.error);
							})
							.catch("B" + console.error);
					})
					.catch("C" + console.error);
			});
		}
	}

	// Check if the user came from another channel.
	if (oldMember.voiceChannelID) {
		const oldChannel = oldMember.guild.channels.get(oldMember.voiceChannelID);

		// Delete the user's now empty temporary channel, if applicable.
		if (oldChannel != undefined) {
			if (oldChannel.name.startsWith(String.fromCodePoint('0x2501')) && !oldChannel.members.array().length) {
				oldChannel.delete()
					.then(function() {
						console.log('[' + new Date().toISOString() + '] Deleted ' + oldChannel.type + ' channel "' + oldChannel.name + '" (' + oldChannel.id + ')');
					})
					.catch(console.error);
			}
		}
	}
});
//***************Creating rooms when joining one******************/


/**************************************************************FUNCTIONS********************************/


//SQL stuff learned from some experience and https://anidiots.guide/coding-guides/storing-data-in-an-sqlite-file.html
function randomGroupNameOld(callback) { //I have no reason to keep this function...other than it might be a bit easier to understand...
	sql.get(`SELECT COUNT(*) AS groupsCount FROM groups`).then(row => {
		//console.log(`There are ${row.groupsCount} groups`); //row[0].groupsCount
		var x = getRandomIntInclusive(1, row.groupsCount);
		sql.get(`SELECT * FROM groups WHERE number ='${x}'`).then(rows => {
			//console.log(`Random group name: ` + rows.name);
			var y = rows.name.toString();
			//console.log(`Random group name: ` + y);
			callback(y);
		});
	});
}

function randomGroupName(callback) {
	sql.get(`SELECT * FROM groups ORDER BY RANDOM() LIMIT 1`).then(row => {
		var y = row.name.toString();
		callback(y);
	}).catch(() => {
		console.error; //logging the error... and create a table if it isn't there.
		sql.run("CREATE TABLE IF NOT EXISTS groups (name TEXT, number INTEGER)").then(() => {
			sql.run("INSERT INTO groups (name, number) VALUES ('Group', 1)").then(row => {
				callback("Group"); //screw it.. just send back the default group name I decided on.
			});
		});
	});
}

// Function to reorder channels.
function orderChannels() { // Get a list of channels.
	var channelsOrdered = client.channels.array().slice(0);
	var afk_channel_id = [];
	// Evaluate only voice channels.
	channelsOrdered = channelsOrdered.filter(function(channel) {
		return channel.type == 'voice' && typeof channel.position !== 'undefined';
	});

	// Sort channels by their current position.
	channelsOrdered = channelsOrdered.sort(function(channelA, channelB) {
		return channelA.position - channelB.position;
	});

	afk_channel_id = channelsOrdered.filter(function(channel) {
		//var getChannel = client.channels.get(channel.id);
		return channel.id == channel.guild.afkChannelID;
	});
	afk_channel_id = afk_channel_id[0].id;
	// console.log("afk_channel_id: " + afk_channel_id);

	// Re-sort channels to support auto-grouping and 64kbps for balance of quality and bandwidth.
	var currentPosition = 100;
	channelsOrdered.forEach(function(channel) {
		console.log(channel.name + " @ " + channel.position);
	});
	channelsOrdered.forEach(function(channel) {
		currentChannel = client.channels.get(channel.id);
		if (currentChannel.name.startsWith(String.fromCodePoint('0x2501')) && !currentChannel.members.array().length) {
			const oldChannel = currentChannel;
			currentChannel.delete()
				.then(function() {
					console.log('[' + new Date().toISOString() + '] Deleted ' + oldChannel.type + ' channel "' + oldChannel.name + '" (' + oldChannel.id + ')');
				})
				.catch(console.error);
		} else {
			if (currentChannel.id != afk_channel_id) {
				currentChannel.edit({
						bitrate: currentChannel.bitrate * 1000,
						position: currentPosition
					})
					.then(editedChannel => {
						console.log('[' + new Date().toISOString() + '] Set ' + editedChannel.type + ' channel "' + editedChannel.name + '" (' + editedChannel.id + ') position to ' + editedChannel.position + ' with ' + editedChannel.bitrate + 'kbps bitrate')
					})
					.catch(console.error);
				if (currentChannel.name == String.fromCodePoint('0x231b') + "AFK") {
					currentChannel.edit({
							name: "Fake AFK",
							bitrate: currentChannel.bitrate * 1000,
							position: currentPosition
						})
						.then(editedChannel => {
							console.log('[' + new Date().toISOString() + '] Set ' + editedChannel.type + ' channel "' + editedChannel.name + '" (' + editedChannel.id + ') position to ' + editedChannel.position + ' with ' + editedChannel.bitrate + 'kbps bitrate')
						})
						.catch(console.error);
				}
				currentPosition += 100;
			}
		}
	});


	var chan_afk = client.channels.get(afk_channel_id);
	chan_afk.edit({
			bitrate: 8000,
			position: currentPosition
		})
		.then(editedChannel => {
			console.log('[' + new Date().toISOString() + '] Set ' + editedChannel.type + ' channel "' + editedChannel.name + '" (' + editedChannel.id + ') position to ' + editedChannel.position + ' with ' + editedChannel.bitrate + 'kbps bitrate')
		})
		.catch(console.error);
}

// Function to reorder channels.
function simpleOrderChannels() { // Get a list of channels.
	var channelsOrdered = client.channels.array().slice(0);
	var afk_channel_id = [];
	// Evaluate only voice channels.
	channelsOrdered = channelsOrdered.filter(function(channel) {
		return channel.type == 'voice' && typeof channel.position !== 'undefined';
	});

	// Sort channels by their current position.
	channelsOrdered = channelsOrdered.sort(function(channelA, channelB) {
		return channelA.position - channelB.position;
	});

	// Re-sort channels to support auto-grouping
	var currentPosition = 100;
	channelsOrdered.forEach(function(channel) {
		console.log(channel.name + " @ " + channel.position);
	});
	channelsOrdered.forEach(function(channel) {
		currentChannel = client.channels.get(channel.id);
		if (currentChannel.name.startsWith(String.fromCodePoint('0x2501')) && !currentChannel.members.array().length) {
			const oldChannel = currentChannel;
			currentChannel.delete()
				.then(function() {
					console.log('[' + new Date().toISOString() + '] Deleted ' + oldChannel.type + ' channel "' + oldChannel.name + '" (' + oldChannel.id + ')');
				})
				.catch(console.error);
		} else {
			currentChannel.edit({
					position: currentPosition
				})
				.then(editedChannel => {
					console.log('[' + new Date().toISOString() + '] Set ' + editedChannel.type + ' channel "' + editedChannel.name + '" (' + editedChannel.id + ') position to ' + editedChannel.position + ' with ' + editedChannel.bitrate + 'kbps bitrate')
				})
				.catch(console.error);
			currentPosition += 100;
		}
	});

}

// Function to reorder channels.
function checkChannelOrder() { // Get a list of channels.
	var channelsOrdered = client.channels.array().slice(0);
	var afk_channel_id = [];
	// Evaluate only voice channels.
	channelsOrdered = channelsOrdered.filter(function(channel) {
		return channel.type == 'voice' && typeof channel.position !== 'undefined';
	});

	// Sort channels by their current position.
	channelsOrdered = channelsOrdered.sort(function(channelA, channelB) {
		return channelA.position - channelB.position;
	});
	//console.log(channelsOrdered);
	/*for(var members in channelsOrdered){
		console.log(channelsOrdered[members].position);
	}*/

	afk_channel_id = channelsOrdered.filter(function(channel) {
		//var getChannel = client.channels.get(channel.id);
		return channel.id == channel.guild.afkChannelID;
	});
	afk_channel_id = afk_channel_id[0].id;
	//console.log('Checking Order start');
	var myChannelObj = {};
	channelsOrdered.forEach(function(channel) {
		//console.log(channel.name + " @ " + channel.position);
	});
	return channelsOrdered;
	//console.log('Checking Order end');
	//console.log("afk_channel_id: " + afk_channel_id);
}

//call back function for getting existing order
function _checking2(callback) {
	var channelsOrdered = client.channels.array().slice(0);
	var afk_channel_id = [];
	// Evaluate only voice channels.
	channelsOrdered = channelsOrdered.filter(function(channel) {
		return channel.type == 'voice' && typeof channel.position !== 'undefined';
	});

	// Sort channels by their current position.
	channelsOrdered = channelsOrdered.sort(function(channelA, channelB) {
		return channelA.position - channelB.position;
	});

	afk_channel_id = channelsOrdered.filter(function(channel) {
		//var getChannel = client.channels.get(channel.id);
		return channel.id == channel.guild.afkChannelID;
	});
	afk_channel_id = afk_channel_id[0].id;
	callback(channelsOrdered);
}

//call back function for getting largest number...
function _checkLargest(callback) {
	var channelsOrdered = client.channels.array().slice(0);
	var afk_channel_id = [];
	// Evaluate only voice channels.
	channelsOrdered = channelsOrdered.filter(function(channel) {
		return channel.type == 'voice' && typeof channel.position !== 'undefined';
	});

	// Sort channels by their current position.
	channelsOrdered = channelsOrdered.sort(function(channelA, channelB) {
		return channelA.position - channelB.position;
	});

	afk_channel_id = channelsOrdered.filter(function(channel) {
		//var getChannel = client.channels.get(channel.id);
		return channel.id == channel.guild.afkChannelID;
	});
	afk_channel_id = afk_channel_id[0].id;
	var positionArr = [];
	channelsOrdered.forEach(function(channel) {
		positionArr.push(channel.position);
	});
	callback(Math.max.apply(null, positionArr));
}

//sound playback 1
function playSound(voiceChannel, sound) {
	if (isVoiceReady && voiceChannel != undefined) {
		isVoiceReady = false;
		voiceChannel.join().then((connection) => {
			const dispatcher = connection.playFile(sound);
			dispatcher.on('end', () => {
				connection.disconnect();
				isVoiceReady = true;
			});
		}).catch((err) => {
			console.log("error occured!");
			console.log(err);
		});
	}
}

function leaveVoiceChannel(message) {
	if (client.voiceConnections.get('server', message.server)) {
		client.voiceConnections.get('server', message.server).destroy();
	}
}

//random integer
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**************************************************************FUNCTIONS********************************/

//Anonymous function to go ahead and make sure the bot is logged in.
(function init() {
	client.login(config.botToken);

})();