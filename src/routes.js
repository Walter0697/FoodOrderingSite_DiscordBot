import express from 'express'
import {
    sendToChannel,
    batchSendToUsers,
    noticeUserCompleteBill,
} from './discordBot.js'

const router = express.Router()

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

router.post('/bill_complete', (req, res, next) => {
    try {
        const { body } = req
        if (!body.restaurant) {
            throw new Error('restaurant name is required')
        }

        if (!body.uploadUsername) {
            throw new Error('users is required')
        }

        noticeUserCompleteBill(body.restaurant, body.uploadUsername)

        res.json('ok')
    } catch (err) {
        next(err)
    }
})

export default router
