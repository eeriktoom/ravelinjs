import { Core } from '../core';
import { Track } from '../track';
import { Encrypt } from '../encrypt';

 /**
  * @param {object} [cfg]
  */
function RavelinJS(cfg) {
  this.core = new Core();
  this.track = new Track(this.core);
  this.encrypt = new Encrypt(this.core);

  if (cfg) this.init(cfg);
}

RavelinJS.prototype.init = function(cfg) {
  this.core.init(cfg);
  this.track.init(cfg);
  this.encrypt.init(cfg);
}

export default new RavelinJS();
