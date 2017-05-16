# node-logtify-logentries
Logentries chain link for [logtify](https://github.com/dial-once/node-logtify) logger

## Installation
```
npm i -S logtify-logentries
```

## Usage
When requiring a [logtify](https://github.com/dial-once/node-logtify) module, include it's chainLink into the chain

**Variant 1** (Settings passed as global logger settings:): 
```js
const { LogentriesChainLink } = require('logtify-logentries');
const { chain, logger } = require('logtify')({
  LOGS_TOKEN: 'YOUR_LOGENTRIES_TOKEN',
  chainLinks: [ LogentriesChainLink ]
});
```

**Variant 2** (Settings passed into a chain link wrapper):
```js
const Logentries = require('logtify-logentries');
const { chain, logger } = require('logtify')({
  chainLinks: [ Logentries({ LOGS_TOKEN: 'YOUR_LOGENTRIES_TOKEN' })]
});

logger.log('error', new Error('Test error'));
logger.info('Hello world!');
```
The chainLink will make sure that a message will be sent to Logentries if:
* ``message.level >= 'MIN_LOG_LEVEL_LOGENTRIES' || 'MIN_LOG_LEVEL'``
* ``process.env.LOGENTRIES_LOGGING === 'true' || settings.LOGENTRIES_LOGGING === true``

## Configuration
**Environment variables**:
* ``process.env.LOGENTRIES_LOGGING = 'true|false'`` - Switching on / off the chain link
* ``process.env.LOGS_TOKEN = 'TOKEN'`` - your Logentries token
* ``process.env.MIN_LOG_LEVEL_LOGENTRIES = 'silly|verbose|info|warn|error'``

**Settings**:
```js
{
  LOGENTRIES_LOGGING: true|false,
  LOGS_TOKEN: 'YOUR_TOKEN',
  MIN_LOG_LEVEL_LOGENTRIES: 'silly|verbose|info|warn|error'
}
```
