// ==UserScript==
// @name         vipexam no ip limit
// @namespace    https://github.com/maiersk
// @version      0.1
// @description  中科vipexam no ip limit
// @author       ABTTEX
// @match        http://lib.vipexam.org/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    var _vipexam = null;

    layui.use(['form','layer','jquery','cookie'], function(){
        var $ = layui.jquery,
            form = layui.form,
            layer = layui.layer,
            cookie = layui.cookie;

        _vipexam = $.cookie("vipexam");
        var _storage = !!_vipexam ? JSON.parse(_vipexam) : _veuser;
        var _vid = _storage.user.account;

        function RequestJson(url, params, callback) {
            var _idx = layer.load(1);
            $.ajax({ type: "post", data: params, url: url, dataType: "json", global: false, success: function (data) { callback && callback(data); }, complete: function () { layer.close(_idx); },error:function (XMLHttpRequest, textStatus, errorThrown){layer.close(_idx);} });
        }

        //代替原有登录function
        form.on('submit(crashlogin)', function(data){
            _vid = $("#username").val();
            //ipValidates();
            RequestJson("user/login.action",{account:$("#username").val(),password:$("#password").val()},function(data){
                if(data.code == "1"){
                    //if(_flag){
                        //alert(JSON.stringify(data))
                        $.cookie("vipexam", JSON.stringify(data), {  path: '/', expires: 7});
                        _vipexam = $.cookie("vipexam");
                        document.location = "index.html";
                    //}else{
                    //    layer.msg("抱歉！IP:"+_ip+" 不在系统授权范围内！",{icon:2});
                    //}
                }else{
                    layer.msg(data.msg,{icon:2});
                }
            });
            return false;
        });

        //关闭ip问题弹窗
        $(function(){
            setTimeout(function () {
                layer.closeAll();
            }, 350);
        });

        //显示已登录信息
        if(_vid != "f46354b31ec64c9c96919e12a9bbd610"){
            $("#person").text(_vid);
            $("#rtbox").hide();
            $("#rtbox2").show();
        }
    });

    $(document).ready(function() {

        var div = $(".layui-form-item-center")
        var buthtml = '<input type="button" id="crashlogin" lay-submit lay-filter="crashlogin" value="crashlogin" />';
        //var buthtml = '<input type="button" id="crashlogin" value="crashlogin" />';
        div.append(buthtml);

        // var but = $("#crashlogin")

        // _vipexam = ""

        // but.click(function(){
        //     alert(JSON.stringify({account:$("#username").val(),password:$("#password").val()}))
        //     $.ajax({
        //         type: "post",
        //         data: {account:$("#username").val(),password:$("#password").val()},
        //         url: "user/login.action",
        //         dataType: "json",
        //         global: false,
        //         success: function (data) {
        //             if(data.code == "1"){

        //                 alert(JSON.stringify(data))
        //                 $.cookie("vipexam", JSON.stringify(data), {  path: '/', expires: 7});
        //                 _vipexam = $.cookie("vipexam");
        //                 document.location = "index.html";


        //             }else{
        //                 layer.msg(data.msg,{icon:2});
        //             }
        //         },
        //         complete: function () {   },
        //         error:function (XMLHttpRequest, textStatus, errorThrown){ }
        //     });
        // })

    })

})();