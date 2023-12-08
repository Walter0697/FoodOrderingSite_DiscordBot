import express from 'express'
import discordClient, { sendToChannel, batchSendToUsers } from './discordBot.js'

const router = express.Router()

// should recieve restaurant name
// array of people with username and link for payment
// displayname of the person who uploaded the bill (don't tag)

router.post('/bill_uploaded', (req, res, next) => {
    try {
        const { body } = req
        if (!body.restaurant) {
            throw new Error('restaurant name is required')
        }

        if (!body.users) {
            throw new Error('users is required')
        }

        if (!body.uploadUser) {
            throw new Error('uploadUser is required')
        }

        sendToChannel(body.restaurant, body.users, body.uploadUser)
        batchSendToUsers(body.restaurant, body.users, body.uploadUser)

        res.json('ok')
    } catch (err) {
        next(err)
    }
})

export default router
