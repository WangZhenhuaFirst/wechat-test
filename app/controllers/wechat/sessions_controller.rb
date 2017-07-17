class Wechat::SessionsController < Wechat::BaseController
  skip_before_action :require_login, only: [:create]

  def create  
    auth_hash = request.env['omniauth.auth']
    
    if User.exists?(openid: [auth_hash.fetch('extra').fetch('raw_info').fetch('openid')])
      @user = User.find_by(openid: [auth_hash.fetch('extra').fetch('raw_info').fetch('openid')] ) 
      session[:user_id] = @user.openid   
    else 
      @user = User.new
      @user.openid = auth_hash.fetch('extra').fetch('raw_info').fetch('openid') 
      @user.nickname = auth_hash.fetch('info').fetch('nickname')
      @user.headimgurl = auth_hash.fetch('extra').fetch('raw_info').fetch('headimgurl')    
      @user.password = '123456'
      session[:user_id] = @user.openid
      @user.save!
    end 

    redirect_to session[:return_to] and return 
  end

end
