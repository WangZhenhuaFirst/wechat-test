class Wechat::ShareLogsController < Wechat::BaseController
  protect_from_forgery with: :exception

  def create
    share_log = ShareLog.create(user_id: params[:user_id], uri: params[:uri], query: params[:query])
    render json: { result: true } 
  end

end
