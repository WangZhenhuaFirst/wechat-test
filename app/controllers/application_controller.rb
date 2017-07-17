class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user
  
  def current_user
    return @current_user if @current_user.present?
    @current_user = User.find_by(openid: session[:user_id]) if session[:user_id].present?
  end 
 
end


