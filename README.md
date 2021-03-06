# hashset.js [![Build Status](https://travis-ci.org/capaj/hashset.js.svg?branch=master)](https://travis-ci.org/capaj/hashset.js)
simple hashset implementation aimed to working with DB entries on frontend. If it has primary keys, storing it in a hashset is probably a good idea.

## Installation
```
jspm i npm:hashset.js
npm i hashset.js
```

## Why not es6 Set?
Because it is not suited for working with DB objects, such as objects returned from mongoDB where primary keys are '_id' properties. It is not possible to tell the native set that two objects with the same _id are the same.

## API
With the API I tried to shadow ES6 Set, so it should feel almost as if you were working with the native Set implementation.

### Hashset
```
var hashFunction = '_id';
//or your hashFunction can be an actual function
var hashFunction = function(item){return item.a+item.b};
new Hashset(hashFunction) //returns new instance of a Hashset
```

### Methods
```
add(value) returns {boolean}
addArray(arr) returns {Number}
clear()
delete(valueOrKey) returns {boolean}
each(iteratorFunction, thisObjopt)
filter() returns {Hashset}
getValue(hash) returns {*}
has(valueOrKey) returns {boolean}
size() returns {number}
toArray() returns {Array}
upsert(value) returns {boolean}	//requires Object.assign
upsertArray(arr) returns {Number}
```

If you want upserts in the ES5 environment, [polyfill Object.assign()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)