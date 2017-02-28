const Room = require('./game_logic/Room');
const Player = require('./game_logic/Player');

module.exports = {
    setUp: function (callback) {

        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    test1: function (test) {
        test.equals(this.foo, 'bar');
        test.done();
    }
};