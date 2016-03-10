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

gulp.task('less', () => {
  gulp.src('public/fontend/less/**/*.less')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(less())
    .pipe(gulp.dest('public/fontend/css'));
});

gulp.task('css', () => {
  gulp.src('public/fontend/css/**/*.css')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['> 5%'],
      cascade: true,
      remove:true
    }))
    .pipe(cssver())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/fontend/css'));
});

gulp.task('babel', () => {
  gulp.src('public/fontend/babel/**/*.es6')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/fontend/js'));
});

gulp.task('watch', () => {
    gulp.watch('public/fontend/less/**/*.less', ['less','css']);
    gulp.watch('public/fontend/babel/**/*.es6', ['babel']);
});
