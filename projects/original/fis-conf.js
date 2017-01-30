/**
 * Created by Administrator on 2016/12/4.
 */
// 配置打包规则
fis.config.set('pack', {
    'js/**.js': [
        'src/main.js'
    ],
    'css/**.css':[
        "src/main.css"
    ]
});
fis.hook('relative');
fis.match('src/!**.{png,js,css}', {
    release: '/static/$0'
});
fis.match('**', { relative: true })
fis.config.set('modules.postpackager', 'simple');

