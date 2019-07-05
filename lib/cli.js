#!/usr/bin/env node
'use strict';

//TODO: everything
//TODO: glob for source file patterns

//console.dir(argv);

const csdl = require('./xml2json');
var minimist = require('minimist');
var fs = require('fs');

var unknown = false;

var argv = minimist(process.argv.slice(2), {
    string: ["t", "target"],
    boolean: ["h", "help", "p", "pretty"],
    alias: {
        h: "help",
        p: "pretty",
        t: "target"
    },
    default: {
        pretty: false
    },
    unknown: (arg) => {
        if (arg.substring(0, 1) == '-') {
            console.error('Unknown option: ' + arg);
            unknown = true;
            return false;
        }
    }
});

if (unknown || argv._.length == 0 || argv.h) {
    console.log(`Usage: odata-csdl-xml2json <options> <source files>
Options:
 -h, --help              show this info
 -p, --pretty            pretty-print JSON result
 -t, --target            target file (only useful with a single source file)`);
} else {
    for (var i = 0; i < argv._.length; i++) {
        convert(argv._[i]);
    }
}

function convert(source) {
    if (!fs.existsSync(source)) {
        console.error('Source file not found: ' + source);
        return;
    }

    const json = csdl.xml2json(fs.readFileSync(source));
    if (json == null) {
        return;
    }

    const target = argv.t || source.substring(0, source.lastIndexOf('.')) + '.json';

    console.log(target);

    fs.writeFileSync(target, JSON.stringify(json, null, argv.pretty ? 4 : 0));
}