var through = require('through2');
var rework = require('rework');
var split = require('rework-split-media');
var reworkMoveMedia = require('rework-move-media');
var stringify = require('css-stringify');
var dirname = require('path').dirname;
var pathjoin = require('path').join;
var nameFile = require('path').parse;

module.exports = function () {
    return through.obj(function (file, enc, callback) {
        var fileName = nameFile(file.path).name;
        var findCopy = /.*(_l|_m)$/;
        if(fileName !=="reset") {
        if (findCopy.exec(fileName) == null) {
            var stream = this;
            var reworkData = rework(file.contents.toString())
                .use(reworkMoveMedia());
            var stylesheets = split(reworkData);
            var stylesheetKeys = Object.keys(stylesheets);
            var contentsDef = '';
            var contentsPc = '';
            var contentsMobile = '';
            var checkMediaKeys = function (Keys) {
                var regex = /(max|min)-width:.*?(\d+.\d+)([A-z]*)/g;
                var str = Keys.toString();
                var mediaKeys = [];
                var mediaKey;
                while ((mediaKey = regex.exec(str)) !== null) {
                    mediaKeys.push(mediaKey);
                }
                var pcStyleExist = "";
                if (mediaKeys.length > 0) {
                    mediaKeys.some(function (value) {
                        var num;
                        if (value[1] === 'min') {
                            num = convertSize(value[2], value[3]);
                            if (num > 910) {
                                if (pcStyleExist === "Mob" || pcStyleExist === "Def") {
                                    pcStyleExist = "Def";
                                } else {
                                    pcStyleExist = "PC";
                                }
                            } else {
                                pcStyleExist = "DefOrMob";
                            }
                        } else if (value[1] === 'max') {
                            num = convertSize(value[2], value[3]);
                            if (num > 910) {
                                if (pcStyleExist !== "PC") {
                                    pcStyleExist = "DefOrPC";
                                }
                            } else if (num <= 910) {
                                if (pcStyleExist === "DefOrMob" || pcStyleExist === "" || pcStyleExist === "Mob") {
                                    pcStyleExist = "Mob";
                                } else {
                                    pcStyleExist = "Def";
                                }

                            }
                        }
                    });
                } else {
                    pcStyleExist = "Def";
                }
                if (pcStyleExist === "DefOrMob" || pcStyleExist === "DefOrPC") {
                    return "Def";
                } else {
                    return pcStyleExist;
                }
            };
            var convertSize = function (num, type) {
                switch (type) {
                    case 'em':
                    case 'rem':
                        return num * 16;
                    case 'px':
                    default:
                        return num;
                }
            };
            var createFile = function (fileCopy, dir, nameFile, content) {
                var poop = fileCopy.clone({
                    contents: false
                });
                poop.contents = new Buffer(content);
                poop.path = pathjoin(dir + '/' + nameFile + '.css');
                stream.push(poop);
            };
            stylesheetKeys.forEach(function (key) {
                var contents = stringify(stylesheets[key]);
                if (key) {
                    contents = '@media ' + key.toString() + '{' + contents + '}';
                    var a = checkMediaKeys(key);
                } else {
                    var a = "Def";
                }

                if (a === "PC") {
                    contentsPc += contents;
                } else if (a === "Mob") {
                    contentsMobile += contents;
                } else {
                    contentsDef += contents;
                }
            });
            createFile(file, dirname(file.path), fileName, contentsDef);
            createFile(file, dirname(file.path), fileName + '_l', contentsPc);
            createFile(file, dirname(file.path), fileName + '_m', contentsMobile);
        }
        }
        callback();
    });
};
