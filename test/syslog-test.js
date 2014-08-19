/*
 * syslog-test.js: Tests for instances of the SyslogNative transport
 *
 * (C) Vadim Geshel
 * MIT LICENSE
 *
 * Compied from winston-syslog,
 * (C) 2010 Charlie Robbins
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    winston = require('winston'),
    helpers = require('winston/test/helpers'),
    SyslogNative = require('../lib/winston-syslog-native').SyslogNative;

function assertSyslogNative (transport) {
      assert.instanceOf(transport, SyslogNative);
      assert.isFunction(transport.log);
};

var transport = new SyslogNative();

vows.describe('winston-syslog-native').addBatch({
    "An instance of the Rsyslog Transport": {
        "should have the proper methods defined": function () {
            assertSyslogNative(transport);
        },
        "the log() method": helpers.testSyslogLevels(transport, "should log messages to rsyslog", function (ign, err, logged) {
            assert.isNull(err);
            assert.isTrue(logged);
        })
    }
}).export(module);

