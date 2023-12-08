import dayjs from 'dayjs'
import chalk from 'chalk'

export const log = (message) => {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log(`${chalk.green(`[${now}]`)} ${message}`)
}
