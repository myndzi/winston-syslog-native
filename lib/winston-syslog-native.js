'use strict';

var util = require('util'),
    winston = require('winston'),
    Syslog = require('node-syslog');

var levels = {
    debug:   Syslog.LOG_DEBUG, 
    info:    Syslog.LOG_INFO, 
    notice:  Syslog.LOG_NOTICE, 
    warning: Syslog.LOG_WARNING,
    error:   Syslog.LOG_ERR, 
    crit:    Syslog.LOG_CRIT,
    alert:   Syslog.LOG_ALERT,
    emerg:   Syslog.LOG_EMERG
};

var SyslogNative = exports.SyslogNative = winston.transports.SyslogNative = function (options) {
    winston.Transport.call(this, options);
    
    options = options || {};

    this.name = options.name || process.title;
    this.flags = options.flags ? options.flags : Syslog.LOG_ODELAY;
    this.facility = options.facility ? options.facility : Syslog.LOG_LOCAL0;

    Syslog.init(this.name, this.flags, this.facility);
};

// exports levels so it can be modified
SyslogNative.levels = levels;

// export constants from Syslog module
Object.keys(Syslog).forEach(function (key) {
    if (!/[a-z]/.test(key)) {
        SyslogNative[key] = Syslog[key];
    }
});

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(SyslogNative, winston.Transport);

SyslogNative.prototype.log = function (level, msg, meta, callback) {
    var syslogLevel = parseInt(levels[level]);
    
    if (isNaN(syslogLevel)) { syslogLevel = Syslog.DEBUG; }
    
    
    if (meta && typeof meta !== 'string') {
        try {
            msg += '; ' + JSON.stringify(meta);
        } catch (e) { }
    }

    try {
        Syslog.log(syslogLevel, msg);
        callback(null, true);
    } catch (e) {
        callback(e);
    }
};

process.on('exit', function () {
    try {
        Syslog.close();
    } catch (e) {
        // presumably Syslog hasn't been initialized
    }
});
