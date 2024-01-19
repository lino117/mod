
const BaseUrl = 'http://localhost:3000/social/'

addSqueal = async ()=>{

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
            const username = $('<td id="username">' + squeal.sender + '</td>')
            const contenuto = $('<td>' + squeal.body + '</td>')
            const destinatari = $('<td>' + squeal.recipients + '</td>')
            const impression = $('<td>' + squeal.reaction.impression+'</td>')
            const like = $('<td>' + squeal.reaction.like+'</td>')
            const dislike = $('<td>' + squeal.reaction.dislike+'</td>')
            const data = $('<td>' + squeal.dateTime + '</td>')
            const squealChannel = $('<td>'+squeal.squealerChannels+'</td>')
            var automatic
            if (squeal.automaticMessage) {
                automatic = $('<td><input type="checkbox" id="automatic" checked></td>')
            } else {
                automatic = $('<td><input type="checkbox" id="automatic" ></td>')
            }
            const squealId = $('<td id="squealID">' + squeal._id + '</td>')
            const closeRow = $('</tr>')
            row.append([username, contenuto, destinatari, impression, like, dislike, data, automatic, squealId])
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

getSqueals = async (res,table,squealID)=>{
    for (const squeal of res) {
        const row = $('<tr>')
        const username = $('<td id="username">' + squeal.sender + '</td>')
        const contenuto = $('<td>' + squeal.body + '</td>')
        const numTdHead = '<td class="grid-container"><div class="grid-x"> <span class="cell large-5"> '
        const numTdFeet = '</span><input class="cell large-5" value="0" ></div></td>'
        const destinatari = $(numTdHead+squeal.recipients +'</span><input class="cell large-5" type="text" value="'+squeal.recipients+'"></div> </td>')
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
        const admin = $('<td>' + channel.admin + '</td>')
        var desc
        var button
        if (channel.typeOf==='private'){
            desc = $('<td>' + channel.description + '</td>')
            button =  $('<td class="hide"><a class="button tiny"><i class="fi-plus"></i></a>')
        }else{
            desc= $('<td class="grid-container"><div class="grid-x"> <p class="cell large-5" id="channelDescription">'+channel.description+'</p><input class="cell large-5" type="text"></div> </td>')
            button = $('<td><a class="button tiny addButton" id="addButton" onclick="addSqueal()" data-open="channelSqueals">+</a>')
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
            showPage('usersPanel')
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
                    // console.log('impression',element.value)
                    newInfos.visitNumber=(element.value!=0? element.value:0)

                    break;
                case 3:
                    // console.log('like',element.value)

                    newInfos.likeNumber=(element.value!=0? element.value:0)

                    break;
                case 4:
                    // console.log('dislike',element.value)

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
            showPage('squealsPanel')
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
            showPage('officialPanel')

        })
    }



}

showPage=async (showPage)=>{
    // 初始化 table主体
    $('tbody').text('')
    // 判断页面 并发送 请求
    switch (showPage) {
        case 'users' :
        case 'usersPanel':
            $.get(BaseUrl + 'get_all_users', {showNumber : $('#showUserNumber').val()}, async (res) => {
                await getUsers(res, $('#userTable'))
            })
            break;

        case 'squeals':
        case 'squealsPanel':
            $.get(BaseUrl + 'allSqueals', {showNumber : $('#showSquealNumber').val()},async (res) => {
                await getSqueals(res, $('#squealTable'))
            })
            break;

        case 'official':
        case 'officialPanel':
            $.get(BaseUrl + 'allChannelO', {showNumber : $('#showOffNumber').val()},async (res) => {
                await getChannel(res, $('#officialTable'))
            })
            break;
        case 'private':
        case 'privatePanel':

            $.get(BaseUrl + 'allChannelP',{showNumber : $('#showPrivNumber').val()}, async (res) => {
                await getChannel(res, $('#privateTable'))
            })
            break;
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
            const filter ={
                showNumber : parseInt($('#showUserNumber').val()),
                filterName :$('#filtName').val(),
                filtRule : $('#popFilterRule').val(),
                filtPop : parseInt($('#popFilterNumber').val()),
                filtType: modRegisterUserType($('#filtType').val())
            }
            $.get(BaseUrl + 'get_filt_users', {filter}, async (res) => {
                await getUsers(res, $('#'+table))
            })
            break;

        // case 'squealTable':

        //     $.get(BaseUrl + 'allSqueals', {showNumber : $('#showSquealNumber').val()},async (res) => {
        //         await getSqueals(res, $('#squealTable'))
        //     })
        //     break;
        //
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

    $.get(BaseUrl + 'get_all_users',{showNumber : $('#showUserNumber').val()}, async (res) => {

        await getUsers(res,$('#userTable'))

    })

    $('#reset').click( ()=>{
        $('input').prop({
            value : ''
        })
    })

    $('.refreshpage').click(()=>{
        const panel = $('.visible').attr('id')
        showPage(panel)
    })

    $('#AggiungiSquealChannel').click(()=> {
        const squealID = $('#addedSquealID').val()
        // location.reload()
        // const names = $('#officialTable').find("td[id='name']")
        // const index = $(elem.target).closest('tr').index()

        const channelName = $('#channelName').text()
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({squealID: squealID, channelName: channelName}),
            dataType: "json",
            method: "PATCH",
            url: BaseUrl + 'addSquealChannel'
        }).done((res) => {

            $.get(BaseUrl + 'channelSqueal_get',{channelName : channelName}, async (res) => {
                await getChannelSqueals(res, $('#channelSquealTable'))
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
                console.log('switch case')
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
        console.log(newUser.userType,'type qui')
        if (newUser.username && newUser.password && newUser.creditInit){
            $.post(BaseUrl + 'register',{
                username:newUser.username,
                password:newUser.password,
                userType:newUser.userType,
                creditInit: newUser.creditInit
            },async (res)=>{
                alert('Registrazione effettuata')
                $('#creatUserForm').foundation('close')
                showPage('usersPanel')

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
                showPage('officialPanel')
            })
        }
    })

    $('#delChannel').click(()=>{
        $.get(BaseUrl + 'allChannelO', {showNumber : $('#showOffNumber').val()},async (res) => {
            await getDelChannel(res, $('#delChannelTable'))
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
                    showPage('officialPanel')

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
        showFiltPage(tbody.attr('id'))
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
        showPage(clicked.attr('id'))
        // 切换显示画面
          $('.visible').removeClass('visible').addClass('hide')

          $(content).removeClass('hide').addClass('visible')



    })

})


