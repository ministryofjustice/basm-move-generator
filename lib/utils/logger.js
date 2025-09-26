const { format, createLogger, transports } = require('winston')

const morgan = require('morgan')
const config = require('./config')

const loggingTransports = [new transports.Console({ level: 'info' })]
const exceptionTransports = [new transports.Console({ level: 'info' })]

const logLevel = config.isProduction ? 'info' : 'debug'

const logger = createLogger({
  level: logLevel,
  format: format.simple(),
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true,
})

const noop = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
}
const console = logger

module.exports = {
  logger: {
    console,
    noop,
  },
  requestLogger: (loggingFormat = 'tiny') =>
    morgan(loggingFormat, {
      stream: { write: message => logger.info(message) },
    }),
}
