class User < ApplicationRecord
  include WechatTaggable
  has_secure_password
  has_many :share_logs 
  has_many :shared_user_viewlogs, :foreign_key => "shared_user_id", :class_name => "ViewLog"
  has_many :viewer_viewlogs, :foreign_key => "viewer_id", :class_name => "ViewLog"
  
  scope :admin, -> { where(is_admin: true) }

  def admin?
    !!is_admin
  end  

end

