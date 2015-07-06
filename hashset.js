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

Hashset.prototype = {
  /**
   * @param {Object} value
   * @returns {boolean} true when item was added
   */
  add: function add(value) {
    var r = !this.has(value);
    if (r) {
      //does not contain
      this._hashObject[this.hashFn(value)] = value;
      this.length++;
    }
    return r;
  },
  keys: function keys() {
    return Object.keys(this._hashObject);
  },
  /**
   *
   * @param {Array} arr
   * @returns {Number} count of items in the set after all items in the array have been added
   */
  addMany: function(arr) {
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
    this._hashObject = {};
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
    return this._hashObject[hash];
  },
  /**
   * @param {*} valueOrKey either hash or an object
   * @returns {boolean} whether it removed the item
   */
  'delete': function remove(valueOrKey) {
    if (this.has(valueOrKey)) {
      // does contain
      if (typeof valueOrKey === 'object') {
        delete this._hashObject[this.hashFn(valueOrKey)];
      } else {
        delete this._hashObject[valueOrKey];
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
      return this._hashObject[this.hashFn(valueOrKey)] !== undefined;
    } else {
      return this._hashObject[valueOrKey] !== undefined;
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
    var keys = Object.keys(this._hashObject).reverse();
    var item;
    while(item = keys.pop()) {
      var contx = thisObj || this._hashObject[item];
      iteratorFunction.call(contx, this._hashObject[item]);
    }
  },
  /**
   * @returns {Array}
   */
  toArray: function () {
    var r = [];
    for(var i in this._hashObject){
      r.push(this._hashObject[i]);
    }
    return r;
  },
  /**
   * @returns {Hashset} of filtered items
   */
  filter: function(predicate) {
    var result = new Hashset(this.hashFn);
    this.each(function(item) {
      if (predicate(item)) {
        result.add(item);
      }
    });
    return result;
  }
};
Hashset.prototype.values = Hashset.prototype.toArray; //alias

module.exports = Hashset;