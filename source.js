var _vipexam = null;
var _veuser = {code:"",user:{"account":"f46354b31ec64c9c96919e12a9bbd610","username":"游客（受限）",collegename:"北京大学"}};
var _jspath = "";
var _img_teacher = "http://video.vipexam.net/img/vepic/teacher/";
var _img_videos = "http://video.vipexam.net/img/vepic/videoimg/";
var _videoplay = "http://video.vipexam.net/";
var _version = new Date().getTime();
var _rangImg = "http://rang.vipexam.org/images/";
var _rangSound = "http://rang.vipexam.org/Sound/";
layui.extend({
	cookie:'{/}'+_jspath+'/Contents/js/cookie'
}).use(['form','layer','jquery','cookie'], function(){
	var $ = layui.jquery,
		flow = layui.flow,
		carousel = layui.carousel,
		form = layui.form,
		layer = layui.layer,
		cookie = layui.cookie;
	_vipexam = $.cookie("vipexam");
	function RequestJson(url, params, callback) {
		var _idx = layer.load(1);
        $.ajax({ type: "post", data: params, url: url, dataType: "json", global: false, success: function (data) { callback && callback(data); }, complete: function () { layer.close(_idx); },error:function (XMLHttpRequest, textStatus, errorThrown){layer.close(_idx);} });
    }
	var _storage = !!_vipexam ? JSON.parse(_vipexam) : _veuser;
	var _vid = _storage.user.account;
	var _ip = '';
	var _flag = false;
	var ipValidates = function(){	
		var _test = false;
		RequestJson("user/verifyIP.action",{ account : _vid},function(data){
			if(data.code == "1"){
				if(_vid != "f46354b31ec64c9c96919e12a9bbd610"){
					$("#person").text(_vid);
					$("#rtbox").hide();
					$("#rtbox2").show();
				}else{
					_veuser.user.collegename = !!data.collegename ? data.collegename : data.user.collegename;
					$.cookie("vipexam", JSON.stringify(_veuser), { path: '/', expires: 7});
				}
				_flag = true;
			}else{
				_ip = data.IP;
				if(document.location.toString().indexOf("login2.html") < 0){
					layer.open({type:1,title:false,closeBtn: false,area: '40%;',shade: 0.1,id: 'iplimit',scrollbar:false,
						content: "<div class='iplimit'>亲！非常抱歉。<br>您的IP地址："+_ip+" 不在系统授权范围内，请联系图书馆老师进行添加 ^_^</div>",
						btnAlign: 'c',btn: '我知道了！',
						yes:function(index,layero){
							document.location = "login2.html";
						}
					});
				}
			}
			
		});
	}
	ipValidates();
	var loadLogo = function(){
		$.post("logo/collegeLogo.action",function(data){
			if(data.code == "1"){
				$(".ve-logo").prepend("<img src='"+data.collegeLogo+"?v="+_version+"' style='float:left;margin:10px 10px 10px 0;max-width:250px;' alt/>");
				$(".ve-search").removeClass("logo_hide").addClass("logo_show");
			}else{
				$(".ve-search").removeClass("logo_show").addClass("logo_hide");
			}
		});
	}
	loadLogo();
	$("#regist").on('click',function(){
		document.location = "register.html";
	});
	$("#signin").on('click',function(){
		document.location = "login2.html";
	});
	$("#signout").on("click",function(){
		$.cookie("vipexam", null, { path: '/', expires: -1});
		$("#rtbox").show();
		$("#rtbox2").hide();
	});
	$("#person").on("click",function(){
		document.location = "Personal_center.html";
	});
	form.on('submit(frmLogin)', function(data){
		_vid = $("#username").val();
		ipValidates();
		RequestJson("user/login.action",{account:$("#username").val(),password:$("#password").val()},function(data){
			if(data.code == "1"){
				if(_flag){
					$.cookie("vipexam", JSON.stringify(data), {  path: '/', expires: 7});
					_vipexam = $.cookie("vipexam");
					document.location = "index.html";
				}else{
					layer.msg("抱歉！IP:"+_ip+" 不在系统授权范围内！",{icon:2});
				}
			}else{
				layer.msg(data.msg,{icon:2});
			}
		});
		return false;
	});
	window.isLogout = function(n,msg){
		if(n == "9"){
			layer.msg("该账号已在其他设备上登录，请重新登录！",{icon:1,time:3000},function(){document.location = "login2.html";});
		}else{
			layer.msg(msg,{icon:2});
		}
	}
	
	$(".ve-search i").on("click",function(data){
		var _inkey = $(".ve-search input").val();
		if(_inkey == ""){
			layer.msg("请输入检索关键字");
		}else{
			document.location = "all_search.html?keys="+_inkey;
		}
	});
});