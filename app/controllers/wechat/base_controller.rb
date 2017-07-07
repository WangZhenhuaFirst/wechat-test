class Wechat::BaseController < ApplicationController
  protect_from_forgery with: :exception

  wechat_api

  layout 'wechat'

 
  def user(openid)
    get 'user/info', params: { openid: openid }
  end

end
