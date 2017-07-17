class WechatTag < ApplicationRecord

  has_and_belongs_to_many :users 
  before_create :add_to_wechat

  def add_to_wechat
    res = Wechat.api.tag_create(self.name)
    self[:tagid] = res['tag']['id']
  end

  def self.select_options
    self.all.pluck(:name, :id)
  end

end
