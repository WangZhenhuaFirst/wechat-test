class Admin::ShareLogsController < Admin::BaseController

  def index
    if params[:user_id]
      @user = User.find_by_id(params[:user_id])
      @share_logs = @user.share_logs
    else
      @share_logs = ShareLog.includes(:user)

      if @user_name = params[:user_name].presence
        @share_logs = @share_logs.select('share_logs.*')
        @share_logs = @share_logs.joins(:user).where('users.name like :name or users.nickname like :name or users.realname like :name', name: '%' + @user_name + '%')
      end
    end

    if @uri = params[:uri].presence
      @share_logs = @share_logs.where('uri like ?', '%' + @uri + '%')
    end

    @share_logs = @share_logs.order('created_at desc')
  end

end
