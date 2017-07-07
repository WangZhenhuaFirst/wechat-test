class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :mobile
      t.string :password_digest
      t.string :name 
      t.string :realname 
      t.string :nickname
      t.integer :subscribe, default: 0 
      t.string :openid
      t.string :headimgurl

      t.timestamps
    end

    add_index :users, :openid
  end
end

