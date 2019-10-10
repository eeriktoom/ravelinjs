function Encrypt(o) {
  if (o) {
    this._init(o);
  }
}

Encrypt.prototype._init = function(o) {
  this.key = o.rsaKey;
};

Encrypt.prototype.encrypt = function(secret) {
  return this.key + "-" + secret;
};

module.exports = Encrypt;
