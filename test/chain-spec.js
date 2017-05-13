const logtify = require('logtify');
const sinon = require('sinon');
const assert = require('assert');
const Logentries = require('../src/index');

describe('Logentries inside chain', () => {
  it('should be able to insert into a chain without a conflict [manual push] [no token] [switched off]', () => {
    const { chain, logger } = logtify({});
    const LogentriesLinkClass = Logentries().class;
    const logentriesChainLink = new LogentriesLinkClass({}, new chain.Utility());
    assert.equal(logentriesChainLink.winston, undefined);
    const spy = sinon.spy(logentriesChainLink, 'handle');
    const index = chain.push(logentriesChainLink);
    assert.equal(index, chain.chainLinks.length - 1);
    chain.link();
    logger.info('Hello world');
    assert(spy.called);
  });

  it('should be able to insert into a chain without a conflict [manual push] [with token] [switched off]', () => {
    const { chain } = logtify({});
    const logentriesPackage = Logentries({ LOGS_TOKEN: '00000000-0000-0000-0000-000000000000' });
    const logentriesLinkConfig = logentriesPackage.config;
    const LogentriesLinkClass = logentriesPackage.class;
    const logentriesChainLink = new LogentriesLinkClass(logentriesLinkConfig, new chain.Utility());
    assert.notEqual(logentriesChainLink.winston, undefined);
    const spy = sinon.spy(logentriesChainLink, 'handle');
    const index = chain.push(logentriesChainLink);
    assert.equal(index, chain.chainLinks.length - 1);
    chain.link();
    chain.log(null, 'Hello world');
    assert(spy.called);
  });

  it('should be able to insert into a chain without a conflict [manual push] [with token] [switched on]', () => {
    const { chain } = logtify({});
    const logentriesPackage = Logentries({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true
    });
    const logentriesLinkConfig = logentriesPackage.config;
    const LogentriesLinkClass = logentriesPackage.class;
    const logentriesChainLink = new LogentriesLinkClass(logentriesLinkConfig, new chain.Utility());
    assert.notEqual(logentriesChainLink.winston, undefined);
    const spy = sinon.spy(logentriesChainLink, 'handle');
    const index = chain.push(logentriesChainLink);
    assert.equal(index, chain.chainLinks.length - 1);
    chain.link();
    chain.log(null, 'Hello world');
    assert(spy.called);
  });

  it('should be able to insert into a chain without a conflict [auto push v2] [with token] [switched on]', () => {
    const { chain } = logtify({
      chainLinks: [
        Logentries({
          LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
          LOGENTRIES_LOGGING: true
        })
      ]
    });
    assert.equal(chain.chainLinks.length, 2);
    const logentriesChainLink = chain.chainEnd;
    assert.notEqual(logentriesChainLink.winston, undefined);
    const spy = sinon.spy(logentriesChainLink, 'handle');
    chain.log(null, 'Hello world');
    assert(spy.called);
  });

  it('should be able to insert into a chain without a conflict [auto push v1] [with token] [switched on]', () => {
    const { chain } = logtify({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true,
      chainLinks: [Logentries().class]
    });
    assert.equal(chain.chainLinks.length, 2);
    const logentriesChainLink = chain.chainEnd;
    assert.notEqual(logentriesChainLink.winston, undefined);
    const spy = sinon.spy(logentriesChainLink, 'handle');
    chain.log(null, 'Hello world');
    assert(spy.called);
  });

  it('should be able to insert into a chain without a conflict [auto push v1] [with token] [switched on]', () => {
    const { chain } = logtify({
      LOGS_TOKEN: '00000000-0000-0000-0000-000000000000',
      LOGENTRIES_LOGGING: true,
      chainLinks: [Logentries.LogentriesChainLink]
    });
    assert.equal(chain.chainLinks.length, 2);
    const logentriesChainLink = chain.chainEnd;
    assert.notEqual(logentriesChainLink.winston, undefined);
    const spy = sinon.spy(logentriesChainLink, 'handle');
    chain.log(null, 'Hello world');
    assert(spy.called);
  });
});
