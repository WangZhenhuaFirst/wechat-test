class ViewLog < ApplicationRecord
  belongs_to :viewer, class_name: 'User'
  belongs_to :shared_user, class_name: 'User'

end
