var should = require('chai').should();
var Hashset = require('../hashset');
require('./object-assign-polyfill');

describe('Hashset', function() {
  var aSet;
  var sampleObject = {id: 1, prop: 'a'};
  var sampleObject2 = {id: 2, prop: 'b'};

  beforeEach(function() {
    aSet = new Hashset('id');
  });

  it('should store object values and allow to retrieve them later', function() {
    aSet.add(sampleObject);
    aSet.getValue(1).prop.should.eql('a');
  });

  it('should not add a value, whose hash is already present', function() {
    aSet.add(sampleObject);
    aSet.add({id: 1, prop: 'b'}).should.eql(false);
    aSet.getValue(1).prop.should.eql('a');
  });

  it('should allow to upsert value', function() {
    aSet.add(sampleObject);
    aSet.upsert({id: 1, prop: 'b'}).should.eql(true);
    aSet.upsert({id: 2, prop: 'c'}).should.eql(false);
    aSet.getValue(1).prop.should.eql('b');
    aSet.getValue(2).prop.should.eql('c');
    aSet.getValue(1).should.equal(sampleObject);  //should still be the same object
  });

  it('should upsert all items in an array', function(){
    aSet.add(sampleObject);
    aSet.upsertArray([{id: 1, prop: 'c'}, sampleObject2]).should.eql(2);
    aSet.getValue(1).prop.should.eql('c');
  });

  it('should throw when creating a hashset without a hashfunction', function() {
    (function() {
      new Hashset();
    }).should.throw('hashFunction is required argument');
  });

  describe('addArray', function() {
    it('should allow to add items in an array', function() {
      aSet.addArray([sampleObject, sampleObject2]).should.eql(2);
      aSet.getValue(1).should.eql(sampleObject);
    });

    it('should skip duplicates', function(){
      aSet.addArray([sampleObject, sampleObject2, sampleObject2]).should.eql(2);
      aSet.getValue(2).should.eql(sampleObject2);
    });
  });


  it('should allow to filter the items', function(){
    aSet.addArray([sampleObject, sampleObject2]);
    filteredSet = aSet.filter(function (item){
        return item.prop === 'b';
    });
    filteredSet.length.should.eql(1);
    filteredSet.getValue(2).should.eql(sampleObject2);
  });

  it("set should have has method which works for any parameter", function() {
    aSet.add({id:1});
    aSet.has({id:1}).should.eql(true);
    (aSet.has('1')).should.eql(true);
    (aSet.has(1)).should.eql(true);
  });
  
  it('should be able to clear itself', function(){
    aSet.add(sampleObject);
    aSet.clear();
    aSet.length.should.eql(0);
    should.not.exist(aSet.getValue(1));
  });

  describe('removing a value', function() {
    it('should remove by key', function() {
      aSet.add(sampleObject);
      aSet.delete(1);
      should.not.exist(aSet.getValue(1));
    });

    it('should allow to remove a value', function() {
      aSet.add(sampleObject);
      aSet.delete(sampleObject);
      should.not.exist(aSet.getValue(1));
    });
  });

  it('should iterate values with "each" method', function(){
    var ar = [];
    var from = [sampleObject, sampleObject2];
    aSet.addArray(from);
    aSet.each(function(item) {
      ar.push(item);
    });
    ar.should.eql(from);
  });
  
  it('should give all keys', function(){
    aSet.addArray([sampleObject, sampleObject2]);
    aSet.keys().should.eql(['1','2']);
  });

  it('should give all values', function(){
    var from = [sampleObject, sampleObject2];
    aSet.addArray(from);
    aSet.values().should.eql(from);
    aSet.toArray().should.eql(from);
  });
});