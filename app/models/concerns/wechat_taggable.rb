require 'active_support/concern'
module WechatTaggable
  extend ActiveSupport::Concern

  included do
    has_and_belongs_to_many :wechat_tags, after_add: :add_to_wechat , after_remove: :remove_from_wechat
  end

  def add_to_wechat(wechat_tag)
    # p ' **' * 20
    # p 'add_to_wechat'
    res = Wechat.api.tag_add_user(wechat_tag.tagid, Array(self.openid))
    return true
  end

end 