class CartController < ActionController::Base
	wechat_api
  def index
    wechat_oauth2 do |openid|
      @current_user = User.find_by(wechat_openid: openid)
      @articles = @current_user.articles
    end
  end	
end
