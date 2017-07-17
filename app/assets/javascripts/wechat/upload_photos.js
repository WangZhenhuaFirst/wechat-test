function syncUpload(local_ids, $btn){
  var local_id = local_ids.pop();
  var comment_index = $btn.attr('data-comment-index');

  $btn.before("<img src='" + local_id + "' height='50' width='50' />")
  wx.uploadImage({
    localId: local_id,
    isShowProgressTips: 1,
    success: function(res){
      var server_id = res.serverId;
      $btn.before("<input name='comments[" + comment_index + "][server_ids][]' type='hidden' value='" + server_id + "' />");
      if(local_ids.length > 0){
        syncUpload(local_ids, $btn);
      }
    }
  });
}

$(document).ready(function () {
  if (typeof(wx) != 'undefined') {
    wx.ready(function () {
      $('body').on('click', '.upload-photos', function (e) {
        e.preventDefault();

        var $that = $(this);
        if($that.hasClass('disabled')){
          return false;
        }

        $that.addClass('disabled');
        wx.chooseImage({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            var local_ids = res.localIds;
            syncUpload(local_ids, $that)
            $that.removeClass('disabled');
          }
        });
      });
    });
  }
});
