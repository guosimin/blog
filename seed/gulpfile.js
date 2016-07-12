/**
 * Created by Administrator on 2016/6/30.
 */

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');

//less编译
gulp.task('less', function () {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});

//压缩css
gulp.task('css', function () {
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        // .pipe(rename(function (path) {
        //     path.basename+=".min";
        // }))
        .pipe(gulp.dest("dist/css"));
    console.log("css完成");
});

//压缩js
gulp.task('js', function () {
    gulp.src(['src/js/*.js']) //多个文件以数组形式传入
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: false,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));
    console.log("js完成");
});



gulp.task("watch",function () {
    gulp.watch(['src/less/*.less'], ['less',"css"],function () {
        console.log("css完成");
    });
    gulp.watch(['src/js/*.js','src/js/**/*.js'], ['js'],function () {
        console.log("js完成");
    });
});


