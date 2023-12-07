
const BaseUrl = 'http://localhost:3000/social/'



getUsers = async (res,table)=>{

    for (const Element of res) {
        const row = $('<tr>')
        const username = $('<td id="username">' + Element.username + '</td>')
        const nickname = $('<td id="nickname">' + Element.nickname + '</td>')
        const type = $('<td id="type">' + Element.accountType + '</td>')
        const inizialCredit = $('<td>' + Element.creditInit + '</td>')
        // const form = $('<form action="/" id="changeForm">')
        const creditHead = '<td class="grid-container number"><div class="grid-x"> <span class="cell large-5"> '
        const creditFeet = '</span><input class="cell large-5 '
        const Feet2 = 'value="0" ></div></td>'
        const dayAvailable = $(creditHead + Element.creditAvailable.daily + creditFeet + 'daily"' + Feet2 )
        const weekAvailable = $(creditHead + Element.creditAvailable.weekly + creditFeet + 'weekly"' + Feet2)
        const monthAvailable = $(creditHead + Element.creditAvailable.monthly + creditFeet + 'monthly"' + Feet2)
        // const closeForm = $('</form>')
        const state = $('<td> libero </td>')
        row.append([username,nickname,type,inizialCredit,dayAvailable,weekAvailable,monthAvailable,state])
        const closeRow = $('</tr>')
        table.append ([row,closeRow])
    }
}
getSqueals = async (res,table)=>{
    for (const squeal of res) {
        const row = $('<tr>')
        const username = $('<td id="username">' + squeal.sender + '</td>')
        const contenuto = $('<td>' + squeal.body + '</td>')
        const destinatari = $('<td id="destArray">'+squeal.recipients +'</td>')
        const button = $('<td><a class="button tiny" id="destId"><i class="fi-plus"></i></a></td>')
        const numTdHead = '<td class="grid-container"><div class="grid-x"> <span class="cell large-5"> '
        const numTdFeet = '</span><input class="cell large-5" value="0" ></div></td>'
        // const impression = $(numTdHead + squeal.reaction.impression + numTdFeet)
        // const like = $(numTdHead + squeal.reaction.impression + numTdFeet)
        // const dislike = $(numTdHead + squeal.reaction.impression + numTdFeet)
        const impression = $(numTdHead + 100 + numTdFeet)
        const like = $(numTdHead + 200 + numTdFeet)
        const dislike = $(numTdHead + 300 + numTdFeet)
        const data = $('<td>' + squeal.dateTime + '</td>')
        // const automatic = $('<td><input type="checkbox" id="automatic" checked=' + squeal.automaticMessage + '></td>')
        var automatic
        if (squeal.automaticMessage) {
            automatic = $('<td><input type="checkbox" id="automatic" checked></td>')
        }
        else {
            automatic = $('<td><input type="checkbox" id="automatic" ></td>')
        }
        const closeRow = $('</tr>')
        row.append([username,contenuto,destinatari,button,impression,like,dislike,data,automatic])
        table.append([row,closeRow])
    }
}
getChannel = async (res, table)=>{
    for (const channel of res) {
        const row = $('<tr>')
        const name = $('<td>' + channel.name + '</td>')
        const admin = $('<td>' + channel.admin + '</td>')
        const desc = $('<td>' + channel.desciption + '</td>')
        const numFollowers = $('<td>' + channel.followers + '</td>')
        const numSqueals = $('<td>' + channel.numPost + '</td>')
        const mutable = $('<td><input type="checkbox" id="automatic"></td>')
        const closeRow = $('</tr>')
        row.append([name,admin,desc,numFollowers,numSqueals,mutable])
        table.append([row,closeRow])

    }
}
ModificUser = async (tbody,username)=>{
    const inputs = tbody.find('input')

    var userIndex
    var newUserInfo = []
    var newCredit = {
        username : undefined,
        daily : 0,
        weekly : 0,
        monthly : 0
    }

    inputs.each((index,element)=>{
        // 判断 input 表格有没有被更改
        if (element.value != 0){
            userIndex = parseInt(index/3)

            if (!newCredit.username){
                newCredit.username=username[userIndex].innerHTML
            }

            switch ((index+1) % 3){
                case 1 :
                    newCredit.daily = (element.value)
                    break;
                case 2:
                    newCredit.weekly = (element.value)
                    break;
                case 0:
                    newCredit.monthly = (element.value)
                    break;
            }
        }

        // 每input数量 等于0 所以等于最后一个 且username存在， 那就push这个用户
        if ((index+1) % 3 == 0 && newCredit.username){
            newUserInfo.push(newCredit)
            newCredit ={
                username : undefined,
                daily : 0,
                weekly : 0,
                monthly : 0
            }

        }

    })
    if (newUserInfo.length!= 0) {
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify(newUserInfo),
            dataType: "json",
            method: "PATCH",
            url: BaseUrl + 'updateUser'
        }).done((res) => {
            console.log( 'Modifica eseguita:',res)
        })
        //     .always((res)=>{
        //         console.log(res)
        // })
    }


}

