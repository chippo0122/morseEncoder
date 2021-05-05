const gulp = require('gulp');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('copy', function(){
    return gulp.src(['./source/**/*.html', './source/**/*.js'])
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function(){
    return watch(['./source/**/*.html', './source/**/*.js', './source/**/*.scss'],
        gulp.series('sass','copy')
    )
});

gulp.task('sass', function(){
    return gulp.src('./source/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('default', gulp.series('sass', 'copy', 'watch'));