$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    /**创建裁剪区域 */
    $('#btn_upload').on('click', function () {
        $('#file').click();
    })

    /**为文件选择框绑定change事件 */
    $('#file').on('change', function (e) {
        let files = e.target.files;
        // console.log(e.target.files);
        if (files.length === 0) {
            return layui.layer.msg('请选择头像文件', { icon: 5 });
        }

        //拿到用户选择的的文件
        let file = e.target.files[0];
        let newImgURL = URL.createObjectURL(file);
        //重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        /**为确定按钮绑定事件 */
        $('#btn_ChooseUpload').on('click', function () {
            //拿到用户裁剪后的头像
            var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            //调用接口将头像上传到服务器
            $.ajax({
                method: 'POST',
                url: '/my/update/avatar',
                data: {
                    avatar: dataURL,
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('更换用户头像失败！', { icon: 5 })
                    }
                    layui.layer.msg('上传头像成功!');
                    window.parent.getUserinfo();
                }
            })
        })

    })
})