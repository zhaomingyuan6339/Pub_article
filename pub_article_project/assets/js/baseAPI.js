/**
 * 注意：每次调用$.get()或$.post()或$.ajax()的时候，
 * 会先调用ajaxPrefilter这个函数
 * 在这个函数中，可以拿到我们给ajax提供的配置对象
 */
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    /**在发起真正的ajax请求之前，先统一拼接一下根路径 */
    options.url = 'http://127.0.0.1:3007' + options.url;
    // console.log(options.url);
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',

        }
    }

    /**全局统一挂载complete回调函数 */
    /**不论成功还是失败，最终都会调用complete函数 */
    options.complete = function (res) {
        // console.log(res);
        /**在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据 */
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
            //强制清空token
            localStorage.removeItem('token');
            //强制跳转到登录页面
            location.href = './login.html';
        }
    }
})