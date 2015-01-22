~function(window, $, Parse) {
	Parse.initialize("44ggdPcNprzQ6jG9ZDjC9x1R4mWNwc9ZjU7TJANc", "pxEnu8JIvUtuggH5pq0J13Ci2sHyNFWRKQ5JrLIr");
	/*全局cache*/
	var cache = {
		checkResult: '',
		voiceId: '',
		networkType: '',
		latitude:0,
		longitude:0
	};

	/*Parse统计*/
	var count = {
		init: function() {
			var MenuShareAppMessage = Parse.Object.extend("MenuShareAppMessage");
			var MenuShareTimeline = Parse.Object.extend("MenuShareTimeline");
			var Location = Parse.Object.extend("Location");
			this.menuShareAppMessage = new MenuShareAppMessage();
			this.menuShareTimeline = new MenuShareTimeline();
			this.location = new Location();
		},
		saveMenuShareAppMessage: function(msg) {
			if(msg == 'success') {
				this.menuShareAppMessage.increment("successCount");
			}else if(msg == 'trigger') {
				this.menuShareAppMessage.increment("triggerCount");
			}else if(msg == 'cancel') {
				this.menuShareAppMessage.increment("cancelCount");
			}else if(msg == 'fail') {
				this.menuShareAppMessage.increment("failCount");
			}
			
			this.menuShareAppMessage.save();
		},
		saveMenuShareTimeline: function(msg) {
			if(msg == 'success') {
				this.menuShareTimeline.increment("successCount");
			}else if(msg == 'trigger') {
				this.menuShareTimeline.increment("triggerCount");
			}else if(msg == 'cancel') {
				this.menuShareTimeline.increment("cancelCount");
			}else if(msg == 'fail') {
				this.menuShareTimeline.increment("failCount");
			}
			this.menuShareTimeline.save();
		},
		saveLocation: function(data) {
			this.location.save(data, {
				success: function() {
					console.log('呵呵，偷偷获取了你的地理位置哟');
				},
				error: function() {
					console.log('哦no');
				}
			});
		}
	};


	var weixinJsconfig = {
	    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: 'wx6a1a4aaf616849bc', // 必填，公众号的唯一标识
	    timestamp: '<%=timestamp%>', // 必填，生成签名的时间戳
	    nonceStr: '<%=nonceStr%>', // 必填，生成签名的随机串
	    signature: '<%=signature%>',// 必填，签名，见附录1
	    jsApiList: [
	        'checkJsApi',
	        'onMenuShareTimeline',
	        'onMenuShareAppMessage',
	        'onMenuShareQQ',
	        'onMenuShareWeibo',
	        'hideMenuItems',
	        'showMenuItems',
	        'hideAllNonBaseMenuItem',
	        'showAllNonBaseMenuItem',
	        'translateVoice',
	        'startRecord',
	        'stopRecord',
	        'onRecordEnd',
	        'playVoice',
	        'pauseVoice',
	        'stopVoice',
	        'uploadVoice',
	        'downloadVoice',
	        'chooseImage',
	        'previewImage',
	        'uploadImage',
	        'downloadImage',
	        'getNetworkType',
	        'openLocation',
	        'getLocation',
	        'hideOptionMenu',
	        'showOptionMenu',
	        'closeWindow',
	        'scanQRCode',
	        'chooseWXPay',
	        'openProductSpecificView',
	        'addCard',
	        'chooseCard',
	        'openCard'

	    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	};
	wx.config(weixinJsconfig);

	var View = Parse.View.extend({
		el: '#impress',
		events: {
			'webkitAnimationEnd #step-3 .method': function(e) {$(e.target).removeClass('animated bounceIn')},
			'click #step-4 .banner':'step4Banner',
			'webkitAnimationEnd #step-4 .banner':'step4AniEnd',
			'click #its .j-checkapi': 'checkapi',
			'click #step-7 button': 'step7ChooseImg',
			'click #step-8 .preview': 'step8Preview',
			'click #step-8 .upload': 'step8Upload',
			'click .upload-content': function(e) {$(e.target).hide();},
			'touchstart .start-record': function(e) {e.preventDefault();wx.startRecord();},
			'touchend .start-record': 'endRecord',
			'click .play-voice': 'playVoice',
			'click .pause-voice': 'pauseVoice',
			'click .stop-voice': 'stopVoice',
			'click .translate-voice': 'translateVoice',
			'click .net-work': 'checkNetWork',
			'click .open-location': 'openLocation',
			'click .j-scan': 'qrScan',
		},
		initialize: function() {
			count.init();
			this.render();

		},
		render: function() {
			var self = this;
			$(document).on("impress:stepenter", function(event) {
				$('#step-2 li').hide();
				$('#step-3 .method').hide();
				$('#step-4 .banner').hide();
				$('#step-9 b').removeClass('animated rollIn');
				$('#step-9 b').css('visibility','hidden');
				if(event.target.id == 'step-2') {
					$('#step-2 li').show();	
					$('#step-2 li:nth-child(odd)').addClass('bounceInLeft');
					$('#step-2 li:nth-child(even)').addClass('bounceInRight');
				}else if(event.target.id == 'step-3') {
					$('#step-3 .method').show();
					$('#step-3 .method').addClass('animated bounceIn');
				}else if(event.target.id == 'step-4') {
					$('#step-4 .banner').show();
					$('#step-4 .banner').addClass('animated bounceInDown');
				}else if(event.target.id == 'its') {
					self.showCheckResult(cache.checkResult);
				}else if(event.target.id == 'step-9') {
					$('#step-9 b').css('visibility','visible');
					$('#step-9 b').addClass('animated rollIn');
				}
			});

			/*weixin ready*/
			wx.ready(function () {
				wx.checkJsApi({
				    jsApiList: weixinJsconfig.jsApiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
				    success: function(res) {
				    	if(res && res.checkResult) {
				    		cache.checkResult = res.checkResult;
				    		self.showCheckResult(cache.checkResult);
				    	}
				    }   
			    });
			    wx.onMenuShareAppMessage({
			      title: '去哪儿网无线touch组',
			      desc: '去哪儿无线touch-微信JS-SDK API调研~~',
			      imgUrl: 'http://www.fenghongyu.com/images/ppt/qunartouch.png',
			      trigger: function (res) {
			        count.saveMenuShareAppMessage('trigger');
			      },
			      success: function (res) {
			        count.saveMenuShareAppMessage('success');
			      },
			      cancel: function (res) {
			        count.saveMenuShareAppMessage('cancel');
			      },
			      fail: function (res) {
			        count.saveMenuShareAppMessage('fail');
			      }
			    });

			    wx.onMenuShareTimeline({
				    title: '去哪儿网', // 分享标题
				    link: 'http://touch.qunar.com', // 分享链接
				    imgUrl: 'http://www.fenghongyu.com/images/ppt/qunartouch.png', // 分享图标
				    success: function () { 
				        count.saveMenuShareTimeline('success');
				    },
				    cancel: function () { 
				        count.saveMenuShareTimeline('cancel');
				    }
				});

				wx.onMenuShareQQ({
				    title: '去哪儿网无线touch组', // 分享标题
				    desc: '去哪儿无线touch-微信JS-SDK API调研~~', // 分享描述
				    imgUrl: 'http://www.fenghongyu.com/images/ppt/qunartouch.png' // 分享图标
				});

			    wx.getLocation({
				    success: function (res) {
				    	cache.latitude = res.latitude;
				    	cache.longitude = res.longitude;
				    	count.saveLocation(res);
				    },
				    cancel: function() {
				    	count.saveLocation({usercancel: 1});
				    }
				});

				wx.onVoicePlayEnd({
					success: function (res) {
						$('.play-voice').text('重播');
			        	//var localId = res.localId; // 返回音频的本地ID
			    	}
				});

				/*wx.onVoiceRecordEnd({
				    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
				    complete: function (res) {
				        cache.voiceId = res.localId; 
				    }
				});*/

				wx.getNetworkType({
				    success: function (res) {
				        cache.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
				        $('#step-12 .net-work').text(cache.networkType);
				    }
				});
			});

			wx.error(function (res) {
		  		alert(res.errMsg);
			});
		},
		step4Banner: function(e) {
			$(e.target).addClass('bounceOutUp');
		},
		step4AniEnd: function(e) {
			var $target = $(e.target);
			if($target.hasClass('bounceOutUp')) {
				$target.removeClass('bounceOutUp');
				$target.hide();
			}
		},
		checkapi: function(e) {
			$(e.target).addClass('animated bounceOutUp');
		},

		step7ChooseImg: function() {
			wx.chooseImage({
			    success: function (res) {
			        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			        if(localIds.length > 0) {
			        	var list = '';
			        	for(var i = 0; i < localIds.length; i++) {
			        		list += ('<img src="'+ localIds[i] +'"/>');
			        	}
			        	$('#step-7 .pic-box').html(list);
			        }
			    }
			});
		},
		step8Preview: function() {
			wx.previewImage({
			    current: 'http://www.fenghongyu.com/images/ppt/threedoggy.jpg', // 当前显示的图片链接
			    urls: [
			    	'http://www.fenghongyu.com/images/ppt/threedoggy.jpg',
			    	'http://www.fenghongyu.com/images/ppt/qunartouch.png'		    
			    ] // 需要预览的图片链接列表
			});
		},
		step8Upload: function() {
			$('.upload-content').show();
		},
		endRecord: function(e) {
			wx.stopRecord({
			    success: function (res) {
			    	alert(JSON.stringfy(res));
			        cache.voiceId = res.localId;
			        $('#step-11 .mask-white').text(cache.voiceId);
			    },
			    fail: function() {
			    	alert('录音失败额');
			    }
			});
		},
		playVoice: function(e) {
			e.preventDefault();
			wx.playVoice({
	    		localId: cache.voiceId // 需要播放的音频的本地ID，由stopRecord接口获得
			});
		},
		pauseVoice: function() {
			wx.pauseVoice({
			    localId: cache.voiceId // 需要暂停的音频的本地ID，由stopRecord接口获得
			});
		},
		stopVoice: function() {
			wx.stopVoice({
			    localId: cache.voiceId // 需要暂停的音频的本地ID，由stopRecord接口获得
			});
		},
		translateVoice: function() {
			wx.translateVoice({
			   localId: cache.voiceId, // 需要识别的音频的本地Id，由录音相关接口获得
			    isShowProgressTips: 1, // 默认为1，显示进度提示
			    success: function (res) {
			        $('#step-11 .mask-white').text(res.translateResult); // 语音识别的结果
			    }
			});
		},
		checkNetWork: function(e) {
			e.preventDefault();
			if(cache.networkType == 'wifi') {
				$('.net-video').attr('src', 'http://www.fenghongyu.com/images/ppt/nimendehongyangdada.mp4');
			}else {
				$('.net-video').attr('src', 'http://www.w3school.com.cn/i/movie.ogg');
			}
		},
		openLocation: function(e) {
			e.preventDefault();
			wx.openLocation({
			    latitude: cache.latitude, // 纬度，浮点数，范围为90 ~ -90
			    longitude: cache.longitude, // 经度，浮点数，范围为180 ~ -180。
			    name: '', // 位置名
			    address: '', // 地址详情说明
			    scale: 20, // 地图缩放级别,整形值,范围从1~28。默认为最大
			    infoUrl: 'http://touch.qunar.com' // 在查看位置界面底部显示的超链接,可点击跳转
			});
		},
		qrScan: function(e) {
			wx.scanQRCode({
			    desc: '扫扫看有什么',
			    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			    success: function (res) {
			    	//alert(res.resultStr);// 当needResult 为 1 时，扫码返回的结果
				}
			});
		},
		showCheckResult: function (checkResult) {
		if(checkResult) {
			var list = '';
			for(var i in checkResult) {
				list += '<li class="'+ checkResult[i]  +'"">' + i + '</li>';
			}
			$('#its ul').html(list);
		}else {
			var $img = $('<img>');
			$('#its').html('<p class="j-checkapi mask">基础接口：请使用微信扫码查看API支持情况(checkJsApi)</p>');
			$img.attr('src', 'http://www.fenghongyu.com/images/ppt/qrcode.png');
			$('#its').append($img);
		}
	}
	});
	new View();
}(window, jQuery, Parse);