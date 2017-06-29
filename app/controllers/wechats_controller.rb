class WechatsController < ApplicationController
  # For details on the DSL available within this file, see https://github.com/Eric-Guo/wechat#rails-responder-controller-dsl
  wechat_responder
  
  # 默认文字信息responder
  on :text do |request, content|
    request.reply.text "echo: #{content}" # Just echo
  end

  # 当请求的文字信息内容为'help'时, 使用这个responder处理
  on :text, with: 'help' do |request|
    request.reply.text 'help content' #回复帮助信息
  end

  # 当请求的文字信息内容为'<n>条新闻'时, 使用这个responder处理, 并将n作为第二个参数
  on :text, with: /^(\d+)条新闻$/ do |request, count|
    # 微信最多显示8条新闻，大于8条将只取前8条
    news = (1..count.to_i).each_with_object([]) { |n, memo| memo << { title: '新闻标题', content: "第#{n}条新闻的内容#{n.hash}" } }
    request.reply.news(news) do |article, n, index| # 回复"articles"
      article.item title: "#{index} #{n[:title]}", description: n[:content], pic_url: 'http://www.baidu.com/img/bdlogo.gif', url: 'http://www.baidu.com/'
    end
  end

  # 当用户加关注
  on :event, with: 'subscribe' do |request|
    request.reply.text "User #{request[:FromUserName]} subscribe now"
  end

  # 公众号收到未关注用户扫描qrscene_xxxxxx二维码时。注意此次扫描事件将不再引发上条的用户加关注事件
  on :scan, with: 'qrscene_xxxxxx' do |request, ticket|
    request.reply.text "Unsubscribe user #{request[:FromUserName]} Ticket #{ticket}"
  end

  # 公众号收到已关注用户扫描创建二维码的scene_id事件时
  on :scan, with: 'scene_id' do |request, ticket|
    request.reply.text "Subscribe user #{request[:FromUserName]} Ticket #{ticket}"
  end

  # 当没有任何on :scan事件处理已关注用户扫描的scene_id时
  on :event, with: 'scan' do |request|
    if request[:EventKey].present?
      request.reply.text "event scan got EventKey #{request[:EventKey]} Ticket #{request[:Ticket]}"
    end
  end

  # 当用户点击菜单时
  on :click, with: 'BOOK_LUNCH' do |request, key|
    request.reply.text "User: #{request[:FromUserName]} click #{key}"
  end

  # 当用户点击菜单时
  on :view, with: 'http://wechat.somewhere.com/view_url' do |request, view|
    request.reply.text "#{request[:FromUserName]} view #{view}"
  end

  # 处理图片信息
  on :image do |request|
    request.reply.image(request[:MediaId]) #直接将图片返回给用户
  end

  # 处理语音信息
  on :voice do |request|
    request.reply.voice(request[:MediaId]) #直接语音音返回给用户
  end

  # 处理视频信息
  on :video do |request|
    nickname = wechat.user(request[:FromUserName])['nickname'] #调用 api 获得发送者的nickname
    request.reply.video(request[:MediaId], title: '回声', description: "#{nickname}发来的视频请求") #直接视频返回给用户
  end

  # 处理地理位置消息
  on :label_location do |request|
    request.reply.text("Label: #{request[:Label]} Location_X: #{request[:Location_X]} Location_Y: #{request[:Location_Y]} Scale: #{request[:Scale]}")
  end

  # 处理上报地理位置事件
  on :location do |request|
    request.reply.text("Latitude: #{request[:Latitude]} Longitude: #{request[:Longitude]} Precision: #{request[:Precision]}")
  end

  # 当用户取消关注订阅
  on :event, with: 'unsubscribe' do |request|
    request.reply.success # user can not receive this message
  end

  # 成员进入应用的事件推送
  on :event, with: 'enter_agent' do |request|
    request.reply.text "#{request[:FromUserName]} enter agent app now"
  end

  # 当异步任务增量更新成员完成时推送
  on :batch_job, with: 'sync_user' do |request, batch_job|
    request.reply.text "job #{batch_job[:JobId]} finished, return code #{batch_job[:ErrCode]}, return message #{batch_job[:ErrMsg]}"
  end

  # 当异步任务全量覆盖成员完成时推送
  on :batch_job, with: 'replace_user' do |request, batch_job|
    request.reply.text "job #{batch_job[:JobId]} finished, return code #{batch_job[:ErrCode]}, return message #{batch_job[:ErrMsg]}"
  end

  # 当异步任务邀请成员关注完成时推送
  on :batch_job, with: 'invite_user' do |request, batch_job|
    request.reply.text "job #{batch_job[:JobId]} finished, return code #{batch_job[:ErrCode]}, return message #{batch_job[:ErrMsg]}"
  end

  # 当异步任务全量覆盖部门完成时推送
  on :batch_job, with: 'replace_party' do |request, batch_job|
    request.reply.text "job #{batch_job[:JobId]} finished, return code #{batch_job[:ErrCode]}, return message #{batch_job[:ErrMsg]}"
  end

  # 事件推送群发结果
  on :event, with: 'masssendjobfinish' do |request|
    # https://mp.weixin.qq.com/wiki?action=doc&id=mp1481187827_i0l21&t=0.03571905015619936#8
    request.reply.success # request is XML result hash.
  end

  # 当无任何responder处理用户信息时,使用这个responder处理
  on :fallback, respond: 'fallback message'




end
