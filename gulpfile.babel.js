/**
 * -----------------------------------------------------------------------------
 * Gulp Tasks for (Basic) Front-end Development
 *
 * Licensed under GPL v3.0:
 * https://github.com/jhmsly/launchpad/blob/main/LICENSE
 *
 * @license GPL-3.0-or-later
 *
 * @overview Handles all file processing tasks, as well as BrowserSync, etc.
 *
 * @author Jay Hemsley <jay@digitalhe.at>
 *
 * @version 3.0.0
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * Module Import & Settings
 * -----------------------------------------------------------------------------
 */

// Import Gulp
import gulp from 'gulp';
import { argv } from 'yargs';
import del from 'del';

// Import Browser Sync
import browserSync from 'browser-sync';

// Import CSS Modules
import easings from 'postcss-easings';
import mqp from 'css-mqpacker';
import nano from 'cssnano';
import postcss from 'gulp-postcss';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';

// Import Javascript Modules
import babel from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import plumber from 'gulp-plumber';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';

// Import Utility Modules
import lineec from 'gulp-line-ending-corrector';
import log from 'fancy-log';
import notifier from 'node-notifier';
import rename from 'gulp-rename';

// Import Launchpad Gulp Configuration
import config from './launchpad.config';

// Sass Handler
const sass = gulpSass(dartSass);

/**
 * -----------------------------------------------------------------------------
 * Custom Error Handling
 *
 * @param Mixed err
 * -----------------------------------------------------------------------------
 */

const errorHandler = (r) => {
  log.error('❌ ERROR: <%= error.message %>')(r);
  this.emit('end');
};

/**
 * -----------------------------------------------------------------------------
 * Global Runtime Variables
 * -----------------------------------------------------------------------------
 */

const isDev = argv.dev === undefined ? false : true;
const buildDirectory = isDev ? `./build/` : `./dist/`;

/**
 * -----------------------------------------------------------------------------
 * Task: `init`.
 *
 * @description Initializes the gulp task runner.
 * @param { boolean } runBrowserSync Initialize browserSync on start.
 * -----------------------------------------------------------------------------
 */

async function init() {
  log('🚀 — Initializing gulp tasks...');

  await del([buildDirectory]);

  if (isDev) {
    return browserSync.init({
      ghostMode: false,
      injectChanges: true,
      logPrefix: 'launchpad',
      notify: false,
      open: false,
      port: config.port ? config.port : 8000,
      scrollProportionally: false,
      server: ['./', './html'],
      ui: {
        port: config.port ? config.port + 1 : 8001,
      },
      watchEvents: ['change', 'add', 'unlink', 'addDir', 'unlinkDir'],
    });
  }
}

gulp.task('init', gulp.series(init));

/**
 * -----------------------------------------------------------------------------
 * Task: `styles`.
 *
 * @description Compiles SCSS, Autoprefixes and minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source SCSS file.
 *    2. Compiles SCSS to CSS.
 *    3. Combines media queries and autoprefixes with PostCSS.
 *    4. Writes the sourcemaps for it.
 *    5. Renames the CSS file to style.min.css.
 *    7. Injects CSS via Browser Sync.
 * -----------------------------------------------------------------------------
 */

gulp.task('styles', () => {
  log('⚡️ — Processing stylesheets...');

  let gulpTask = gulp
    .src('./assets/scss/main.scss', {
      allowEmpty: true,
    })
    .pipe(plumber(errorHandler));

  if (isDev) {
    gulpTask = gulpTask.pipe(
      sourcemaps.init({
        loadMaps: true,
      })
    );
  } else {
    gulpTask = gulpTask.pipe(
      rename(function (path) {
        path.basename = path.basename + '.min';
        path.extname = '.css';
      })
    );
  }

  gulpTask = gulpTask
    .pipe(
      sass({
        errorLogToConsole: true,
        indentWidth: 4,
        outputStyle: isDev ? 'expanded' : 'compressed',
        precision: 10,
      })
    )
    .on('error', sass.logError)
    .pipe(
      postcss([
        mqp({
          sort: true,
        }),
        nano({
          autoprefixer: {
            browsers: config.BROWSERS_LIST,
          },
          preset: [
            'default',
            {
              normalizeWhitespace: isDev ? false : true,
            },
          ],
        }),
        easings(),
      ])
    );

  if (isDev) {
    gulpTask = gulpTask.pipe(sourcemaps.write('./'));
  }

  gulpTask = gulpTask
    .pipe(lineec())
    .pipe(gulp.dest(`${buildDirectory}/assets/css`));

  if (isDev) {
    gulpTask = gulpTask.pipe(browserSync.stream());
  }

  gulpTask = gulpTask.on('end', () => log('✅ STYLES — completed!'));

  return gulpTask;
});

