class Wechat::BaseController < ApplicationController
  protect_from_forgery with: :exception
  wechat_api
  layout 'wechat'
  before_action :require_login
 
  def logged_in?
    !current_user.nil?
  end

  def require_login
    if !logged_in?      #如果用户还未登录
      uri = request.fullpath
      if uri.match(/\/auth\/wechat/)
        session[:return_to] = nil
      else
        session[:return_to] = uri 
      end 

        redirect_to '/auth/wechat' and return
    end
  end

  before_action :save_view_log
  def save_view_log
    return if params[:shared_user_id].blank? || !logged_in?

    shared_user_id = params[:shared_user_id]
    return if current_user.id == shared_user_id.to_i

    uri = request.fullpath.split('?').first

    ViewLog.create(
      shared_user_id: shared_user_id,
      viewer_id: current_user.id,
      uri: uri
    )
  end

end
