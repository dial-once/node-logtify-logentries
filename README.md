# logtify-logentries

[![CircleCI](https://circleci.com/gh/dial-once/node-logtify-logentries.svg?style=svg)](https://circleci.com/gh/dial-once/node-logtify-logentries)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/gate?key=node-logtify-logentries)](http://sonar.dialonce.net/dashboard?id=node-logtify-logentries)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=node-logtify-logentries&metric=ncloc)](http://sonar.dialonce.net/dashboard?id=node-logtify-logentries)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=node-logtify-logentries&metric=coverage)](http://sonar.dialonce.net/dashboard?id=node-logtify-logentries)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=node-logtify-logentries&metric=code_smells)](http://proxy.dialonce.net/sonar/api/badges/measure?key=node-logtify-logentries&metric=coverage)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=node-logtify-logentries&metric=bugs)](http://sonar.dialonce.net/dashboard?id=node-logtify-logentries)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=node-logtify-logentries&metric=sqale_debt_ratio)](http://sonar.dialonce.net/dashboard?id=node-logtify-logentries)

Logentries subscriber for [logtify](https://github.com/dial-once/node-logtify) logger

## Installation
```
npm i -S logtify-logentries
```

## Usage
Used with [logtify](https://github.com/dial-once/node-logtify) module.

```js
require('logtify-logentries')({ LOGS_TOKEN: 'YOUR_LOGENTRIES_TOKEN' });
const { stream, logger } = require('logtify')();

logger.log('error', new Error('Test error'));
logger.info('Hello world!');
```
The subscriber will make sure that a message will be sent to Logentries if:
* ``message.level >= 'MIN_LOG_LEVEL_LOGENTRIES' || 'MIN_LOG_LEVEL'``
* ``process.env.LOGENTRIES_LOGGING !== 'false' || settings.LOGENTRIES_LOGGING !== false``

**Settings**:
Module can be configured by both env variables or config object. However, env variables have a higher priority.
```js
{
  LOGENTRIES_LOGGING: true|false,
  LOGS_TOKEN: 'YOUR_LOGENTRIES_TOKEN',
  MIN_LOG_LEVEL_LOGENTRIES: 'silly|verbose|info|warn|error',
  LOG_TIMESTAMP = 'true'
  LOG_ENVIRONMENT = 'true'
  LOG_LEVEL = 'true'
  LOG_REQID = 'true' // only included when provided with metadata
  LOG_CALLER_PREFIX = 'true' // additional prefix with info about caller module/project/function
  JSONIFY = 'true' // converts metadata to json
}
```
