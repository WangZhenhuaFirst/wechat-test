class CreateWechatTags < ActiveRecord::Migration[5.0]
  def change
    create_table :wechat_tags do |t|
      t.string :name 
      t.integer :tagid

      t.timestamps
    end
    add_index :wechat_tags, :name 
    add_index :wechat_tags, :tagid 
  end
end