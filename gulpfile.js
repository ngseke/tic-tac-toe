const pump = require('pump')
const gulp = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const livereload = require('gulp-livereload')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const pug = require('gulp-pug')

gulp.task('style', () => {
  const processors = [autoprefixer({browsers: ['last 5 version']})]
  return gulp.src('src/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss(processors))
    .pipe(gulp.dest('public/'))
})

gulp.task('js', () => {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('public/'))
})

gulp.task('pug', () => {
  return gulp.src('src/**/*.pug')
    .pipe(pug({ pretty: 0 }))
    .pipe(gulp.dest('public/'))
})

gulp.task('default', ['style', 'js', 'pug', 'watch'])

gulp.task('watch', () => {
  gulp.watch('src/**/*.sass', ['style'])
  gulp.watch('src/**/*.js', ['js'])
  gulp.watch('src/**/*.pug', ['pug'])
})
