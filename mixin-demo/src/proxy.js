function proxy(front, back) {
  for (var prop in back) {
    if (prop.charAt(0) === '_') {
      continue;
    }
    if (prop in front) {
      throw 'Front already has property ' + prop;
    }
    front[prop] = bind(back, back[prop]);
  }
}

function bind(obj, fn) {
  return function proxy() {
    return fn.apply(obj, arguments);
  };
}

module.exports = proxy;
