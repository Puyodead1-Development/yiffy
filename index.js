// Yiffy bot by Puyodead1 for The Church of Pyrocynical
const Discord = require('discord.js')
const fs = require('fs')
let yiffs = require('./yiff.json')
const config = require('./config')
const status = require('./config.json')
const client = new Discord.Client()

let yiffy = []
let last = 0
let enabled = true

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  let channel = client.guilds
    .get(config.LOG_SERVER)
    .channels.get(config.LOG_CHANNEL)
  yiffy = yiffs
  client.user.setActivity('with Yiffs!', { type: 'PLAYING' })
  console.log(`Enabled: ${status.ENABLED}`)
})

client.on('message', msg => {
  if (msg.channel.id !== config.LOG_CHANNEL) return
  if (msg.author.bot) return
  if (msg.content.toLowerCase() === 'y!toggle') {
    if (status.ENABLED) {
      status.ENABLED = false
      enabled = false
    } else {
      status.ENABLED = true
      enabled = true
    }
    fs.writeFile('./config.json', JSON.stringify(status), function (err) {
      if (err) return console.log(err)
    })
    return msg.channel.send('Yiffy bot is now set to: ' + enabled)
  }
  if (status.ENABLED) {
    if (msg.content.toLowerCase() === 'y!yiff') {
      if (yiffs.length === 0) {
        let embed = new Discord.RichEmbed()
          .setTitle('Image Locked!')
          .setImage(
            'https://preview.redd.it/rzc3cif12kby.png?width=960&crop=smart&auto=webp&s=6ff26c02f17cd959955b3d0695691d6a95e1dbdb'
          )
          .setFooter('Psych! Theres just no pics yet!')
        return msg.channel.send(embed)
      } else {
        var randomNumber = Math.floor(Math.random() * yiffy.length)
        if (randomNumber === last) {
          randomNumber = Math.floor(Math.random() * yiffy.length)
        }
        let embed = new Discord.RichEmbed()
          .setAuthor('Yiffy')
          .addField('Image Number', randomNumber)
          .setImage(yiffy[randomNumber])
        msg.channel.send(embed)
        last = randomNumber
      }
    }
  }
  if (msg.content.startsWith('y!addyiff')) {
    const args = msg.content
      .slice('y!addyiff'.length)
      .trim()
      .split(/ +/g)
    if (args[0]) {
      if (
        args[0].endsWith('.jpg') ||
        args[0].endsWith('.png') ||
        args[0].endsWith('.jpeg')
      ) {
        msg.delete()
        if (args[0]) {
          yiffy.push(args[0])
          fs.writeFile('yiff.json', JSON.stringify(yiffy), function (err) {
            if (err) throw err
          })
          return msg.channel.send(`Added <${args[0]}>`).then(mssg => {
            mssg.delete(5000)
          })
        }
      } else {
        return msg.channel.send(
          'Link must be a direct link to the image, ending in .png or .jpg/.jpeg!'
        )
      }
    } else {
      return msg.channel.send(
        'Link must be a direct link to the image, ending in .png or .jpg/.jpeg!'
      )
    }
  }
})

client.login(config.TOKEN)
