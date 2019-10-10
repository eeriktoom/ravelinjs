function Tracker(o) {
  if (o) {
    this._init(o);
  }
}

Tracker.prototype._init = function(o) {
  this.key = o.apiKey;
};

Tracker.prototype.track = function(ev, d) {
  return {
    key: this.key,
    ev: ev,
    d: d
  };
};

Tracker.prototype.setPublicAPIKey = function(key) {
  this.key = key;
};

module.exports = Tracker;
