const assert = require('assert');
const sinon = require('sinon');
const Logentries = require('../src/index');
const { stream } = require('logtify')();

const { Message } = stream;

describe('Logentries subscriber ', () => {
  before(() => {
    delete process.env.LOGENTRIES_LOGGING;
    delete process.env.MIN_LOG_LEVEL;
    delete process.env.LOG_TIMESTAMP;
    delete process.env.LOG_ENVIRONMENT;
    delete process.env.LOG_LEVEL;
    delete process.env.LOG_REQID;
  });

  beforeEach(() => {
    const logentriesPackage = Logentries();
    this.LogentriesSubscriber = logentriesPackage.class;
  });

  afterEach(() => {
    delete process.env.LOGENTRIES_LOGGING;
    delete process.env.MIN_LOG_LEVEL;
    delete process.env.MIN_LOG_LEVEL_LOGENTRIES;
  });

  it('should process configs', () => {
    const logentriesPackage = Logentries();
    assert.equal(typeof logentriesPackage, 'object');
    assert.deepEqual(logentriesPackage.config, { LOGS_TOKEN: undefined });
    assert.equal(typeof logentriesPackage.class, 'function');
  });

  it('should return given configs and a constructor', () => {
    const logentriesPackage = Logentries({ LOGS_TOKEN: '00000000-0000-0000-0000-000000000000' });
    assert.equal(typeof logentriesPackage, 'object');
    assert.deepEqual(logentriesPackage.config, { LOGS_TOKEN: '00000000-0000-0000-0000-000000000000' });
    assert.equal(typeof logentriesPackage.class, 'function');
  });

  it('should not throw if no settings are given', () => {
    const logentries = new this.LogentriesSubscriber({});
    assert.equal(logentries.winston, undefined);
  });

  it('should expose its main functions', () => {
    const logentries = new this.LogentriesSubscriber({});
    assert.equal(typeof logentries, 'object');
    assert.equal(typeof logentries.isReady, 'function');
    assert.equal(typeof logentries.isEnabled, 'function');
    assert.equal(typeof logentries.handle, 'function');
  });

  it('should print out a warning if no token provided', () => {
    const spy = sinon.spy(console, 'warn');
    const logentries = new this.LogentriesSubscriber({});
    assert(spy.calledWith('Logentries logging was not initialized due to a missing token'));
    assert.equal(logentries.winston, undefined);
  });

  it('should initialize with a token', () => {
    const logentries = new this.LogentriesSubscriber({ LOGS_TOKEN: '00000000-0000-0000-0000-000000000000' });
    assert.notEqual(logentries.winston, undefined);
  });

  it('should return true/false if initialized/not initialized', () => {
    const logentries = new this.LogentriesSubscriber({});
    assert.equal(logentries.isReady(), false);
  });

  it('should indicate if it is switched on/off [settings]', () => {
    let logentries = new this.LogentriesSubscriber({ LOGENTRIES_LOGGING: true });
    assert.equal(logentries.isEnabled(), true);
    logentries = new this.LogentriesSubscriber({ LOGENTRIES_LOGGING: false });
    assert.equal(logentries.isEnabled(), false);
    logentries = new this.LogentriesSubscriber(null);
    assert.equal(logentries.isEnabled(), true);
  });

  it('should indicate if it is switched on/off [envs]', () => {
    const logentries = new this.LogentriesSubscriber(null);
    assert.equal(logentries.isEnabled(), true);
    process.env.LOGENTRIES_LOGGING = true;
    assert.equal(logentries.isEnabled(), true);
    process.env.LOGENTRIES_LOGGING = false;
    assert.equal(logentries.isEnabled(), false);
  });

  it('should indicate if it is switched on/off [envs should have more privilege]', () => {
    const logentries = new this.LogentriesSubscriber({ LOGENTRIES_LOGGING: true });
    assert.equal(logentries.isEnabled(), true);
    process.env.LOGENTRIES_LOGGING = false;
    assert.equal(logentries.isEnabled(), false);
    process.env.LOGENTRIES_LOGGING = undefined;
    assert.equal(logentries.isEnabled(), true);
  });

  it('should not break down if null is notified', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true
    });
    logentries.handle(null);
  });

  it('should log message if LOGENTRIES_LOGGING = true', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true
    });
    const spy = sinon.spy(logentries.winston.log);
    logentries.winston.log = spy;
    const message = new Message();
    logentries.handle(message);
    assert(spy.called);
  });

  it('should not log message if LOGENTRIES_LOGGING = false', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: false
    });
    const spy = sinon.spy(logentries.winston.log);
    logentries.winston.log = spy;
    const message = new Message();
    logentries.handle(message);
    assert(!spy.called);
  });

  it('should not log if message level < MIN_LOG_LEVEL [settings]', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true,
      MIN_LOG_LEVEL: 'error'
    });
    const spy = sinon.spy(logentries.winston.log);
    logentries.winston.log = spy;
    const message = new Message();
    logentries.handle(message);
    assert(!spy.called);
  });

  it('should not log if message level < MIN_LOG_LEVEL [envs]', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true
    });
    const spy = sinon.spy(logentries.winston.log);
    logentries.winston.log = spy;
    const message = new Message();
    process.env.MIN_LOG_LEVEL = 'error';
    logentries.handle(message);
    assert(!spy.called);
  });

  it('should not log if message level >= MIN_LOG_LEVEL_LOGENTRIES but < MIN_LOG_LEVEL [envs]', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true
    });
    const spy = sinon.spy(logentries.winston.log);
    logentries.winston.log = spy;
    const message = new Message('warn');
    process.env.MIN_LOG_LEVEL = 'error';
    process.env.MIN_LOG_LEVEL_LOGENTRIES = 'warn';
    logentries.handle(message);
    assert(spy.called);
  });

  it('should log if message level = MIN_LOG_LEVEL [envs]', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true
    });
    const spy = sinon.spy(logentries.winston.log);
    logentries.winston.log = spy;
    const message = new Message('error');
    process.env.MIN_LOG_LEVEL = 'error';
    logentries.handle(message);
    assert(spy.called);
  });

  it('should log if message level > MIN_LOG_LEVEL [envs]', () => {
    const logentries = new this.LogentriesSubscriber({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true
    });
    const spy = sinon.spy(logentries.winston.log);
    logentries.winston.log = spy;
    const message = new Message('error');
    process.env.MIN_LOG_LEVEL = 'warn';
    logentries.handle(message);
    assert(spy.called);
  });
});
