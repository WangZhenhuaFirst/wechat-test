class CreateShareLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :share_logs do |t|
      t.integer :user_id
      t.string :uri 
      t.text :query

      t.timestamps
    end
    add_index :share_logs, :user_id
  end
end
