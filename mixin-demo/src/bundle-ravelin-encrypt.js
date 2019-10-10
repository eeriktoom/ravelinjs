var proxy = require('./proxy');
var Encrypter = require('./encrypt');

function RavelinJS(o) {
  this._encrypter = new Encrypter();
  proxy(this, this._encrypter);

  if (o) {
    this.init(o);
  }
}

RavelinJS.prototype.init = function(o) {
  this._encrypter._init({rsaKey: o.rsaKey});
};

var ravelinjs = new RavelinJS();
ravelinjs.RavelinJS = ravelinjs;
module.exports = ravelinjs;
