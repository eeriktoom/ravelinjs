import { Core } from '../core';
import { Track } from '../track';
import { Encrypt } from '../encrypt';

 /**
  * @param {object} [cfg]
  */
export default function Ravelin(cfg) {
  this.core = new Core(cfg);
  this.track = new Track(this.core, cfg);
  this.encrypt = new Encrypt(this.core, cfg);
}
