var verify_phone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[123456789]|18[0-9]|14[57])[0-9]{8}$/;  // 手机号码验证
var countdown_count = 60; //倒计时默认时间

$(document).ready(function(){
  // 标签切换
  $('.tab-control').each(function(){
    var $tab_control = $(this);
    $tab_control.find('.tab-ctrl-tag').on('click', '.item', function(){
      var $that = $(this);
      var index = $that.index();
      var $tags = $tab_control.find('.tab-ctrl-tag');
      var $content = $tab_control.find('.tab-content');
      $that.siblings('.item').removeClass('active');
      $that.addClass('active');
      $content.eq(index).siblings('.tab-content').removeClass('active');
      $content.eq(index).addClass('active');
    });
  });

  // 微信分享提示公共方法
  $('.share-from-wechat-btn').click(function(e) {
    e.preventDefault();
    shareWXTips();
  });

  $('.num-input-operation .btn.add, .num-input-operation .btn.reduce').click(function(){
    var $this = $(this);
    $val_input = $this.closest('.num-input-operation').find('.count-input');

    if($(this).hasClass('add')){
      amountOperation($val_input, 1);
    } else {
      amountOperation($val_input, -1);
    }

    switch($('body').attr('id')){
      case 'products_show': // 产品立即购买
        updateDirectBuyModal();
        break;
      case 'carts_show':
        var $form = $this.closest('form');
        if($form.length){
          $form.submit();
          if($form.attr('id') == 'update-cart'){
            updateCartDate();
          }
        }
        break;
    }

  })

  // 微信图片预览公共方法
  var $wx_preview_imgs = $('img.wechat-preview-img');
  var wx_imgs_array = new Array();
  for (var i=0; i<$wx_preview_imgs.length; i++) {
    wx_imgs_array.push($wx_preview_imgs.eq(i).attr('src'));
  }
  $wx_preview_imgs.each(function() {
    $(this).click(function(event) {
      event.preventDefault();
      WeixinJSBridge.invoke('imagePreview', {
        'current' : $(this).attr('src'),
        'urls' : wx_imgs_array
      });
    });
  });

  // 倒计时调用
  $('.default-countdown').each(function () {
    var $that = $(this);
    var intDiff = parseInt($that.data('times'));
    countDownTimer($(this), intDiff);
  });

  // 截取字符串
  $('.limit-str-text').each(function(){
    var $that = $(this);
    var text = $that.html();
    var min_str = $that.data('minstr');
    var new_str = cutStrForNum(text, min_str);
    $that.html(new_str);
  });

  // 带有操作按钮的列表
  $('.list-with-operation').each(function(){
    var $list = $(this);
    var $item = $list.find('.operation-item');
    $item.each(function(){
      var last_pageX;   // 记录上一次距离
      var touch_start;  // 用于记录按下的点
      var $that = $(this);
      var $siblings = $that.siblings();
      var $handle = $that.find('.operation-handle');
      var $operation = $that.find('.tail-operation');
      var tail_width = parseInt($operation.outerWidth());

      $that.on({
        touchstart: function(e){
          last_pageX = e.originalEvent.changedTouches[0].pageX;
          $that.addClass('swiping');
          $siblings.find('.operation-handle').css({'-webkit-transform': 'translateX(0)'});
          $siblings.find('.tail-operation').css({'-webkit-transform': 'translateX('+tail_width+'px)'});
          // 记录开始按下时的点
          var touches = event.touches[0];
          touch_start = {
            x: touches.pageX, // 横坐标
            y: touches.pageY  // 纵坐标
          };
        },
        touchmove: function(e){
          // 计算划动过程中x和y的变化量
          var touches = event.touches[0];
          var diffX = e.originalEvent.changedTouches[0].pageX - last_pageX;
          delta = {
            x: touches.pageX - touch_start.x,
            y: touches.pageY - touch_start.y
          };
          // 横向位移大于纵向位移，阻止纵向滚动
          if (Math.abs(delta.x) > Math.abs(delta.y)) {
            event.preventDefault();
          }

          if (diffX < -tail_width) {
            $handle.css({'-webkit-transform': 'translateX(-'+tail_width+'px)'});
            $operation.css({'-webkit-transform': 'translateX(0)'});
          } else if (diffX > tail_width) {
            $handle.css({'-webkit-transform': 'translateX(0)'});
            $operation.css({'-webkit-transform': 'translateX('+tail_width+'px)'});
          }
        },
        touchend: function(e){
          var diffX = e.originalEvent.changedTouches[0].pageX - last_pageX;
          if (diffX < -tail_width) {
            $handle.css({'-webkit-transform': 'translateX(-'+tail_width+'px)'});
            $operation.css({'-webkit-transform': 'translateX(0)'});
          } else if (diffX > tail_width) {
            $handle.css({'-webkit-transform': 'translateX(0)'});
            $operation.css({'-webkit-transform': 'translateX('+tail_width+'px)'});
          }
        }
      });
    });

    // zepto方法
    // $item.each(function(){
    //   var $that = $(this);
    //   var $siblings = $that.siblings();
    //   var $handle = $that.find('.operation-handle');
    //   var $operation = $that.find('.tail-operation');
    //   var tail_width = parseInt($operation.width());

    //   $item.on({
    //     swipeLeft: function(){
    //       $that.addClass('swiping');
    //       $siblings.find('.operation-handle').css('-webkit-transform', 'translateX(0)');
    //       $siblings.find('.tail-operation').css('-webkit-transform', 'translateX('+tail_width+'px)');
    //       $handle.css({'-webkit-transform': 'translateX(-'+tail_width+'px)'});
    //       $operation.css({'-webkit-transform': 'translateX(0)'});
    //     },
    //     swipeRight: function(){
    //       $handle.css({'-webkit-transform': 'translateX(0)'});
    //       $operation.css({'-webkit-transform': 'translateX('+tail_width+'px)'});
    //     }
    //   });
    // });
  });
});

