class Admin::UsersController < Admin::BaseController

  def index 
    @users = User.all 

    if @is_admin = params[:is_admin].presence
      if @is_admin == 'on'
        @users = @users.admin
      elsif @is_admin == 'off'
        @users = @users.not_admin
      end
    end

    if @mobile = params[:mobile].presence
      @users = @users.where('mobile like (?)', "%#{@mobile}%")
    end

    if @name = params[:name].presence
      @users = @users.where('nickname like (:name) or name like (:name) or realname like (:name)', name: "%#{@name}%")
    end

    if @user_id = params[:user_id].presence
      @users = @users.where(id: @user_id)
    end
  end 

  def show
    @user = User.find(params[:id])
  end 

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      flash[:notice] = '用户标签修改成功'
      redirect_to admin_users_path
    else 
      flash[:alert] = '用户标签没有修改成功'
      render :edit
    end 
  end 

  private

  def user_params
    params.require(:user).permit(:mobile, :name, :is_admin, wechat_tag_ids: []) ## Rails 4 strong params usage
  end

end
