require('chai').should();
var Hashset = require('../hashset');

describe('Hashset', function() {
  var aSet;
  var sampleObject = {id: 1, prop: 'a'};

  beforeEach(function() {
    aSet = new Hashset('id');
  });

  it('should store object values and allow to retrieve them later', function(){
    aSet.add(sampleObject);
    aSet.getValue(1).prop.should.eql('a');
  });

  it('should not add a value, whose hash is already present', function(){
    aSet.add(sampleObject);
    aSet.add({id:1, prop: 'b'}).should.eql(false);
    aSet.getValue(1).prop.should.eql('a');
  });

  it('should allow to upsert value', function(){
    aSet.add(sampleObject);
    aSet.upsert({id:1, prop: 'b'}).should.eql(true);
    aSet.getValue(1).prop.should.eql('b');
  });

  it('should throw when creating a hashset without a hashfunction', function(){
    (function(){
       new Hashset();
    }).should.throw('hashFunction is required argument');
  });
});