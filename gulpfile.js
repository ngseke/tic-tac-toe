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

gulp.task('style', (cb) => {
  const processors = [autoprefixer({browsers: ['last 5 version']})]
  pump([
    gulp.src('./src/**/*.sass'),
    sass().on('error', sass.logError),
    sass({outputStyle: 'compressed'}),
    postcss(processors),
    gulp.dest('./public/'),
    livereload({ start: true })
  ], cb)
})

gulp.task('js', (cb) => {
  pump([
    gulp.src('./src/**/*.js'),
    gulp.dest('./public/'),
    livereload({ start: true })
  ], cb)
})

gulp.task('pug', (cb) => {
  pump([
    gulp.src('./src/**/*.pug'),
    pug({ pretty: 0 }),
    gulp.dest('./public/'),
    livereload({ start: true })
  ], cb)
})

gulp.task('default', ['style', 'js', 'pug', 'watch'])

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('./src/**/*.sass', ['style'])
  gulp.watch('./src/**/*.js', ['js'])
  gulp.watch('./src/**/*.pug', ['pug'])
})
