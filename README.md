# logtify-logentries
[![CircleCI](https://circleci.com/gh/dial-once/node-logtify-logentries.svg?style=svg)](https://circleci.com/gh/dial-once/node-logtify-logentries)

Logentries chain link for [logtify](https://github.com/dial-once/node-logtify) logger

## Installation
```
npm i -S logtify-logentries
```

## Usage
Used with [logtify](https://github.com/dial-once/node-logtify) module.

```js
require('logtify-logentries')({ LOGS_TOKEN: 'YOUR_LOGENTRIES_TOKEN' });
const { chain, logger } = require('logtify')();

logger.log('error', new Error('Test error'));
logger.info('Hello world!');
```
The chainLink will make sure that a message will be sent to Logentries if:
* ``message.level >= 'MIN_LOG_LEVEL_LOGENTRIES' || 'MIN_LOG_LEVEL'``
* ``process.env.LOGENTRIES_LOGGING !== 'false' || settings.LOGENTRIES_LOGGING !== false``

## Configuration
**Environment variables**:
* ``process.env.LOGENTRIES_LOGGING = 'true|false'`` - Switching on / off the chain link. On by default
* ``process.env.LOGS_TOKEN = 'TOKEN'`` - your Logentries token
* ``process.env.MIN_LOG_LEVEL_LOGENTRIES = 'silly|verbose|info|warn|error'``

**Settings**:
```js
{
  LOGENTRIES_LOGGING: true|false,
  LOGS_TOKEN: 'YOUR_LOGENTRIES_TOKEN',
  MIN_LOG_LEVEL_LOGENTRIES: 'silly|verbose|info|warn|error'
}
```
