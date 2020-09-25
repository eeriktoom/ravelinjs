const log = require('@wdio/logger').default('send.spec');
const { expectRequest } = require('../server');
const buildURL = require('build-url');

describe('ravelinjs.core.send', function() {
  it('sends to paths', function() {
    // http://test.browserstack.com/send/ -> /z/err
    return test('/', '/', 'path');
  });

  it('sends to samesite URLs', function() {
    // http://test.browserstack.com/send/ -> http://test.browserstack.com/z/err/
    return test('/', process.env.TEST_LOCAL, 'samesite');
  });

  it('sends to remote URLs', function() {
    // http://test.browserstack.com/send/ -> http://test.ngrok.io/z/err
    return test('/', process.env.TEST_REMOTE.replace(/^https:/, 'http:'), 'remote');
  });
});

function test(page, api, msg) {
  const key = browser.sessionId;

  // Visit `${page}/send/?api=${api}&key=${key}&msg=${msg}`.
  browser.url(buildURL(page, {path: '/send/', queryParams: {api, key, msg}}));
  expect(browser).toHaveUrlContaining(key);
  expect(browser).toHaveTitleContaining('send');

  // Wait for the browser to finish reporting the error message.
  browser.waitUntil(function() {
    return !!$('#completed');
  });

  // Check whether the browser reported any errors.
  const e = $('#error').getText();
  if (e) throw new Error(e);

  // Warn if it took several attempts to send.
  browser.waitUntil(function() {
    const r = JSON.parse($('#output').getText());
    log.debug('result', r);
    if (r.attempts > 1) {
      log.warn(`Succeeded after ${r.attempts-1} failures:`, r.failures);
    }
  });

  // Confirm that an AJAX request with the error was received.
  return expectRequest(process.env.TEST_INTERNAL, {
    'path': {'$eq': '/z/err'},
    'query': {'key': {'$eq': key}},
    'bodyJSON': {'msg': {'$eq': msg}},
  });
}