// 数量操作
function amountOperation(obj, n) {
  var amount_val = parseInt(obj.val());
  if (n < 0 && amount_val <= 1) return false;
  obj.val(amount_val += n);
}

// 底部菜单添加样式
function addActiveNav(current_nav) {
  current_nav.siblings('.item').removeClass('active');
  current_nav.addClass('active');
}

/**
 * 创建公用微信分享提示
 * 说明：可直接用shareWXTips()方法调用来显示，可加参数来显示提示信息；
 * .destroy()方法来隐藏。
 */
var shareWXTips = function (tips){
  var wechatTips = new Object();
  wechatTips.tips = tips;
  wechatTips.wxTipsUi = function (){
    var html = '<div class="share-wechat-tips">'
             + '<p>请从微信中进行分享！</p>';
    if (typeof this.tips !== 'undefined'){
      html += '<div class="tips">'+ this.tips +'</div>';
    }
    html += '</div>';
    return html;
  };
  wechatTips.createDom = function (){
    var dom = this.wxTipsUi();
    this.wxTipsDom = $(dom);
  };
  wechatTips.show = function (){
    this.createDom();
    this.bindClick();
    $('body').append(this.wxTipsDom);
    this.wxTipsDom.fadeIn();
  };
  wechatTips.destroy = function (){
    this.wxTipsDom.fadeOut(function(){
      this.wxTipsDom.remove();
    }.bind(this));
  };
  wechatTips.bindClick = function (){
    this.wxTipsDom.click(function(){
      this.destroy();
    }.bind(this));
  };
  wechatTips.show();
};

// 增加积分滑动显示效果
var scoreTipObj = function(score) {
  var obj = new Object();
  obj.score = parseFloat(score).toFixed(2);
  obj.setScore = function(s) {
    this.score = parseFloat(s).toFixed(2);
  };
  obj.getScore = function() {
    if (score > 0) {
      return '+' + this.score;
    }
    return this.score;
  };
  obj.body = function() {
    return '<div class="score-alert-tips active">'+ this.getScore() +'</div>';
  };
  obj.bodyCreatDom = function() {
    var dom = this.body();
    this.bodyDom = $(dom);
  };
  obj.disappear = function() {
    setTimeout(function() {
      this.bodyDom.removeClass('active');
      this.bodyDom.remove();
    }.bind(this), 3500);
  };
  obj.show = function(s) {
    if (s != undefined) {
      this.setScore(s);
    }
    this.bodyCreatDom();
    $(document.body).append(this.bodyDom);
    this.disappear();
  };
  return obj;
};

/**
 * 创建公用loading显示
 * 说明：可直接用createLoading()方法调用来显示loading效果，可加参数来显示提示信息；
 * .destroy()方法来隐藏。
 */
var createLoading = function (tips){
  var loadingObj = new Object();
  loadingObj.tips = tips;
  loadingObj.loadingUi = function (){
    var html = '<div class="loadding-cover">';
    if (typeof this.tips !== 'undefined'){
      html += '<div class="tips">'+ this.tips +'</div>';
    }
    html += '<div class="la-ball-clip-rotate"><div></div></div></div>';
    return html;
  };
  loadingObj.loading = false;
  loadingObj.createDom = function (){
    var dom = this.loadingUi();
    this.loadingDom = $(dom);
  };
  loadingObj.show = function (){
    this.createDom();
    $('body').append(this.loadingDom);
    this.loadingDom.show();
    this.loading = true;
  };
  loadingObj.destroy = function (){
    this.loadingDom.remove();
    this.loading = false;
  };
  loadingObj.getLoading = function (){
    return this.loading;
  };
  return loadingObj;
};

