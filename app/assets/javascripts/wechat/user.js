$(document).ready(function(){
  if ($('body').attr('id') == 'user_index'){
    addActiveNav($('#nav_item_user'));
  }

  var user_mobile = $('#user_mobile'),
      valid_code = $('#valide_code'),
      valid_code_btn = $('#valid_code_btn'),
      check_mobile_btn = $('#check_mobile_btn');

  // 获取验证码
  valid_code_btn.click(function(event){
    event.preventDefault();
    var $this = $(this);

    if (user_mobile.val() == '') {
      createAlert('请填写您的手机号码！');
      return false;
    } else if (user_mobile.val() != '' && !verify_phone.test(user_mobile.val())) {
      createAlert('请填写正确的手机号码！');
      user_mobile.val('');
      user_mobile.focus();
      return false;
    }
    $this.attr('disabled', true);
    countdownCode($this);
    $.post($this.data('url'),{
        'mobile' : user_mobile.val()
      }, function(data) {
        if (data.status == 'success') {
          countdownCode($this);
          createAlert('验证码已经发送成功！');
        } else {
          if (!!data.message) {
            createAlert(data.message);
          } else {
            createAlert('验证码发送失败，请稍后再试！');
          }
        }
      }
    );
  });

  check_mobile_btn.click(function(event) {
    var $this = $(this);
    event.preventDefault();
    if (user_mobile.val() == '') {
      createAlert('请填写手机号码');
      return false;
    }
    if (valid_code.val() == '') {
      createAlert('请填写验证码');
      return false;
    }
    if (!$('#protocol_checked').is(':checked')) {
      createAlert('请同意勾选顾问协议');
      return false;
    }
    $.post(
      $this.closest('form')[0].action,
      {
        'code': valid_code.val(),
        'mobile': user_mobile.val()
      },
      function(data) {
        if (data.status == 'success') {
          // 成功
          window.location.href = data.url
        } else {
          if (!!data.message) {
            createAlert(data.message)
          } else {
            createAlert('验证码错误！');
          }
        }
      }
    );
  });

  var qr_swiper_banner = new Swiper('#qr_swiper_banner', {
    centeredSlides: true,
    autoplay: 5000,
    autoplayDisableOnInteraction: false
  });

  // $('.withdraw-btn').on('click', function(){
  //   var $btn = $(this);
  //   $.ajax({
  //     type: 'post',
  //     url: '/wechat/tixians',
  //     data: {
  //       amount: $btn.data('amount')
  //     },
  //     success: function(data){
  //       if(data.result){
  //         createAlert(data.message)
  //       }
  //     }
  //   })
  // });
});
