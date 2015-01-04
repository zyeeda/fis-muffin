var proc      = require('child_process');
var fis       = module.exports = require('fis');
var commander = fis.cli.commander = require('commander');

fis.config.merge({
    project: {
        exclude: [/node_modules\/(?!bootstrap).*/, /node_modules\/bootstrap\/(?!dist).*/],
        watch: {
            exclude: [/src/]
        }
    },
    modules: {
        postpackager : ['autoload', 'simple'],
        parser: {
            scss: 'sass',
            sass: 'sass',
            less: 'less'
        }
    },
    settings: {
        postpackager: {
            simple: {
                autoCombine: true,
                output: 'dist/app'
            },
            autoload: {
                notice: {
                    exclude: [/_app.js/]
                }
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
            less: 'css',
            sass: 'css'
        }
    }
});

var defaultPath = [
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
        id: 'app',
        reg: '_app.js',
        release: 'dist/app.js'
    },
    {
        reg: 'node_modules/bootstrap/**',
        release: false
    },
    {
        reg: 'node_modules/**',
        release: false
    }
];

var projectPath = [];
if(fis.util.isFile(process.env.PWD + '/fis-conf.js')) {
    var projectConf = require(process.env.PWD + '/fis-conf.js');
    if(projectConf) {
        if(projectConf.roadmap && projectConf.roadmap.path) {
            projectPath = projectConf.roadmap.path;
        }
        fis.config.merge(projectConf);
    }
}

// 因为 merge 后， path 会反向，所以这么做
var path = projectPath.concat(defaultPath);
fis.config.set('roadmap.path', path);

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


