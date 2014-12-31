var process = require('child_process');
var fis     = module.exports = require('fis');

fis.cli.name = 'mfn';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.set('project.exclude', /node_modules\/(?!bootstrap).*/);
fis.config.set('project.watch.exclude', [/modules/]);

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
    var commander = fis.cli.commander = require('commander');
        
    var cmd = fis.require('command', argv[2]);
    cmd.register(
        commander
            .command(cmd.name || argv[2])
            .usage(cmd.usage)
            .description(cmd.desc)
    );
    commander.parse(argv);
}

function buildParams() {
    var conf = fis.config.get('settings.postpackager.browserify');
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
    
    var first = argv[2];
    if(argv.length < 3 || first === '-h' ||  first === '--help'){
        fis.cli.help();
    } else if(first === '-v' || first === '--version'){
        fis.cli.version();
    } else if(first[0] === '-'){
        fis.cli.help();
    } else {
        if(first === 'release') {
            var params = buildParams()
            if(argv[3] && argv[3].indexOf('w') !== -1) {
                process.exec('watchify ' + params, function(a, b, error) {
                    console.error(error);
                });
                exeCmd(argv);
            }else {
                process.exec('browserify ' + params, function(a, b, error) {
                    console.error(error);
                    exeCmd(argv);
                });
            }
        }else {
            exeCmd(argv);
        }
    }
};

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
            },
            browserify: {
                main: 'main.js',
                output: 'dist/app.js',
                // transform: 'coffee-reactify',
                // extension: '.coffee'
            }
        }
    },
    roadmap: {
        ext : {
            scss: 'css',
            less: 'less'
        },
        path: [
            {
                reg : /^\/assets\/(.*)\.(scss)$/i,
                release : 'css/$1.css',
                id: '$1.css'
            },
            {
                reg : /^\/assets\/(.*)$/i,
                release : 'css/$1.css',
            },
            {
                reg : /^\/widgets\/([^\/]+)\/assets\/index\.(scss)$/i,
                id : 'widgets/$1.css',
                release : 'css/$1/index.css'
            },
            {
                reg : /^\/widgets\/([^\/]+)\/assets\/(.*)$/i,
                release : 'img/$1/$2'
            },
            {
                reg: /\/dist\/fonts\/(.*)$/i,
                release: 'font/$1'
            },
            {   
                reg: 'dist/css/bootstrap.min.css',
                release: 'css/bootstrap.css',
                id: 'bootstrap.css'
            },
            {
                id: 'app',
                reg: 'dist/app.js',
                release: 'dist/app.js'
            },
            {
                reg: 'dist/app.css',
                release: 'dist/app.css'
            },
            {
                reg: 'index.html',
                release: 'index.html'
            },
            {   
                reg: 'dist/**',
                release: false
            },
            {
                reg: '**',
                release: false
            }
        ]
    }
});