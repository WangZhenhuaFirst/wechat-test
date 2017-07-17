class CreateViewLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :view_logs do |t|
      t.integer :shared_user_id
      t.integer :viewer_id
      t.string :uri 

      t.timestamps
    end
    add_index :view_logs, :shared_user_id
    add_index :view_logs, :viewer_id
  end
end
