const BaseUrl = 'https://site222320.tw.cs.unibo.it/social/'
// const BaseUrl = 'http://localhost:3000/social/'

disablePageArrow = async (pageNum,isLastPage)=>{
    const prevArrow = $('.pagination-previous')
    const nextArrow = $('.pagination-next')
    if ( pageNum == 1 ){
        $('#prevArrow').remove()
        prevArrow.addClass('disabled').text('Previous')
    }else if (prevArrow.hasClass('disabled') ){
        prevArrow.removeClass('disabled')
            .text('')
            .html('<a id="prevArrow" aria-label="previous page">Previous</a>')
    }
    if (isLastPage){
        $('#nextArrow').remove()
        nextArrow.addClass('disabled').text('Next')
    }else if (nextArrow.hasClass('disabled') ){
        nextArrow.removeClass('disabled')
            .text('')
            .html('<a id="nextArrow" aria-label="next page">Next</a>')
    }
}

showPage=async (showPage)=>{
    const pageNum = $('.current').text()
    var IsLastPage = false
    // 初始化 table主体
    $('tbody').text('')
    // 判断页面 并发送 请求
     switch (showPage) {
        case 'users' :
        case 'usersPanel':
        case 'userTable' :
            const userFilter = {
                showNumber : parseInt($('#showUserNumber').val()),
                filterName :$('#filtName').val(),
                filtRule : $('#popFilterRule').val().includes('Maggiore') ? 'gte':'lte',
                filtPop : parseInt($('#popFilterNumber').val()),
                filtType: modRegisterUserType($('#filtType').val()),
                pageNum :pageNum
            }
            $.get(BaseUrl + 'get_all_users', {userFilter}, async (res) => {
                await getUsers(res.users, $('#userTable'))
                disablePageArrow(pageNum,res.IsLastPage)
            })
            break;

        case 'squeals':
        case 'squealsPanel':
        case 'squealTable':
            const  squealFilter = {
                showNumber : parseInt($('#showSquealNumber').val()),
                autor : $('#filtAutor').val(),
                recipient : $('#filtRep').val(),
                endTime : $('#filtEndTime').val(),
                startTime : $('#filtStartTime').val(),
                pageNum :pageNum
            }
            $.get(BaseUrl + 'allSqueals', {squealFilter},async (res) => {
                await getSqueals(res.squeals, $('#squealTable'))
                disablePageArrow(pageNum,res.IsLastPage)
            })
            break;

        case 'official':
        case 'officialPanel':
            const offFilter ={
                showNumber : parseInt($('#showOffNumber').val()),
                pageNum:pageNum
            }
            $.get(BaseUrl + 'allChannelO', {offFilter},async (res) => {
                await getChannel(res.data, $('#officialTable'))
                disablePageArrow(pageNum,res.IsLastPage)
            })
            break;
        case 'private':
        case 'privatePanel':
            const privateFilter ={
                showNumber : parseInt($('#showPrivNumber').val()),
                pageNum:pageNum
            }
            $.get(BaseUrl + 'allChannelP',{privateFilter}, async (res) => {
                await getChannel(res.data, $('#privateTable'))
                disablePageArrow(pageNum,res.IsLastPage)
            })
            break;
    }

}

reStamp = async (page)=>{
    $('.current').text(1)
    showPage(page)
}

addSquealModal = async ()=>{

    const tbody = $('#officialTable')

    $('.addButton').click(async (elem)=>{
        const names = tbody.find("td[id='name']")
        const index = $(elem.target).closest('tr').index()
        const channelName = names[index].innerHTML
        $('#channelName').text(channelName)

        $.get(BaseUrl + 'channelSqueal_get',{channelName : channelName}, async (res) => {
            await getChannelSqueals(res, $('#channelSquealTable'))
        })
    })

}

