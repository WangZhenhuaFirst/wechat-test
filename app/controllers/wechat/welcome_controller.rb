class Wechat::WelcomeController < Wechat::BaseController
  
  def index
  end 

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
      session[:user_id] = @user.openid
      @user.save!
    end 

    redirect_to  wechat_welcome_path
  end

  

end
