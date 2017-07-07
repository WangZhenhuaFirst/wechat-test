
function getQueryParams(qs) {
  qs = qs.split('+').join(' ');

  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

function saveShareLog(){
  $.post(
    '/wechat/share_logs',
    {
      uri: window.location.pathname,
      user_id: $('.share-wrapper').data('user-id'),
      query: getQueryParams(document.location.search)
    },
    function(data){
      if (data.result){
        mui.toast('已分享');
      } else {
        alert('分享失败，请重试');
      }
    }
  )
}

$(document).ready(function(){
	wx.ready(function(){

	    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		
		var link = $.trim($('.share-link').text());

		wx.onMenuShareTimeline({
	    title: '慢读书欢迎您', // 分享标题
	    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	    imgUrl: 'wechat/home/4.png', // 分享图标
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	      saveShareLog();  
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
    });


    wx.onMenuShareAppMessage({
	    title: '慢读书欢迎您', // 分享标题
	    desc: '以慢打快', // 分享描述
	    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	    imgUrl: 'wechat/home/4.png', // 分享图标
	    type: '', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	      saveShareLog();
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
		});

	});
	
});