var gulp = require('gulp');
var insalesUp = require('insales-uploader');
var watch = require('gulp-watch');

var options = {
  account: {
    id: '4d61f63e32f66fc6ed800403408f0d8e',
    token: '2cffd15ef01cb3d518825f4c5d71aceb',
    url: 'myshop-ke933.myinsales.ru',
    http: true
  },
  theme: {
    id: '955265',
    root: 'my-shop',
    update: true,
    excludeFiles: ['**/*.DS_Store', '**/*.log'],
    startBackup: true
  },
  tools:{
    postCssPlugins: [], // [require('postcss-discard-duplicates')(), require('postcss-combine-duplicated-selectors')()]
    debugMode: false,
    openBrowser: {
      start: true
    },
    browserSync: {
      start: false,
      uploadRestart: true
    },
    stylelint: {
      use: true,
      stopOnFail: true,
      config: {
        "rules": {
          "property-no-unknown": true
        }
      }
    }
  }
}

var InsalesUploader = new insalesUp(options)

gulp.task('download', function(){
  return InsalesUploader.download()
});

gulp.task('pull', function(){
  return InsalesUploader.pullTheme()
});

gulp.task('push', function(){
  return InsalesUploader.pushTheme()
});

gulp.task('stream', function(){
  return InsalesUploader.stream()
});

gulp.task('watch', function(){
  return watch(InsalesUploader.paths.toWatch, function (_vinyl) {
    InsalesUploader.triggerFile(_vinyl.event, _vinyl.path);
  });
});

gulp.task('backup', function(){
  return InsalesUploader.backup()
});

gulp.task('diff-assets', function(){
  return InsalesUploader.diffLocalAssets()
});

gulp.task('init-assets', function(){
  return InsalesUploader.initAssets()
});

gulp.task('upload', function(){
  return InsalesUploader.upload({
    update: true
  })
});

gulp.task('open-browser', function(){
  return InsalesUploader.openBrowser()
});

gulp.task('default', ['download'], function() {
  return gulp.start('stream');
});