/**
 * 创建公用单独按钮alert提示框
 * 说明：可直接用createAlert()方法调用；
 * 其中message参数为必填参数，用来显示提示信息，
 * 示例：createAlert('数据错误！')；
 * opt和callback为选填参数：
 * opt默认为一个对象，也可为一个返回函数，当作为一个对象时，可设置提示框标题及按钮文字，
 * 示例：createAlert('数据错误！', {title: '请注意！', btn: '我知道了'})；
 * 当opt作为一个返回函数时，title和btn会有一个默认的显示，而后一个callback参数就没有必要再做设置。
 * 示例：createAlert('数据错误！', function(){……})；
 * callback默认为一个返回函数，作用于点击alert按钮后的操作。
 * 示例：createAlert('数据错误！', {title: '请注意！', btn: '我知道了'}, function(){……})；
 * .destroy()方法可用来隐藏提示框。
 */
var createAlert = function (message, opt, callback){
  var alertModal = new Object();
  alertModal.message = message;
  alertModal.opt = opt;
  alertModal.createHtml = function (){
    var html = '<div class="alert-modal">'
             + '<div class="modal-cover"></div>'
             + '<div class="modal-content">';
    if (typeof this.title !== 'undefined'){
      html += '<h5 class="modal-header">'+ this.title +'</h5>';
    } else {
      html += '<h5 class="modal-header">请注意</h5>';
    }
    if (typeof this.message !== 'undefined'){
      html += '<div class="modal-body">'+ this.message +'</div>';
    }
    if (typeof this.btn !== 'undefined'){
      html += '<div class="modal-footer"><div class="btn btn-confirm">'+ this.btn +'</div></div>';
    } else {
      html += '<div class="modal-footer"><div class="btn btn-confirm">确定</div></div>';
    }
    html += '</div></div>';
    return html;
  };
  alertModal.applyCallback = function (){
    if (typeof this.callback === 'function'){
      var fn = this.callback;
      fn();
    };
  };
  alertModal.createDom = function (){
    var dom = this.createHtml();
    this.modalDom = $(dom);
  };
  alertModal.setTitle = function (){
    var title = this.opt.title;
    if (typeof title === 'string') {
      // 定义title
      this.title = title;
    }
  };
  alertModal.setButton = function (){
    var btn = this.opt.btn;
    if (typeof btn === 'string') {
      // 定义btn
      this.btn = btn;
    }
  };
  alertModal.setCallback = function (fn){
    if (typeof fn === 'function') {
      // 定义callback
      this.callback = fn;
    }
  };
  alertModal.buildOpt = function (){
    if (typeof this.opt === 'object'){
      // 代表是title和btn对象
      this.setTitle();
      this.setButton();
    } else if (typeof this.opt === 'function'){
      // 代表opt是个callback
      this.setCallback(this.opt);
    }
  };
  alertModal.show = function (){
    // 编辑title配置
    this.buildOpt();
    // 设置callback参数
    this.setCallback(callback);
    this.createDom();
    this.bindClick();
    $('body').append(this.modalDom);
    this.modalDom.fadeIn().addClass('active');
  };
  alertModal.destroy = function (){
    this.modalDom.removeClass('active').fadeOut(function(){
      this.modalDom.remove();
    }.bind(this));
  };
  alertModal.bindClick = function (){
    this.modalDom.find('.modal-cover').click(function(){
      this.destroy();
    }.bind(this));
    this.modalDom.find('.btn-confirm').click(function(){
      this.destroy();
      this.applyCallback();
    }.bind(this));
  };
  alertModal.show();
};

/**
 * 创建公用确定、取消双按钮并有返回函数confirm提示框
 * 说明：可直接用createConfirm()方法调用；
 * 其中message参数为必填参数，用来显示提示信息，
 * 示例：createConfirm('您是否要继续？')；
 * opt和callback为选填参数：
 * opt默认为一个对象，也可为一个返回函数，当作为一个对象时，可设置提示框标题及两个按钮文字，
 * confirm来设置确定按钮，cancel来设置取消按钮：
 * 示例：createAlert('您是否要继续？', {title: '请注意！', confirm: '好的', cancel: '否'})；这三个参数均为选填，当不设置时，均有默认文字显示。
 * 当opt作为一个返回函数时，title和btn都会有一个默认的显示，而后一个callback参数就没有必要再做设置。
 * 返回函数需要一个返回值来判定用户点击的是confirm还是cancel；
 * 示例：createAlert('您是否要继续？', function(type){if(type == 'confirm'){'点击了是'};if(type == 'cancel'){'点击了否'}})；
 * callback默认为一个返回函数，作用于点击按钮后的操作，具体用法同上；
 * 示例：createAlert('您是否要继续？', function(type){if(type == 'confirm'){'点击了是'};if(type == 'cancel'){'点击了否'}})；
 * .destroy()方法可用来隐藏提示框。
 */
