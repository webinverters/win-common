/**
 * Defines a list of globals which will exist in your application if you require this library.
 */
'use strict';


global._ = require('lodash');
global.p = require('bluebird');
global.path = require('path');
global.fs = require('./kernel/file-storage')();
global.assert = require('assert-plus');
global.time = require('./utils/time');
global.timer = require('performance-now');
global.moment = require('moment-timezone');