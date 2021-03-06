
var bundl = require('bundl');
var bytes = require('bytes');
var consoleTable = require('console.table');
var fs = require('fs');
var utils = require('seebigs-utils');


bundl.task('compare', function (done) {
    var toTable = [];

    var finalFiles = utils.listFiles(__dirname + '/../test/jquery');
    finalFiles = finalFiles.concat(utils.listFiles(__dirname + '/../prebuilt'));

    finalFiles.forEach(function (ff) {
        var stats = fs.statSync(ff);
        toTable.push({
            bundle: ff.split('/').pop(),
            size: stats.size,
            readable: bytes(stats.size)
        });
    });

    toTable.sort(function (a, b) {
        if (a.size > b.size) {
            return 1;
        } else {
            return -1;
        }
    });

    console.log();
    console.table(toTable);
});
