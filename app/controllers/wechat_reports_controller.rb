class WechatReportsController < ApplicationController
  wechat_api
  layout 'wechat'

  def index
    @lots = Lot.with_preloading.wip_lot
  end
end
