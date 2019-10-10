var proxy = require('./proxy');
var Tracker = require('./core');
var Encrypter = require('./encrypt');

function RavelinJS(o) {
  this._encrypter = new Encrypter();
  proxy(this, this._encrypter);
  this._tracker = new Tracker();
  proxy(this, this._tracker);

  if (o) {
    this.init(o);
  }
}

RavelinJS.prototype.init = function(o) {
  this._encrypter._init({rsaKey: o.rsaKey});
  this._tracker._init({apiKey: o.apiKey});
};

var ravelinjs = new RavelinJS();
ravelinjs.RavelinJS = ravelinjs;
module.exports = ravelinjs;
