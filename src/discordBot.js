import discord from 'discord.js'
import chalk from 'chalk'

import { log } from './logger.js'

const IntentsBitField = discord.IntentsBitField
const EmbedBuilder = discord.EmbedBuilder
const ActivityType = discord.ActivityType

const client = new discord.Client({
    intents: [
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

const retrieveMemberByUsername = (channel, username) => {
    for (const [snowflake, guildMember] of channel.members) {
        if (guildMember.user.bot) continue

        if (guildMember.user.username === username) {
            return guildMember
        }
    }

    return null
}

export const sendToChannel = (restaurantName, users, uploadUser) => {
    const channelId = process.env.DISCORD_CHANNEL_ID

    const channel = client.channels.cache.get(channelId)
    if (!channel) {
        log(chalk.red('Channel not found'))
        return
    }

    const userList = []
    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i]
        if (currentUser.isDiscord) {
            // if isDiscord, then the username is a discord username
            const guildMember = retrieveMemberByUsername(
                channel,
                currentUser.username
            )
            if (guildMember) {
                // if found, it will be a mention
                userList.push(guildMember.user)
            } else {
                // if not found, it will be a display name
                userList.push(currentUser.username)
            }
        } else {
            // if not, it will be a display name
            userList.push(currentUser.username)
        }
    }

    const userDisplayname = userList.join(', ')

    channel.send(
        `Hey, ${userDisplayname}, time to pay for ${restaurantName} to ${uploadUser}! Check your DMs!`
    )
}

export const batchSendToUsers = (restaurantName, users, uploadUser) => {
    const channelId = process.env.DISCORD_CHANNEL_ID
    const foodOrderUrl = process.env.FOOD_ORDER_URL

    const channel = client.channels.cache.get(channelId)
    if (!channel) {
        log(chalk.red('Channel not found'))
        return
    }

    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i]
        if (currentUser.isDiscord) {
            // if isDiscord, then the username is a discord username
            const guildMember = retrieveMemberByUsername(
                channel,
                currentUser.username
            )
            if (guildMember) {
                const generatedLink = `${foodOrderUrl}${currentUser.token}`

                // if found, it will be a mention
                const embed = new EmbedBuilder()
                    .setTitle('FOS - Food Order System')
                    .setDescription('Click this url to mark down your payment!')
                    .setColor('#00ff00')
                    .setURL(generatedLink)

                guildMember.user.send({
                    embeds: [embed],
                    content: `Hi, you should pay ${uploadUser} for bill in ${restaurantName}!`,
                })
            }
        }
    }
}

export const initializeBot = () => {
    client.on('ready', () => {
        log(chalk.blue(`Logged in as ${client.user.tag}!`))

        client.user.setActivity({
            name: 'Lunch Menu',
            type: ActivityType.Watching,
        })
    })

    client.login(process.env.DISCORD_TOKEN)
}

export default client