var createConfirm = function (message, opt, callback){
  var confirmModal = new Object();
  confirmModal.message = message;
  confirmModal.opt = opt;
  confirmModal.createHtml = function (){
    var html = '<div class="alert-modal">'
             + '<div class="modal-cover"></div>'
             + '<div class="modal-content">';
    if (typeof this.title !== 'undefined'){
      html += '<h5 class="modal-header">'+ this.title +'</h5>';
    } else {
      html += '<h5 class="modal-header">请注意</h5>';
    }
    if (typeof this.message !== 'undefined'){
      html += '<div class="modal-body">'+ this.message +'</div>';
    } else {
      html += '<div class="modal-body">确认是否继续？</div>';
    }
    if (typeof this.cancel_btn !== 'undefined'){
      html += '<div class="modal-footer"><div class="btn btn-cancel">'+ this.cancel_btn +'</div>';
    } else {
      html += '<div class="modal-footer"><div class="btn btn-cancel">取消</div>';
    }
    if (typeof this.confirm_btn !== 'undefined'){
      html += '<div class="btn btn-confirm">'+ this.confirm_btn +'</div></div>';
    } else {
      html += '<div class="btn btn-confirm">确定</div></div>';
    }
    html += '</div></div>';
    return html;
  };
  confirmModal.createDom = function (){
    var dom = this.createHtml();
    this.modalDom = $(dom);
  };
  confirmModal.setTitle = function (){
    var title = this.opt.title;
    if (typeof title === 'string') {
      // 定义title
      this.title = title;
    }
  };
  confirmModal.setButton = function (){
    var confirm = opt.confirm;
    var cancel = opt.cancel;
    if (typeof confirm === 'string'){
      this.confirm_btn = confirm;
    }
    if (typeof cancel === 'string'){
      this.cancel_btn = cancel;
    }
  };
  confirmModal.setCallback = function (fn){
    if (typeof fn === 'function') {
      // 定义callback
      this.callback = fn;
    }
  };
  confirmModal.applyCallback = function (type){
    if (typeof this.callback === 'function'){
      var fn = this.callback;
      fn(type);
    };
  };
  confirmModal.buildOpt = function (){
    if (typeof this.opt === 'object'){
      // 代表是title和btn对象
      this.setTitle();
      this.setButton();
    } else if (typeof this.opt === 'function'){
      // 代表opt是个callback
      this.setCallback(this.opt);
    }
  };
  confirmModal.show = function (){
    // 编辑title配置
    this.buildOpt();
    // 设置callback参数
    this.setCallback(callback);
    this.createDom();
    this.bindClick();
    $('body').append(this.modalDom);
    this.modalDom.fadeIn().addClass('active');
  };
  confirmModal.destroy = function (){
    this.modalDom.removeClass('active').fadeOut(function(){
      this.modalDom.remove();
    }.bind(this));
  };
  confirmModal.bindClick = function (){
    this.modalDom.find('.modal-cover').click(function(){
      this.destroy();
    }.bind(this));
    this.modalDom.find('.btn-cancel').click(function(){
      this.destroy();
      this.applyCallback('cancel');
    }.bind(this));
    this.modalDom.find('.btn-confirm').click(function(){
      this.destroy();
      this.applyCallback('confirm');
    }.bind(this));
  };
  confirmModal.show();
};

//验证码按钮倒计时
function countdownCode(btn) {
  var my_countTime = window.setInterval(function(){
    $(btn).attr('disabled', true);
    $(btn).html(countdown_count + '秒后重新获取');
    countdown_count --;
    if (countdown_count == 0) {
      $(btn).attr('disabled', false);
      $(btn).html('获取验证码');
      window.clearInterval(my_countTime);
      countdown_count = 60;
    }
  }, 1000);
}

// 倒计时函数
function countDownTimer(countObj, intDiff){
  window.setInterval(function(){
    var day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
    if(intDiff > 0){
      day = Math.floor(intDiff / (60 * 60 * 24));
      hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
      minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    countObj.find('.day-show').html(day);
    countObj.find('.hour-show').html(hour);
    countObj.find('.minute-show').html(minute);
    countObj.find('.second-show').html(second);
    intDiff--;
  }, 1000);
}

// 字符串限制字数
function cutStrForNum(str, len) {
  var str_length = 0;
  var str_cut = new String();
  var result = str;
  for (var i = 0; i < str.length; i++) {
    a = str.charAt(i);
    str_length ++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4
      str_length ++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat('...');
      result = str_cut.toString();
      break;
    }
  }
  return result;
}
