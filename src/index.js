require('le_node');
const winston = require('winston');
const logtify = require('logtify');

const streamBuffer = logtify.streamBuffer;
const { stream } = logtify();

/**
  @class Logentries
  A Logentries logger subscriber

  Has the following configurations (either env var or settings param):
  - LOGENTRIES_LOGGING {'true'|'false'} - switches on / off the use of this subscriber
  - MIN_LOG_LEVEL_LOGENTRIES = {'silly'|'verbose'|'debug'|'info'|'warn'|'error'} - min log level of a message to log
  This config has a higher priority than a global DEFAULT_LOG_LEVEl config
  @see Subscriber @class for info on the log level priorities
  If a message's level is >= than a MIN_LOG_LEVEL_CONSOLE - it will be notified. Otherwise - skipped

  Environment variables have a higher priority over a settings object parameters
**/
class Logentries extends stream.Subscriber {
  /**
    @constructor
    Construct an instance of a Logentries @class
    @param configs {Object} - LoggerStream configuration object
    @param utility {Object} - Logtify common rules object
  **/
  constructor(configs) {
    super();
    this.settings = configs || {};
    this.name = 'LOGENTRIES';
    if (this.settings.LOGS_TOKEN) {
      this.token = this.settings.LOGS_TOKEN;
      this.winston = new winston.Logger();
      this.loggers = {
        [this.token]: this.winston.add(winston.transports.Logentries, { token: this.token })
      };
    } else {
      console.warn('Logentries logging was not initialized due to a missing token');
    }
  }

  /**
    @function isReady
    Check if a subscriber is configured properly and is ready to be used
    @return {boolean}
  **/
  isReady() {
    return !!this.winston;
  }

  /**
    @function isEnabled
    Check if a subscriber will be used
    Depends on configuration env variables / settings object parameters
    Checks LOGENTRIES_LOGGING env / settings object param
    @return {boolean} - if this subscriber is switched on / off
  **/
  isEnabled() {
    const result = ['true', 'false'].includes(process.env.LOGENTRIES_LOGGING) ?
      process.env.LOGENTRIES_LOGGING === 'true' : this.settings.LOGENTRIES_LOGGING;
    return [null, undefined].includes(result) ? true : result;
  }

  /**
    @function handle
    Process a message and log it if the subscriber is switched on and message's log level is >= than MIN_LOG_LEVEL
    Finally, pass the message to the next subscriber if any
    @param message {Object} - message package object
    @see LoggerStream message package object structure description
  **/
  handle(message) {
    if (this.isReady() && this.isEnabled() && message) {
      const content = message.payload;
      const messageLevel = this.logLevels.has(content.level) ? content.level : this.logLevels.get('default');
      const minLogLevel = this.getMinLogLevel(this.settings, this.name);
      if (this.logLevels.get(messageLevel) >= this.logLevels.get(minLogLevel)) {
        const prefix = message.getPrefix(this.settings);
        const messageText = !prefix.isEmpty ?
          `[${prefix.timestamp}${prefix.environment}${prefix.logLevel}${prefix.reqId}]${content.text}` :
          content.text;
        this.winston.log(messageLevel, messageText, content.meta);
      }
    }
  }
}

/**
  @param config {Object} - subscriber configuration
  @return { object } - subscriber object with a class
**/
module.exports = (config) => {
  const configs = Object.assign({
    LOGS_TOKEN: process.env.LOGS_TOKEN || process.env.LOGENTRIES_TOKEN
  }, config);
  const streamLinkData = {
    class: Logentries,
    config: configs
  };

  streamBuffer.addSubscriber(streamLinkData);
  const mergedConfigs = Object.assign({}, configs, stream.settings);
  stream.subscribe(new Logentries(mergedConfigs));

  return streamLinkData;
};

module.exports.LogentriesSubscriber = Logentries;