// ModificSqueal = async (tbody,username)=>{
//     const inputs = tbody.find('input')
//     // const checkbox = tbody.find('td[id='']')
//     var userIndex
//     var newSquealInfo = []
//     var newReaction = {
//         username : undefined,
//         visitNumber : 0,
//         likeNumber : 0,
//         dislikeNumber : 0,
//         automatic:false
//     }
//
//     inputs.each((index,element)=>{
//         // 判断 input 表格有没有被更改
//         if (element.value != 0 || element.type.is('checkbox')){
//             userIndex = parseInt(index/4)
//
//             if (!newReaction.username){
//                 newReaction.username=username[userIndex].innerHTML
//             }
//
//             switch ((index+1) % 4){
//                 case 1 :
//                     newReaction.visitNumber = element.value
//                     break;
//                 case 2:
//                     newReaction.likeNumber = element.value
//                     break;
//                 case 3:
//                     newReaction.dislikeNumber = element.value
//                     break;
//                 case 0:
//                     newReaction.automatic= element.is(':checked')
//             }
//         }
//
//         // 每input数量 等于0 所以等于最后一个 且username存在， 那就push这个用户
//         if ((index+1) % 4 == 0 && newReaction.username){
//
//             newSquealInfo.push(newReaction)
//             newReaction = {
//                 username : undefined,
//                 visitNumber : 0,
//                 likeNumber : 0,
//                 dislikeNumber : 0,
//                 automatic: false
//             }
//
//         }
//
//     })
//     if (newSquealInfo.length!= 0) {
//         $.ajax({
//             contentType: "application/json",
//             data: JSON.stringify(newUserInfo),
//             dataType: "json",
//             method: "PATCH",
//             url: BaseUrl + 'updateSqueal'
//         }).done((res) => {
//             console.log( 'Modifica eseguita:',res)
//         })
//
//     }
//
//
// }





    $.get(BaseUrl + 'get_all_users', async (res) => {

        await getUsers(res,$('#userTable'))

    })

    $.get(BaseUrl + 'allSqueals', async (res) => {
        await getSqueals(res, $('#squealTable'))
    })

    // $.get(BaseUrl + 'allChannelP', async (res) => {
    //     await getChannel(res, $('#privateTable'))
    // })
    //
    // $.get(BaseUrl + 'allChannelO', async (res) => {
    //     await getChannel(res, $('#officialTable'))
    // })
    $('#reset').click( ()=>{
        $('input').prop({
            value : 0
        })
    })

    $('#change').click(()=>{

        const tbody =  $('.visible').find('tbody')
        const username = tbody.find("td[id='username']")
        const dest = tbody.find("td[id='destArray']")
        console.log(dest)
        switch (tbody.attr('id')) {
            case 'userTable':
                ModificUser(tbody,username)
                console.log('switch case')
                break;
            case 'squealTable':
                ModificSqueal(tbody,username)
                break;
            case 'officialTable':
                ModificOffic(tbody,username)
                break;
            case 'privateTable':
                ModificPrivate(tbody,username)
                break;
        }
    })





    $('.index').click( (elem) => {
            const selector = '\#' + elem.target.id
            const content = $(selector).attr('href')

            //点击动画 -》 一闪
            const clicked = $(elem.target).parent()
            clicked.addClass('active')
            setTimeout(
                () => {
                    clicked.removeClass('active')
                },
                100
            )
        // 初始化 table主体
        $('tbody').text('')

            // 判断页面 并发送 请求
            switch (clicked.attr('id')) {
                case 'users':
                    $.get(BaseUrl + 'get_all_users', async (res) => {

                        await getUsers(res, $('#userTable'))
                    })
                    break;
                case 'squeals':
                    $.get(BaseUrl + 'allSqueals', async (res) => {
                        await getSqueals(res, $('#squealTable'))
                    })

                    break;
                case 'official':
                    $.get(BaseUrl + 'allChannelO', async (res) => {
                        await getChannel(res, $('#officialTable'))
                    })
                    break;
                case 'private':
                    $.get(BaseUrl + 'allChannelP', async (res) => {
                        await getChannel(res, $('#privateTable'))
                    })
                    break;
            }
        // 切换显示画面
          $('.visible').removeClass('visible').addClass('hide')

          $(content).removeClass('hide').addClass('visible')



    })

    // $('#profile').on('click',async ()=>{
    //     $('#profileMenu').removeClass('hide').addClass('visible')
    // }).on('mouseleave',async ()=>{
    //     $('#profileMenu').removeClass('visible').addClass('hide')
    // })

