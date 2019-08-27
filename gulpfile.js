'use strict';
const argv = require('yargs').argv;
const path = require('path');
const gulp = require('gulp');
const file = require('gulp-file');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const server = require('gulp-develop-server');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const plumber = require('gulp-plumber');
const zip = require('gulp-zip');
const jEditor = require('gulp-json-editor');
const runSequence = require('run-sequence');
const mocha = require('gulp-spawn-mocha');
const gUtil = require('gulp-util');
const merge = require('merge2');
const tsProject = ts.createProject('tsconfig.json');

const projects = {
    bootstrap: 'server.js',
    folders: {
        src: 'src',
        docker: 'docker',
        build: 'build',
        dist: 'release',
        logs: 'logs',
        coverage: 'coverage',
        nyc: '.nyc_output',
        migration: 'src/data/sql/migrations'
    },
    files: {
        tsFiles: ['src/**/*.ts'],
        nonTsFiles: ['src/**/*.*', 'src/**/*.**', '!src/**/*.ts'],
        artifact: 'archive.zip',
        configFiles: ['src/configs/*.yaml', '!src/configs/template.yaml']
    }
};


const padDate = (segment) => {
    segment = segment.toString();
    return segment[1] ? segment : '0' + segment;
}

const yyyymmddhhmmss = () => {
    var d = new Date();
    return d.getFullYear().toString() + padDate(d.getMonth() + 1) + padDate(d.getDate()) + padDate(d.getHours()) + padDate(d.getMinutes()) + padDate(d.getSeconds());
}

gulp.task('clean', () => {
    return gulp
        .src([
            projects.folders.build,
            projects.folders.logs,
            projects.folders.dist,
            projects.folders.coverage,
            projects.folders.nyc
        ], {
            read: false
        })
        .pipe(clean());
});

gulp.task('files:copy', () => {
    return gulp.src(projects.files.nonTsFiles)
        .pipe(plumber())
        .pipe(gulp.dest(projects.folders.build));
});

gulp.task('ts:lint', () =>
    gulp.src(projects.files.tsFiles)
    .pipe(tslint({
        configuration: 'tslint.json'
    }))
    .pipe(tslint.report({
        emitError: false
    }))
);

gulp.task('ts:lint:release', () =>
    gulp.src(projects.files.tsFiles)
    .pipe(tslint({
        configuration: 'tslint.json'
    }))
    .pipe(tslint.report({
        emitError: true
    }))
    .on('error', (error) => {
        process.exit(1);
    })
);

gulp.task('ts:compile', () => {
    let tsResult = gulp.src(projects.files.tsFiles, {
            base: projects.folders.src
        })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.js.pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: () => {
                return path.join(__dirname, projects.folders.src);
            }
        }))
        .pipe(gulp.dest(projects.folders.build))
    ]);

});

gulp.task('ts:compile:release', () => {
    let tsResult = gulp.src(projects.files.tsFiles, {
            base: projects.folders.src
        })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject());
        // .on('error', function (error) {
        //     process.exit(1);
        // });

    return merge([
        tsResult.js.pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: () => {
                return path.join(__dirname, projects.folders.src);
            }
        }))
        .pipe(gulp.dest(projects.folders.build))
    ]);
});

gulp.task('files:copy:package.json', () => {
    return gulp.src('package.json')
        .pipe(jEditor(json => {
            json.devDependencies = {};
            return json;
        }))
        .pipe(gulp.dest(projects.folders.build));
});

gulp.task('zip', () => {
    return gulp.src(projects.folders.build + '/**/*', {
            dot: true
        })
        .pipe(zip(projects.files.artifact))
        .pipe(gulp.dest(projects.folders.dist));
});

gulp.task('build', (cb) => {
    runSequence('clean', 'ts:lint', 'files:copy', 'ts:compile', cb);
});

gulp.task('files:copy:docker', () => {
    gulp.src(projects.folders.build + '/**')
        .pipe(gulp.dest(projects.folders.dist + '/app'));
    gulp.src(projects.folders.docker + '/production/**')
        .pipe(gulp.dest(projects.folders.dist));
});

gulp.task('build:production', (cb) => {
    runSequence('clean', 'ts:lint:release', 'files:copy', 'ts:compile:release', 'files:copy:package.json', 'files:copy:docker', cb)
});

gulp.task('build:staging', (cb) => {
    runSequence('clean', 'ts:lint:release', 'files:copy', 'ts:compile:release', 'files:copy:package.json', 'files:copy:docker', cb)
});

gulp.task('build:release', (cb) => {
    runSequence('clean', 'ts:lint:release', 'files:copy', 'ts:compile:release', 'files:copy:package.json', cb);
});

gulp.task('release', (cb) => {
    runSequence('build:release', 'zip', cb);
});

gulp.task('test', () => {
    return gulp.src(['test/*.ts'], {
            read: false
        })
        .pipe(mocha({
            reporter: 'spec',
            compilers: 'ts:ts-node/register'
        }))
        .on('error', gUtil.log);
});

gulp.task('watch', ['build'], () => {
    gulp.watch(projects.files.tsFiles, ['ts:lint', 'ts:compile']);
    gulp.watch(projects.files.nonTsFiles, ['files:copy']);
});

gulp.task('server:start', (cb) => {
    runSequence('files:copy', 'ts:compile', cb);
    server.listen({
        path: `${projects.folders.build}/${projects.bootstrap}`
    }, (error) => {
        console.log(error);
    });
});

gulp.task('server:restart', ['ts:compile'], () => {
    server.restart();
});

gulp.task('default', ['server:start'], () => {
    gulp.watch(projects.files.tsFiles, ['server:restart']);
});

gulp.task('migrate:compile:knex', () => {
    return gulp.src(`${projects.folders.src}/knexfile.ts`, {
            base: projects.folders.src
        })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: () => {
                return path.join(__dirname, projects.folders.src);
            }
        }))
        .pipe(gulp.dest(projects.folders.build));
});

gulp.task('migrate:compile:config', () => {
    return gulp.src(projects.files.configFiles)
        .pipe(plumber())
        .pipe(gulp.dest(`${projects.folders.build}/configs`));
});

gulp.task('migrate:compile:script', () => {
    return gulp.src([`${projects.folders.migration}/*.ts`, `${projects.folders.src}/libs/constants.ts`, `${projects.folders.src}/data/sql/schema.ts`], {
            base: projects.folders.src
        })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: () => {
                return path.join(__dirname, projects.folders.migration);
            }
        }))
        .pipe(gulp.dest(projects.folders.build));
});

gulp.task('migrate:compile', (cb) => {
    runSequence('clean', 'migrate:compile:knex', 'migrate:compile:script', 'migrate:compile:config', 'files:copy', cb);
});


gulp.task('migrate:new', () => {
    if (argv.name != null) {
        return file(`${yyyymmddhhmmss()}_${argv.name}.ts`,
            `import * as Bluebird from "bluebird";
import * as Knex from "knex";

export const up = (knex: Knex, promise: typeof Bluebird): Bluebird<any> => {
    return promise.resolve();
};

export const down = (knex: Knex, promise: typeof Bluebird): Bluebird<any> => {
    return promise.resolve();
};`).pipe(gulp.dest(projects.folders.migration));
    }
});

gulp.task('migrate:latest', () => {
    return;
});

gulp.task('migrate:rollback', () => {
    return;
});
