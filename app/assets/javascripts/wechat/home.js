// http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
//var query = getQueryParams(document.location.search);
//alert(query.foo);
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
  wx.ready(function() {
    console.log('ready')
    // wx.hideOptionMenu();

    var title = $.trim($('.share-title').text());
    var link = $.trim($('.share-link').text());
    var img = $('.share-img img').attr('src');
    var desc = $.trim($('.share-desc').text());

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: img, // 分享图标
      success: function () { 
        // 用户确认分享后执行的回调函数
        saveShareLog();
      },
      cancel: function () { 
        // 用户取消分享后执行的回调函数
      }
    });

    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: img, // 分享图标
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