$(function () {
    /**获取layer对象 */
    const layer = layui.layer;
    /**获取用户基本信息 */
    getUserinfo();
    /**退出 */
    $('#btnLogout').on('click', () => {
        // console.log('ok');
        layer.confirm('确认退出?', { icon: 3, title: '提示' }, function (index) {
            /**清空本地存储中的token */
            localStorage.removeItem('token');
            /**跳转回登录界面 */
            location.href = './login.html';
            /**关闭confirm询问框 */
            layer.close(index);
        });
    })
    // logOut();
})
/***获取用户信息的ajax函数 */
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！', { icon: 5 });
            }
            /**渲染用户头像 */
            // console.log(res);
            renderAvatar(res.data);
        },
        /**不论成功还是失败，最终都会调用complete函数 */
        // complete: (res) => {
        //     console.log(res);
        //     /**在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据 */
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        //         //强制清空token
        //         localStorage.removeItem('token');
        //         //强制跳转到登录页面
        //         location.href = './login.html';
        //     }
        // }
    })
}

/** 渲染用户头像模块*/
const renderAvatar = (user) => {
    //1.获取用户的name属性，即昵称或者用户名，昵称优先
    var name = user.nickname || user.username;
    //2.设置欢迎文本
    $('.welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    //3.按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1.渲染用户头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(user.username[0]).show();
    }
}

/**点击按钮退出功能 */
// const logOut = () => {

// }