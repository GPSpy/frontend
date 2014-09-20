/// <reference path="../scripts/jquery-2.1.1.min.js" />
/// <reference path="../scripts/qunit.js" />
/// <reference path="../scripts/game.js" />



test("hello test", function () {
    ok(1 === 1, "Passed!");
});

test("check location", function () {
    var result = calculateDistance(10, 10, 20, 20);
    ok(result != 15, "passed");
});

asyncTest("register", function () {
    expect(1);
    var timeout = setTimeout(start, 10000);
    register("12345", "Dave", function (result) {
        clearTimeout(timeout);
        assert.ok(result, "Registered");
        QUnit.start();
    });
});

