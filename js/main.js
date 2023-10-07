//
//     //JS
//     layui.use(['element', 'layer', 'util'], function(){
//     var element = layui.element;
//     var layer = layui.layer;
//     var util = layui.util;
//     var $ = layui.$;
//
//     //头部事件
//     util.event('lay-header-event', {
//     menuLeft: function(){ // 左侧菜单事件
//     layer.msg('展开左侧菜单的操作', {icon: 0});
// },
//     menuRight: function(){  // 右侧菜单事件
//     layer.open({
//     type: 1,
//     title: '更多',
//     content: '<div style="padding: 15px;">处理右侧面板的操作</div>',
//     area: ['260px', '100%'],
//     offset: 'rt', // 右上角
//     anim: 'slideLeft', // 从右侧抽屉滑出
//     shadeClose: true,
//     scrollbar: false
// });
// }
// });
// });


const BaseUrl = 'http://localhost:3000/social/'


showTable = async (res, content)=>{
    for (const Element of res) {
        var username = $('<p>' + Element.username + '</p>')
        $(content).append ([username])
    }
}

$(document).ready(()=> {

    $.get(BaseUrl + 'get_all_users', async (res) => {

        await showTable(res,$('#usersPanel'))
    })

    $('.index').click(async (e) => {
        // 偶尔会出现bug 比如 unrecognized expression 因为 e 没加载出来
        const selector = '\#' + e.target.id
        const content = $(selector).attr('href')

        //点击动画 -》 一闪
        const clicked = $(e.target).parent()
        clicked.addClass('active')
        setTimeout(
            () => {
                clicked.removeClass('active')
            },
            100
        )
        // 判断页面 并发送 请求
        switch (clicked.attr('id')) {
            case 'users':
                $.get(BaseUrl + 'get_all_users', async (res) => {
                    await showTable(res,content)
                })
                break;
            case 'squeals':
                $.get(BaseUrl + 'allSqueals', async (res) => {
                    await showTable(res,content)
                })
                break;
            case 'official':
                $.get(BaseUrl + 'allChannelO', async (res) => {
                    await showTable(res,content)
                })
                break;
            case 'private':
                $.get(BaseUrl + 'allChannelP', async (res) => {
                    await showTable(res,content)

                })
                break;
        }

        // 切换显示画面
        $('.visible').removeClass('visible').addClass('hide')

        $(content).removeClass('hide').addClass('visible')


    })
})