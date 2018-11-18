//Yiffy bot by Puyodead1 for The Church of Pyrocynical
const Discord = require("discord.js");
const fs = require("fs");
let yiffs = require("./yiff.json");
const config = require("./config.json");
const client = new Discord.Client();

let yiffy = [];
let last = 0;
let enabled = true;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds
    .get("473908597470920714")
    .channels.get("501981063015301130")
    .setTopic("Ready!");
  client.guilds
    .get("473908597470920714")
    .channels.get("501981063015301130")
    .send("System Ready!");
  yiffy = yiffs;
  client.user.setActivity("with Yiffs!", { type: "PLAYING" });
});

client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.content.toLowerCase() === "toggle") {
    if (config.enabled) {
      config.enabled = false;
      enabled = false;
    } else {
      config.enabled = true;
      enabled = true;
    }
    fs.writeFile("./config.json", JSON.stringify(config), function(err) {
      if (err) return console.log(err);
    });
    return msg.channel.send("Yiffy bot is now set to: " + enabled);
  }
  if (config.enabled) {
    if (yiffy.length === 0) {
      let embed = new Discord.RichEmbed()
        .setTitle("Image Locked!")
        .setImage(
          "https://preview.redd.it/rzc3cif12kby.png?width=960&crop=smart&auto=webp&s=6ff26c02f17cd959955b3d0695691d6a95e1dbdb"
        )
        .setFooter("Psych! Theres just no pics yet!");
      return msg.channel.send(embed);
    }
    var randomNumber = Math.floor(Math.random() * yiffy.length);
    if (randomNumber === last) {
      randomNumber = Math.floor(Math.random() * yiffy.length);
    }
    let embed = new Discord.RichEmbed()
      .setAuthor("Yiffy")
      .addField("Image Number", randomNumber)
      .setImage(yiffy[randomNumber]);
    msg.channel.send(embed);
    last = randomNumber;
  }
  if (msg.content.startsWith("addyiff")) {
    const args = msg.content
      .slice("addyiff".length)
      .trim()
      .split(/ +/g);
    if (args[0]) {
      if (
        args[0].endsWith(".jpg") ||
        args[0].endsWith(".png") ||
        args[0].endsWith(".jpeg")
      ) {
        msg.delete();
        if (args[0]) {
          yiffy.push(args[0]);
          fs.writeFile("yiff.json", JSON.stringify(yiffy), function(err) {
            if (err) throw err;
          });
          return msg.channel.send(`Added "${args[0]}"`).then(mssg => {
            mssg.delete(5000);
          });
        }
      } else {
        return msg.channel.send(
          "Link must be a direct link to the image, ending in .png or .jpg/.jpeg!"
        );
      }
    } else {
      return msg.channel.send(
        "Link must be a direct link to the image, ending in .png or .jpg/.jpeg!"
      );
    }
  }
});

client.login(config.token);