getChannelSqueals = async (res,table)=>{
    table.text('')
    for (const squeal of res) {
            const row = $('<tr>')
            const username = $('<td id="username">' + squeal.sender.username + '</td>')
            const contenuto = $('<td>' + squeal.body + '</td>')
            const impression = $('<td>' + squeal.reaction.impression+'</td>')
            const like = $('<td>' + squeal.reaction.like+'</td>')
            const dislike = $('<td>' + squeal.reaction.dislike+'</td>')
            const data = $('<td>' + squeal.dateTime + '</td>')
            var automatic
            if (squeal.automaticMessage) {
                automatic = $('<td><input type="checkbox" id="automatic" checked></td>')
            } else {
                automatic = $('<td><input type="checkbox" id="automatic" ></td>')
            }
            const squealId = $('<td id="squealID">' + squeal._id + '</td>')
            const closeRow = $('</tr>')
            row.append([username, contenuto, impression, like, dislike, data, automatic, squealId])
            table.append([row, closeRow])
    }

}

getNoChSqueals =async (res,table)=>{
    table.text('')
    for (const squeal of res) {
        const row = $('<tr>')
        const checkbox = $('<td><input type="checkbox" class="delCheckbox">')
        const username = $('<td id="name">' + squeal.sender.username + '</td>')
        const contenuto = $('<td>' + squeal.body + '</td>')
        const like = $('<td>' + squeal.reaction.like+'</td>')
        const dislike = $('<td>' + squeal.reaction.dislike+'</td>')
        const data = $('<td>' + squeal.dateTime + '</td>')
        const squealId = $('<td id="addSquealID">' + squeal._id + '</td>')
        const closeRow = $('</tr>')
        row.append([checkbox,username, contenuto,like, dislike, data, squealId])
        table.append([row, closeRow])
    }
}

getDelChannel = async (res,table)=>{
    table.text('')
    for (const channel of res) {
        const row = $('<tr>')
        const checkbox = $('<td><input type="checkbox" class="delCheckbox">')
        const name = $('<td id="name">' + channel.name + '</td>')
        const admin = $('<td>' + channel.admin + '</td>')
        const desc = $('<td>' + channel.description + '</td>')
        const numFollowers = $('<td>' + channel.followers + '</td>')
        const numSqueals = $('<td>' + channel.numPost + '</td>')
        const channelID=$('<td id="delChannelID">'+channel._id+'</td>')
        const closeRow = $('</tr>')

        row.append([checkbox,name,admin,desc,numFollowers,numSqueals,channelID])
        table.append([row,closeRow])

    }
}

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
getRecipients = async (recipients,type)=>{
    var array = []
    console.log(recipients)
        for (const recipient of recipients) {
            if (type ==='users') {
                array.push(recipient.username)
            }else{
                array.push(recipient.name)
            }
        }
    console.log(array)
    return array
}
getSqueals = async (res,table,squealID)=>{
    for (const squeal of res) {
        const row = $('<tr>')
        const username = $('<td id="username">' + squeal.sender.username + '</td>')
        const contenuto = $('<td>' + squeal.body + '</td>')
        const numTdHead = '<td class="grid-container"><div class="grid-x"> <span class="cell large-5"> '
        const numTdFeet = '</span><input class="cell large-5" value="0" ></div></td>'
        var destinatari

        if (squeal.recipients.users[0]){
            const users = await getRecipients(squeal.recipients.users,'users')
            destinatari = $(numTdHead+users +'</span><input class="cell large-5" type="text" value="'+users+'"></div> </td>')
        }else {
            const channels = await getRecipients(squeal.recipients.users,'channel')
            destinatari = $(numTdHead+ channels+'</span><input class="cell large-5" type="text" value="'+channels+'"></div> </td>')
        }

        const impression = $(numTdHead + squeal.reaction.impression + numTdFeet)
        const like = $(numTdHead + squeal.reaction.like + numTdFeet)
        const dislike = $(numTdHead + squeal.reaction.dislike + numTdFeet)

        const data = $('<td>' + squeal.dateTime + '</td>')
        // const automatic = $('<td><input type="checkbox" id="automatic" checked=' + squeal.automaticMessage + '></td>')
        var automatic
        if (squeal.automaticMessage) {
            automatic = $('<td><input type="checkbox" id="automatic" checked></td>')
        }
        else {
            automatic = $('<td><input type="checkbox" id="automatic" ></td>')
        }
        const squealId = $('<td id="squealID" class="hide">'+ squeal._id + '</td>')
        const closeRow = $('</tr>')
        row.append([username,contenuto,destinatari,impression,like,dislike,data,automatic,squealId])
        table.append([row,closeRow])
    }
}

