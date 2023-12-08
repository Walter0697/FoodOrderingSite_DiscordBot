import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import chalk from 'chalk'
import morgan from 'morgan'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
import { log } from './logger.js'
import { initializeBot } from './discordBot.js'
import router from './routes.js'

dotenv.config()
initializeBot()

const app = express()
const port = process.env.PORT || 6000

const corsOptions = {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
    morgan(function (tokens, req, res) {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
        return `${chalk.green(
            `[${now}]`
        )} ${chalk.white.bgBlue(tokens.method(req, res))} | ${chalk.white.bgGreen(tokens.status(req, res))} : ${chalk.green(tokens.url(req, res))} (Respond Time: ${chalk.yellow(tokens['response-time'](req, res))})`
    })
)

app.use('/api', router)

app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

app.use((err, req, res, next) => {
    const errorData = {
        name: err.name,
        message: err.message,
        stack: err.stack,
    }

    log(chalk.red.bgYellowBright('ErrorMessage: ', err.stack))
    res.status(500).json(errorData)
})

app.listen(port, () => {
    log(chalk.yellow(`Server is running at http://localhost:${port}`))
})
