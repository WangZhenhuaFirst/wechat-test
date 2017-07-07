class Admin::WechatTagsController < Admin::BaseController

def new 
  @wechat_tag = WechatTag.new
end 

def create
  @wechat_tag = WechatTag.new(tag_params)

  if @wechat_tag.save
    flash[:notice] = "打标签成功"
    redirect_to admin_wechat_tags_path
  else
    flash[:alert] = "打标签不成功"
    render action: 'new'
  end
end 





end
