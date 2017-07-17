class Admin::SessionsController < Admin::BaseController
  skip_before_action :require_admin

  def new
  end 

  def create
    user = User.admin.find_by(mobile: params[:session][:mobile].downcase)
    if user && user.authenticate(params[:session][:password]) 
      session[:user_id] = user.openid 
      flash[:success] = '登录成功'
      redirect_to admin_users_path
    else 
      flash[:alert] = '账号或密码有误，请重试'
      render 'new'
    end 
  end 

  def destroy
    session.delete(:user_id)
    @current_user = nil 
    redirect_to admin_login_path 
  end 

end
