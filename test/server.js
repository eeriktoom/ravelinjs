#!/usr/bin/env node

/* jshint esversion: 9, node: true */
const url = require('url');
const express = require('express');
const cors = require('cors');
const serveIndex = require('serve-index');
const ngrok = require('ngrok');
const joqular = require('joqular');

/**
 * app returns the express application of our test server.
 */
function app() {
  const app = express();

  // Return any static files.
  app.get('*', express.static(__dirname), serveIndex(__dirname, {view: 'details'}));

  // Log any API requests and return a 204 No Content.
  var requests = [];
  app.use('/z',
    // Enable CORS, but don't support pre-flight OPTIONS requests.
    cors(),
    // Request all request bodies as text.
    express.text({type: "*/*"}),
    // Log the request.
    function logRequest(req, res, next) {
      requests.push({
        time: new Date(),
        method: req.method,
        url: req.originalUrl,
        path: req.originalUrl.match(/^.*?(?=\?)/),
        query: req.query,
        headers: req.headers,
        body: req.body,
        bodyJSON: maybeJSON(req.body),
      });
      next();
    },
    // Return a 204.
    express.Router()
      .post('/', noContent)
      .post('/err', noContent)
  );

  // Let tests read API requests received, optionally filtering by providing
  // a ?q={"url":{"$match": "/\bkey=\b/"}}
  app.get('/requests', async function logSearch(req, res) {
    const r = !req.query.q ?
      requests :
      (await joqular.query(
        JSON.parse(req.query.q),
        ...requests
      )).filter(Boolean);

    if (r.length) {
      res.send(r);
    } else {
      res.status(204).send();
    }
  });

  return app;
}

function noContent(req, res) {
  res.status(204).send();
}

function maybeJSON(b) {
  try {
    return JSON.parse(b);
  } catch(e) {}
}

/**
 * launchProxy spins up an express server behind an ngrok proxy and returns the
 * publically-accessible proxy URL. The server hosts the integration-test pages
 * and provides an API for recording and reviewing AJAX requests. This allows
 * integration tests to validate that the browser successfully made requests.
 *
 * @returns {string} The ngrok proxy address to access the server.
 */
async function launchProxy(app) {
  // Start express listening on a random port.
  var listener;
  const port = await (new Promise((resolve) => {
    listener = app.listen(0, "127.0.0.1", function() {
      // TODO: Any error handling needed here?
      resolve(listener.address().port);
    });
  }));

  // Spin up an ngrok tunnel pointing to our app.
  return ngrok.connect({
    addr: port,
    onStatusChange: function(status) {
      // Shut down the express app when ngrok is closed.
      if (status == 'closed') listener.close();
    },
  });
}

/**
 * disconnectProxy kills any servers started.
 * @param {string} [url] The URL of one server to kill. Defaults to all.
 */
async function disconnectProxy(url) {
  await ngrok.disconnect(url);
}

module.exports = { launchProxy, app, disconnectProxy };

if (require.main === module) {
  const a = app();
  if (process.argv.length <= 2) {
    // Launch behind ngrok.
    launchProxy(a).then(url => console.log('🚆 ' + url));
  } else {
    // Launch on the given port.
    const port = parseInt(process.argv[2], 10);
    if (isNaN(port)) throw new Error('invalid port');
    a.listen(port, 'localhost');
    console.log('http://localhost:' + port);
  }
}