getChannel = async (res, table)=>{
    for (const channel of res) {
        const row = $('<tr>')
        const name = $('<td id="name">' + channel.name + '</td>')
        const admin = $('<td>' + channel.admin[0].username + '</td>')
        var desc
        var button
        if (channel.typeOf==='private'){
            desc = $('<td>' + channel.description + '</td>')
            button =  $('<td class="hide"><a class="button tiny"><i class="fi-plus"></i></a>')
        }else{
            desc= $('<td class="grid-container"><div class="grid-x"> <p class="cell large-5" id="channelDescription">'+channel.description+'</p><input class="cell large-5" type="text"></div> </td>')
            button = $('<td><a class="button tiny addButton" id="addButton" onclick="addSquealModal()" data-open="channelSqueals">+</a>')
        }
        const numFollowers = $('<td>' + channel.followers + '</td>')
        const numSqueals = $('<td>' + channel.numPost + '</td>')
        const mutable = $('<td>'+channel.isUnmuteable+'</td>')
        const channelID=$('<td>'+channel._id+'</td>')
        const closeRow = $('</tr>')

        row.append([name,admin,desc,numFollowers,numSqueals,mutable,button,channelID])
        table.append([row,closeRow])

    }
}

modificUser = async (tbody, username)=>{
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
        if (element.value !== 0){
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
        if ((index+1) % 3 === 0 && newCredit.username){
            newUserInfo.push(newCredit)
            newCredit ={
                username : undefined,
                daily : 0,
                weekly : 0,
                monthly : 0
            }

        }

    })
    if (newUserInfo.length!== 0) {
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify(newUserInfo),
            dataType: "json",
            method: "PATCH",
            url: BaseUrl + 'updateUser'
        }).done((res) => {
            alert( 'Modifica eseguita su : '+res)
            reStamp('usersPanel')
        })

    }


}

modificSqueal = async (tbody)=>{
    const inputs = tbody.find('input')
    const ids= tbody.find("td[id='squealID']")
    // const checkbox = tbody.find('td[id='']')
    var squealIndex
    var newSquealInfo = []
    var newInfos = {
        squealID : undefined,
        newRecipients:[],
        visitNumber : 0,
        likeNumber : 0,
        dislikeNumber : 0,
        automatic:false
    }

    inputs.each((index,element)=>{
        // 判断 input 表格有没有被更改
        if (element.value != 0  ||  element.value){
            squealIndex = parseInt(index/5)

            if (!newInfos.squealID){
                newInfos.squealID=ids[squealIndex].innerHTML
            }

            switch ((index+1) % 5){
                case 1:
                   newInfos.newRecipients = element.value.split(',')
                    break;
                case 2 :
                    newInfos.visitNumber=(element.value!=0? element.value:0)

                    break;
                case 3:

                    newInfos.likeNumber=(element.value!=0? element.value:0)

                    break;
                case 4:

                    newInfos.dislikeNumber=(element.value!=0? element.value:0)

                    break;
                case 0:
                    newInfos.automatic = (element.checked)
            }

        }

        // 每input数量 等于0 所以等于最后一个 且username存在， 那就push这个用户
        if ((index+1) % 5 == 0 && newInfos.squealID){
            newSquealInfo.push(newInfos)
            newInfos = {
                squealID : undefined,
                newRecipients: [],
                visitNumber : 0,
                likeNumber : 0,
                dislikeNumber : 0,
                automatic: false
            }

        }


    })
    if (newSquealInfo.length!= 0) {
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify(newSquealInfo),
            dataType: "json",
            method: "PATCH",
            url: BaseUrl + 'updateSqueal'
        }).done((res) => {
            alert( 'Modifica eseguita')
            reStamp('squealPanel')
        })

    }


}

modificOfficial = async (tbody)=>{
    var updateChannel=[]
    var newDescription = {
        channelName : undefined,
        description:undefined
    }

    $('#officialTable > tr').each(async (index,tr)=>{
        const newDesc = $(tr).find("input").val()
        if (newDesc){
            newDescription.channelName = $(tr).find("td[id='name']").text()
            newDescription.description = newDesc
            updateChannel.push(newDescription)
        }
    })

    if(updateChannel.length!==0){
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify(updateChannel),
            dataType: "json",
            method: "PATCH",
            url: BaseUrl + 'updateChannelOff'
        }).done((res) => {
            alert( 'Modifica eseguita su : ' + res)
            reStamp('officialPanel')

        })
    }



}

