import gulp from 'gulp';
import less from 'gulp-less';
import sourcemaps from 'gulp-sourcemaps';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import cssmin from 'gulp-minify-css';
import autoprefixer from 'gulp-autoprefixer';
import cssver from 'gulp-make-css-url-version';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import webpack from 'gulp-webpack';
import gutil from 'gulp-util';
//编译less
gulp.task('less', () => {
  gulp.src('public/fontend/less/*.less')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['> 5%'],
      cascade: true,
      remove:true
    }))
    .pipe(cssver())
    .pipe(gulp.dest('public/fontend/css'))
    .pipe(sourcemaps.init())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/fontend/css'));
});
//打包es6
gulp.task('webpack',() => {
  gulp.src('public/fontend/babel/index.es6')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(webpack({
      module: {
        loaders: [{
          test: /\.es6$/,
          loader: 'babel'
        }]
      }
    }))
    .pipe(rename({
      basename: 'bundle'
    }))
    .pipe(gulp.dest('public/fontend/js'))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      output: {
        ascii_only: true
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/fontend/js'));
})

gulp.task('watch', () => {
  gulp.watch('public/fontend/less/**/*.less', ['less']);
  gulp.watch('public/fontend/babel/**/*.es6', ['webpack']);
});