/**
 * -----------------------------------------------------------------------------
 * Task: `scripts`.
 *
 * @description Bundles javascript with Browserify.
 *
 * @todo Fill out a description for this section.
 * -----------------------------------------------------------------------------
 */

const jsFiles = [config.jsSrcEntryFile];

async function compileScripts() {
  log('⚡️ — Bundling scripts...');

  jsFiles.map((entry) => {
    let bundler = browserify({
      entries: [config.jsSrcPath + entry],
      debug: isDev,
    })
      .transform(babel)
      .bundle()
      .on('error', (err) => {
        log.error(`❌ ERROR: ${err.message}`);

        notifier.notify({
          title: '❌ ERROR: Compile JS',
          message: err.message,
          sound: true,
        });
      })
      .pipe(source(entry));

    if (isDev) {
      bundler = bundler
        .pipe(rename({ extname: '.min.js' }))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'));
    } else {
      bundler = bundler
        .pipe(rename('app.min.js'))
        .pipe(buffer())
        .pipe(uglify());
    }

    bundler = bundler.pipe(gulp.dest(`${buildDirectory}/assets/js`));

    if (isDev) bundler = bundler.pipe(browserSync.stream());

    bundler = bundler.on('end', () => log('✅ JS — completed!'));

    return bundler;
  });
}

gulp.task('scripts', gulp.series(compileScripts));

/**
 * -----------------------------------------------------------------------------
 * Task: `html`.
 *
 * @description Watches html files for changes.
 * -----------------------------------------------------------------------------
 */

gulp.task('html', () => {
  log('⚡️ — Updating browser to reflect HTML changes...');

  let gulpTask = gulp.src(config.htmlSource);

  if (isDev) {
    gulpTask = gulpTask.pipe(browserSync.stream());
  } else {
    gulpTask = gulpTask.pipe(gulp.dest(`${buildDirectory}`));
  }

  gulpTask = gulpTask.on('end', () => log('✅ HTML — completed!'));

  return gulpTask;
});

/**
 * -----------------------------------------------------------------------------
 * Task: `includes`.
 *
 * @description Copies included files to the distribution folder.
 * -----------------------------------------------------------------------------
 */

gulp.task('includes', () => {
  log('⚡️ — Processing included files...');

  let gulpTask = gulp
    .src(config.incSource)
    .pipe(gulp.dest(`${buildDirectory}/assets/includes`));

  if (isDev) {
    gulpTask = gulpTask.pipe(browserSync.stream());
  }

  gulpTask = gulpTask.on('end', () => log('✅ INCLUDES — completed!'));

  return gulpTask;
});

/**
 * -----------------------------------------------------------------------------
 * Task: `watch`.
 *
 * @description Watch tasks for the gulp processes.
 * -----------------------------------------------------------------------------
 */

gulp.task('watch', () => {
  log('🔍 — Watching files for changes...');

  gulp.watch(config.watchStyles, gulp.series('styles'));
  gulp.watch(config.watchScripts, gulp.series('scripts'));
  gulp.watch(config.htmlSource, gulp.series('html'));
  gulp.watch(config.incSource, gulp.series('includes'));
});

/**
 * -----------------------------------------------------------------------------
 * Task: `build`.
 *
 * @description Build theme without initializing browserSync or file watchers.
 * -----------------------------------------------------------------------------
 */

gulp.task(
  'prod',
  gulp.series(init, gulp.parallel('html', 'styles', 'scripts', 'includes'))
);

/**
 * -----------------------------------------------------------------------------
 * Task: `default`.
 *
 * @description Runs gulp tasks and initializes browserSync and watches files.
 * -----------------------------------------------------------------------------
 */

gulp.task(
  'default',
  gulp.series(
    init,
    gulp.parallel('styles', 'scripts', 'html', 'includes', 'watch')
  )
);