modRegisterUserType =  (type)=>{
    var tipo=undefined
    switch (type) {
        case 'Normale':
            tipo = 'nor'
            break;
        case 'Moderatore':
            tipo = 'mod'
            break;
        case 'SMM':
            tipo = 'smm'
            break;
        case 'VIP':
            tipo = 'vip'


    }
    return tipo
}

showFiltPage= async (table)=>{
    switch (table) {
        case 'userTable' :
           const userFilter = {
                showNumber : parseInt($('#showUserNumber').val()),
                filterName :$('#filtName').val(),
                filtRule : $('#popFilterRule').val(),
                filtPop : parseInt($('#popFilterNumber').val()),
                filtType: modRegisterUserType($('#filtType').val())
            }
            $.get(BaseUrl + 'get_filt_users', {userFilter}, async (res) => {
                await getUsers(res, $('#'+table))
            })
            break;

        case 'squealTable':

            const  squealFilter = {
                showNumber : parseInt($('#showSquealNumber').val()),
                autor : $('#filtAutor').val(),
                recipient : $('#filtRep').val(),
                endTime : $('#filtEndTime').val()
            }

            $.get(BaseUrl + 'allSqueals', {squealFilter},async (res) => {
                await getSqueals(res, $('#'+table))
            })

            break;

        // case 'officialTable':

        //     $.get(BaseUrl + 'allChannelO', {showNumber : $('#showOffNumber').val()},async (res) => {
        //         await getChannel(res, $('#officialTable'))
        //     })
        //     break;
        // case 'privateTable':

        //
        //     $.get(BaseUrl + 'allChannelP',{showNumber : $('#showPrivNumber').val()}, async (res) => {
        //         await getChannel(res, $('#privateTable'))
        //     })
        //     break;
    }
}
$(document).ready(()=>{

    $(document).foundation()
    reStamp('userTable')

    $('#reset').click( ()=>{
        $('input').prop({
            value : ''
        })
    })

    $('.refreshpage').click(()=>{
        const panel = $('.visible').attr('id')
        reStamp(panel)
    })
    // aprire squeal che appartengono cahnnel
    $('#channelSqueals').click(()=>{
        // const table = $('#noChannelSquealTable')

        $.get(BaseUrl + 'noChannelSqueals',async (res) => {
            await getNoChSqueals(res, $('#noChannelSquealTable'))
        })
    })

    $('#addToChannel').click(()=> {
        const channelName = $('#channelName').text()
        var addSquealsID = []
        $('#noChannelSquealTable > tr').each(async (index,tr)=>{
            if ($(tr).find('input').prop('checked')){
                console.log($(tr).find("td[id='addSquealID']").text())
                addSquealsID.push($(tr).find("td[id='addSquealID']").text())
            }
        })
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({squealIDs: addSquealsID, channelName: channelName}),
            dataType: "json",
            method: "PATCH",
            url: BaseUrl + 'addSquealChannel'
        }).always((res) => {
            $.get(BaseUrl + 'channelSqueal_get',{channelName : channelName}, async (res) => {
                $('#addSqueal').foundation('close')
                $.get(BaseUrl + 'channelSqueal_get',{channelName : channelName}, async (res) => {
                    await getChannelSqueals(res, $('#channelSquealTable'))
                })
            })
        })
    })

    $('#EliminaSquealChannel').click(()=> {
        const squealID = $('#addedSquealID').val()
        const channelName = $('#channelName').text()
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({squealID: squealID}),
            dataType: "json",
            method: "PATCH",
            url: BaseUrl + 'delSquealChannel'
        }).done((res) => {
            $.get(BaseUrl + 'channelSqueal_get',{channelName : channelName}, async (res) => {
                await getChannelSqueals(res, $('#channelSquealTable'))
            })
        })
    })



    $('#change').click(()=>{

        const tbody =  $('.visible').find('tbody')
        const username = tbody.find("td[id='username']")

        switch (tbody.attr('id')) {
            case 'userTable':
                modificUser(tbody,username)
                break;
            case 'squealTable':
                modificSqueal(tbody)
                break;
            case 'officialTable':
                modificOfficial(tbody)
                break;
            case 'privateTable':
                ModificPrivate(tbody,username)
                break;
        }
    })

    $('#modRegister').click(()=>{
        const type = modRegisterUserType($('#modRegType').val())
        const newUser = {
             username : $('#modRegUsername').val().toLowerCase(),
             password : $('#modRegPassword').val().toLowerCase(),
             userType : type,
             creditInit : $('#modRegCredit').val()
        }
        if (newUser.username && newUser.password && newUser.creditInit){
            $.post(BaseUrl + 'register',{
                username:newUser.username,
                password:newUser.password,
                userType:newUser.userType,
                creditInit: newUser.creditInit
            },async (res)=>{
                alert('Registrazione effettuata')
                $('#creatUserForm').foundation('close')
                reStamp('usersPanel')

            })

        }
    })

    $('#modCreatOff').click(()=>{
        const newChannel ={
            name : $('#modOffName').val().toUpperCase(),
            desc : $('#modOffDesc').val(),
            type:$('#modOffType').val(),
        }

        if (newChannel.name && newChannel.desc){
            $.post(BaseUrl + 'createCh',{
                name: '§' + newChannel.name ,
                type : newChannel.type,
                desc:newChannel.desc
            }, async (res)=>{
                $('#creatChannelForm').foundation('close')
                reStamp('officialPanel')
            })
        }
    })

    $('#delChannel').click(()=>{
        const offFilter ={
            showNumber : parseInt($('#showOffNumber').val()),
            pageNum:  $('.current').text()
        }
        $.get(BaseUrl + 'allChannelO', {offFilter},async (res) => {
            await getDelChannel(res.data, $('#delChannelTable'))
        })

        $('#delChButton').click(()=>{
            var delChIDs = []
            $('#delChannelTable > tr').each(async (index,tr)=>{
                if ($(tr).find('input').prop('checked')){
                    delChIDs.push($(tr).find("td[id='delChannelID']").text())
                }
            })

            if (delChIDs.length !== 0){
                $.ajax({
                    contentType: "application/json",
                    data: JSON.stringify(delChIDs),
                    dataType: "json",
                    method: "PUT",
                    url: BaseUrl + 'deleteChannel'
                }).done((res) => {
                    alert( 'I seguenti CANALI vengono elieminati :'+res)
                    $('#deleteCh').foundation('close')
                    reStamp('officialPanel')

                })




            }


        })
    })

    // $('#delChannelTable > tr').each(async (index,tr)=>{
    //     tr.click(async ()=>{
    //         $(tr).find("input").prop('checked',true)
    //     })
    // })

    $('.filterButton').click(async ()=>{
        const tbody = $('.visible').find('tbody')
        tbody.text('')
        reStamp(tbody.attr('id'))

        // user 页面需要再改一下
    })

    $('.cleanFiltButton').click(async (e)=>{
        const filterField = $(e.target).parent().parent()
        filterField.find('input').each(async (index,input)=>{
            if (input.type ==='text'){
                input.value = ''
            }else {
                input.value = 0
            }
        })
        filterField.find('select').each(async (index,select)=>{
            select.selectedIndex = 0
        })
    })

    $('.pagination-next').click(async (e)=>{
        if ( !$(e.target).hasClass('disabled')){
            const tbody = $('.visible').find('tbody')
            const currentPageNum = parseInt($('.current').text())+1
            $('.current').text(currentPageNum)
            showPage(tbody.attr('id'))
        }

    })

    $('.pagination-previous').click(async (e)=>{
        if ( !$(e.target).hasClass('disabled')) {
            const tbody = $('.visible').find('tbody')
            const currentPageNum = parseInt($('.current').text()) - 1
            $('.current').text(currentPageNum)
            showPage(tbody.attr('id'))
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

        reStamp(clicked.attr('id'))

        // 切换显示画面
          $('.visible').removeClass('visible').addClass('hide')

          $(content).removeClass('hide').addClass('visible')



    })

})


