module Wechat::BaseHelper
   def share_uri
    return @share_uri if @share_uri.present?
    # if use_default_share_uri?
    #   wechat_home_url(shared_user_id: current_user.try(:id))
    # else
      url_for(params.merge(shared_user_id: current_user.try(:id), only_path: false).permit!)
    # end
  end
end
