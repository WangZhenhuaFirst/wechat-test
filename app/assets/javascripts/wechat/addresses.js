$(document).ready(function(){
  // 收货地址编辑表单
  $('#address_edit_form').submit(function(){
    var user_name = $('#address_name').val();
    var user_mobile = $('#address_phone').val();
    var province = $('#address_province_code option:selected').val();
    var city = $('#address_city_code option:selected').val();
    var district = $('#address_district_code option:selected').val();
    var street = $('#address_street').val();

    if (user_name == '') {
      createAlert('请输入收货人姓名！');
      return false;
    }
    if (user_mobile == '') {
      createAlert('请输入收货人手机号码！');
      return false;
    } else if (user_mobile != '' && !verify_phone.test(user_mobile)){
      createAlert('请输入正确的手机号码！');
      return false;
    }
    if (province == '') {
      createAlert('请选择所在省份！');
      return false;
    }
    if (city == '') {
      createAlert('请选择所在城市！');
      return false;
    }
    if (district == '') {
      createAlert('请选择所在区县！');
      return false;
    }
    if (street == '') {
      createAlert('请输入详细地址！');
      return false;
    }
    return true;
  });

  // 删除地址操作
  $('#remove_address').click(function(){
    var $this = $(this);
    createConfirm(
      '您确认要删除该地址？',
      function (type){
        if (type == 'confirm'){
          $.ajax({
            url: $this.data('url'),
            method: 'DELETE',
            success: function(){
            }
          })
        }
      }
    );
  });
});
