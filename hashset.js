/**
 * return new instance of a Hashset
 * @param {Function|String} hashFunction
 * @constructor
 */
function Hashset(hashFunction) {
  if (hashFunction === undefined) {
    throw new TypeError('hashFunction is required argument');
  }
  if (typeof hashFunction === 'string') {
    this.hashFn = function (item) {
      if (item[hashFunction] !== undefined) {
        return item[hashFunction];
      } else {
        throw new Error('Undefined was returned by hash function on object ' + JSON.stringify(item) );
      }
    }
  } else {
    this.hashFn = hashFunction;
  }
  this.clear();
}

function makeIterator(array){
  var nextIndex = 0;

  return {
    next: function(){
      return nextIndex < array.length ?
      {value: array[nextIndex++], done: false} :
      {done: true};
    }
  }
}

Hashset.prototype = {
  /**
   * @param {Object} value
   * @returns {boolean} true when item was added
   */
  add: function add(value) {
    var r = !this.has(value);
    if (r) {
      //does not contain
      this.values[this.hashFn(value)] = value;
      this.length++;
    }
    return r;
  },
  addMany: function addMany(values) {
    values.forEach(this.add);
  },
  keys: function keys() {
    return makeIterator();
  },
  /**
   *
   * @param {Array} arr
   * @returns {Number} count of items in the set after all items in the array have been added
   */
  fromArray: function(arr) {
    var i = arr.length;
    while(i--) {
      this.add(arr[i]);
    }
    return this.length;
  },
  /**
   * set will be left empty
   */
  clear: function() {
    this.values = {};
    this.length = 0;
  },
  /**
   * @param value
   * @returns {boolean} true when item was replaced, false when just added
   */
  upsert: function addReplace(value) {
    var r = this.delete(value);
    this.add(value);
    return r;
  },
  /**
   * @param {String} hash
   * @returns {*} stored value or undefined if the hash did not found anything
   */
  getValue: function getValue(hash) {
    return this.values[hash];
  },
  /**
   * @param {*} valueOrKey either hash or an object
   * @returns {boolean} whether it removed the item
   */
  'delete': function remove(valueOrKey) {
    if (this.has(valueOrKey)) {
      // does contain
      if (typeof valueOrKey === 'object') {
        delete this.values[this.hashFn(valueOrKey)];
      } else {
        delete this.values[valueOrKey];
      }
      this.length--;
      return true;
    } else {
      return false;
    }
  },
  /**
   * @param {*} valueOrKey either hash or an object
   * @returns {boolean}
   */
  has: function has(valueOrKey) {
    if (typeof valueOrKey === 'object') {
      return this.values[this.hashFn(valueOrKey)] !== undefined;
    } else {
      return this.values[valueOrKey] !== undefined;
    }
  },
  /**
   * @returns {number}
   */
  size: function size() {
    return this.length;
  },
  /**
   * runs iteratorFunction for each value of set
   * @param {Function} iteratorFunction
   * @param {*} [thisObj] this context for iterator
   */
  each: function each(iteratorFunction, thisObj) {
    var keys = Object.keys(this.values).reverse();
    var item;
    while(item = keys.pop()) {
      var contx = thisObj || this.values[item];
      iteratorFunction.call(contx, this.values[item]);
    }
  },
  /**
   * @returns {Array}
   */
  toArray: function () {
    var r = [];
    for(var i in this.values){
      r.push(this.values[i]);
    }
    return r;
  },
  /**
   * @returns {Array} of filtered items
   */
  filter: function() {
    var arr =  this.toArray();
    return arr.filter.apply(arr, arguments);
  }
};

module.exports = Hashset;