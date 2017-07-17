class Admin::BaseController < ApplicationController
  layout 'admin'
  before_action :require_admin

  def require_admin
  
  end 

  helper_method :current_admin
  def current_admin
    return @current_admin if @current_admin.present?
    @current_admin = User.admin.find_by(openid: session[:user_id]) if session[:user_id].present?
  end

end
