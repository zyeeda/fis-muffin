var proc   = require('child_process');
var fis       = module.exports = require('fis');
var commander = fis.cli.commander = require('commander');

fis.config.set('project.exclude', /node_modules\/(?!bootstrap).*/);
fis.config.set('project.watch.exclude', [/src/]);
fis.config.merge({
    modules: {
        postpackager : ['autoload', 'simple'],
        parser: {
            scss: 'sass',
            less: 'less'
        }
    },
    settings: {
        postpackager: {
            simple: {
                autoCombine: true,
                output: 'dist/app'
            }
        }, 
        browserify: {
            main: 'src/index.js',
            output: '_app.js',
            // transform: 'coffee-reactify',
            // extension: '.coffee'
        },
        command: {
            '': 'release -b',
            'w': 'release -bw',
            'wL': 'release -bwL',
            'op': 'release -bop',
            'opm': 'release -bopm',
            'start': 'server start',
            'stop': 'server stop',
            'open': 'server open',
            'clean': 'server clean'
        }
    },
    roadmap: {
        ext : {
            scss: 'css',
            less: 'less'
        },
        path: [
            {
                reg : /^\/assets\/(.*)\.(css|scss|sass|less)$/i,
                release : 'css/$1.css',
                id: '$1.css'
            },
            {
                reg : /^\/assets\/(.*)$/i,
                release : 'img/$1',
            },
            {
                reg : /^\/widgets\/([^\/]+)\/assets\/index\.(css|scss|sass|less)$/i,
                id : 'widgets/$1.css',
                release : 'css/$1/index.css'
            },
            {
                reg : /^\/widgets\/([^\/]+)\/assets\/(.*)$/i,
                release : 'img/$1/$2'
            },
            {
                id: 'app',
                reg: '_app.js',
                release: 'dist/app.js'
            },
            {
                reg: 'node_modules/**',
                release: false
            }
        ]
    }
});

if(fis.util.isFile(process.env.PWD + '/fis-conf.js')) {
    var projectConf = require(process.env.PWD + '/fis-conf.js');
    if(projectConf) {
        fis.config.merge(projectConf);
    }
}

fis.cli.name = 'mfn';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

function hasArgv(argv, search){
    var pos = argv.indexOf(search);
    var ret = false;
    while(pos > -1){
        argv.splice(pos, 1);
        pos = argv.indexOf(search);
        ret = true;
    }
    return ret;
}

function exeCmd(argv) {
    var cmd = fis.require('command', argv[2]);
    cmd.register(
        commander
            .command(cmd.name || argv[2])
            .usage(cmd.usage)
            .description(cmd.desc)
    );
    commander.parse(argv);
}

function convertArgs(argv) {
    var conf = fis.config.get('settings.command');
    var key = '';
    if(argv[2]) {
        key = argv[2];
    }
    if(conf[key]) {
        if(key.length > 0) {
            argv.pop();
        }
        var as = conf[key].split(' ');
        for(var i = 0; i < as.length; i++) {
            argv.splice(2 + i, 0, as[i]);
        }   
    }
    return argv;
}

function buildParams() {
    var conf = fis.config.get('settings.browserify');
    var params = '';
    if(conf.transform) {
        if(conf.transform instanceof Array) {
            for(var i = 0; i < conf.transform.length; i++) {
                params += ' -t ' + conf.transform[i];
            }
        }else {
            params += ' -t ' + conf.transform;
        }
        params += ' --extension=\"' + conf.extension + '\" ';
    }
    params += conf.main + ' -o ' + conf.output;
    return params;
}

//run cli tools
fis.cli.run = function(argv){
    if(hasArgv(argv, '--no-color')){
        fis.cli.colors.mode = 'none';
    }
    
    if(argv[2] === '-h' ||  argv[2] === '--help'){
        fis.cli.help();
    } else if(argv[2] === '-v' || argv[2] === '--version'){
        fis.cli.version();
    } else {
        argv = convertArgs(argv);
        if(argv[2] === 'release' && argv[3] && argv[3].indexOf('b') != -1) {
            argv[3] = argv[3].replace('b', '');
            var params = buildParams()
            if(argv[3].indexOf('w') !== -1) {
                proc.exec('watchify ' + params, function(a, b, error) {
                    console.error(error);
                });
                exeCmd(argv);
            }else {
                proc.exec('browserify ' + params, function(a, b, error) {
                    console.error(error);
                    exeCmd(argv);
                });
            }
        }else {
            exeCmd(argv);
        }
    }
};


