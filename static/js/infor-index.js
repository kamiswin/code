$(document).ready(function (){
    var __location = window.location.hash.split("=")[1];
    changeContent(__location);
    $(".remind-li").filter(function (){
        var x = $(this).attr("data-url");
        return x == __location;
    }).addClass("active-remind-li");

    $(".list").filter(function (){
        var x = $(this).attr("data-url");
        return x == __location;
    }).addClass("listClick");

    $("#content").click(function (){
        $(".getResult").css("display","none");
    });

    $(".remind-li").click(function(){
        var __id = $(this).attr("data-url");
        window.location.hash = "#id="+__id;
        $(".remind-li").removeClass("active-remind-li");
        $(this).addClass("active-remind-li");
        $("h2").html($(this).text());
        changeContent(__id);
    });

    function changeContent(__id){
        switch(__id){
            case '0' : $(".settings").remove();showTakeMe();break;
            case '1' : $(".settings").remove();showPerson();break;
            case '2' : $(".settings").remove();break;
            case '3' : $(".settings").remove();break;
            case '4' : $(".settings").remove();getLib();break;
            case '5' : $(".settings").remove();break;
            case '6' : $(".detail-uls").html('');setting(); break;
        }
    }

    function showTakeMe(){
        $.ajax({
            type : "POST",
            data : {},
            url : "http://121.199.47.141/check/get_i_pay_attention/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    var html = '',
                        infor = data.info;
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li">'+infor[i].username+'</li>'
                    }

                    $(".detail-uls").html(html);
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }

    function showPerson(){
        $.ajax({
            type : "POST",
            data : {},
            url : "http://121.199.47.141/check/get_pay_attention_me/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    var html = '',
                        infor = data.info;
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li">'+infor[i].username+'</li>'
                    }

                    $(".detail-uls").html(html);                    
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    }

    function setting(){
        var __set = $('<div class="settings">\
                            <div class="head"><img class="headImg" src="/static/img/myface.jpg"></div>\
                            <input type="password" class="pass"  placeholder="请输入原始密码"/>\
                            <input type="password" class="passAg" placeholder="请输入要修改的密码" />\
                            <input type="password" class="passAgs" placeholder="请确认要修改的密码" />\
                            <button class="submitButton">确认修改</button>\
                    </div>\
            ');
        $(".detail").append(__set);
    }

    $(".detail").on("mouseenter",".head",function (){
        var __dom = $("<div class='coverHead'>点击修改头像</div>");
        $(this).append(__dom);
    }).on("mouseleave",".head",function (){
        $(".coverHead").remove();
    })

    function getLib(){
        $.ajax({
            type : "POST",
            data : {},
            url  : "http://121.199.47.141/check/get_user_map/",
            success : function (data){
                //console.log(data);
                if(data.flag == "succeed"){
                    var html = '';
                    var infor = data.info;
                    for(var i = 0; i < infor.length; i++){
                        html += '<li class="detail-li-lib"><img src="'+(infor[i].image ? infor[i].image : "/static/img/versib.png")+'" alt="仓库" width="178" height="100" /><p>创建时间:'+infor[i].map_time+'</p><p>'+infor[i].map_name+'</p><p><span class="glyphicon glyphicon-trash del" data-id="'+infor[i].map_id+'">删除</span><span class="glyphicon glyphicon-edit editThat" data-id="'+infor[i].map_id+'">编辑</span></p></li>'
                    }

                    html += '<li class="detail-li-lib addLi">+</li>';

                    $(".detail-uls").html(html);
                }
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        });
    }

    $(".detail").on('click','.addLi',function (){

        window.location.href = '/kmap/edit/';

    }).on('click','.editThat',function (){

        var __map_id = $(this).attr("data-id");
        window.location.href = '/kmap/edit/#mapid='+__map_id;

    }).on('click','.del',function (){

        var __map_id = $(this).attr("data-id");     

    })

    setTimeout(function(){
        $(".navbar-li").removeClass("active");
    },500);

    $(".detail-li-block").on('mouseenter',function (){

        $(this).find("div").animate({top:"0%",height:"100%"},200);

    }).on("mouseleave",function (){
        
        $(this).find("div").animate({top:"85%",height:"15%"},100);

    });

    $("h2").html($(".active-remind-li").text());    

    $(".detail").on('click','button',function (){
        var __pass = $(".pass").val(),
            __passA = $(".passAg").val(),
            __passAg = $(".passAgs").val();
        if(!__pass || !__passA || !__passAg){
            if(!$(this).hasClass('wrong')){
                $(".settings").append($('<p class="information">输入信息有误，请检查</p>'));
                $(this).addClass('wrong');
            }else{
                $('.information').html('输入信息有误，请检查');
            }
            return false;
        }
        if(__passA != __passAg){
            if(!$(this).hasClass('wrong')){
                $(".settings").append($('<p class="information">密码不一致</p>'));
                $(this).addClass('wrong');
            }else{
                $('.information').html('密码不一致');
            }
            return false;
        }
        //有一点点小问题后台sesion跨域问题，以和亮哥商讨过
        $.ajax({
            type : "POST",
            data : {old_pass : __pass, new_pass : __passA},
            url  : "http://121.199.47.141/check/update_pass/",
            success : function (data){
                console.log(data);
            },
            error : function (data){
                console.log(data);
            },
            dataType : "json"
        })
    });
});