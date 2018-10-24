const gulp = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const pug = require('gulp-pug')
const babel = require('gulp-babel')

gulp.task('style', () => {
  const processors = [autoprefixer({browsers: ['last 5 version']})]
  return gulp.src('src/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss(processors))
    .pipe(gulp.dest('docs/'))
})

gulp.task('js', () => {
  return gulp.src('src/**/*.js')
      // .pipe(babel({
      //   presets: ['es2015']
      // }))
    // .pipe(uglify())
    .pipe(gulp.dest('docs/'))
})

gulp.task('pug', () => {
  return gulp.src('src/**/*.pug')
    .pipe(pug({
      pretty: 0,
      locals : { moment: require('moment') }
    }))
    .pipe(gulp.dest('docs/'))
})

gulp.task('img', () => {
  return gulp.src('src/img/**')
    .pipe(gulp.dest('docs/'))
})

gulp.task('default', ['style', 'js', 'pug', 'img', 'watch'])

gulp.task('watch', () => {
  gulp.watch('src/**/*.sass', ['style'])
  gulp.watch('src/**/*.js', ['js'])
  gulp.watch('src/**/*.pug', ['pug'])
})
