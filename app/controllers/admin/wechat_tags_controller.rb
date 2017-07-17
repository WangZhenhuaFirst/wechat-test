class Admin::WechatTagsController < Admin::BaseController

  def index
    @wechat_tags = WechatTag.all.includes(:users)
  end

  def new 
    @wechat_tag = WechatTag.new
  end 

  def edit
    @wechat_tag = WechatTag.find(params[:id])
  end

  def create
    @wechat_tag = WechatTag.new(wechat_tag_params)

    if @wechat_tag.save
      flash[:notice] = "打标签成功"
      redirect_to admin_wechat_tags_path
    else
      flash[:alert] = "打标签不成功"
      render action: 'new'
    end
  end 

  def update
    @wechat_tag = WechatTag.find(params[:id])
    if @wechat_tag.update(wechat_tag_params)
      flash[:notice] = "标签修改成功"
      redirect_to admin_wechat_tags_path
    else
      flash[:alert] = "未成功修改标签"
      render action: 'edit'
    end 
  end 

  def destroy
    @wechat_tag = WechatTag.find(params[:id])
    @wechat_tag.destroy 
    redirect_to admin_wechat_tags_path
    flash[:notice] = '标签删除成功'
  end

  def users
    @wechat_tag = WechatTag.find(params[:id])
    @users = @wechat_tag.users
    render :edit
  end

  private

  def wechat_tag_params
    params.require(:wechat_tag).permit(:name)
  end

end
