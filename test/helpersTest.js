const { assert } = require('chai');

const { userAuth } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('userAuth', function() {
  it('should return a user with valid email', function() {
    const user = userAuth("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
    
  });

  it('if a non-existent email, should  returns undefined. ', function() {
    const user = userAuth("user3@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
    
  });

});



