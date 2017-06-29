class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :nickname
      t.string :unionid
      t.string :openid
      t.string :headimgurl

      t.timestamps
    end

    add_index :users, :openid
    add_index :users, :unionid
  end
end
