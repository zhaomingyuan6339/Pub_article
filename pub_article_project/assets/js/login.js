$(function () {
    /**点击“去注册账号的链接跳转到注册” */
    $('#link_reg').on('click', () => {
        $('.login-box').hide(1000);
        $('.reg-box').show(1000);
    })
    /**点击去登录注册影藏 */
    $('#link_login').on('click', () => {
        $('.reg-box').hide(1000)
        $('.login-box').show(1000)
    })

    /**获取layer对象 */
    const layer = layui.layer;
    /**从layUI获取form对象 */
    const form = layui.form;
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === '草' || value === '色' || value === '妈') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        /**校验两次密码是否一致的规则 */
        repwd: function (value) {
            /**
             * 通过形参拿到的是确认密码框中的内容
             * 还需要拿到密码框中的内容
             * 然后进行全等哦判断
             * 如果判断失败，则return一个提示消息即可
             */
            const pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次输入的密码不一致！'
            }
        }
    });

    /**监听表单的提交事件，发起ajax请求 */
    $('#form_reg').on('submit', (e) => {
        /**阻止默认的提交行为 */
        e.preventDefault();
        /**发起post请求 */
        $.ajax({
            method: 'POST',
            url: '/api/reguster',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('注册成功！请登录', { icon: 1 });
                $('#link_login').click();
            }
        })
    })

    /**监听登录表单额提交事件，发起ajax请求 */
    $('#form_login').on('submit', (e) => {//注意：这里箭头函数里面不能使用this
        /**阻止默认表单的提交行为 */
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: {
                username: $('#form_login [name=username]').val(),
                password: $('#form_login [name=password]').val()
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                layer.msg('登录成功！', { icon: 1 });
                /**将服务器返回的token字符串存储在浏览器本地存储里面 */
                localStorage.setItem('token', res.token);
                // console.log(res);
                /**跳转到后台主页 */
                location.href = './index.html';
            }

        })
    })
})