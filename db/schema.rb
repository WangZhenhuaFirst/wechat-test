# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170706062006) do

  create_table "share_logs", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "uri"
    t.text     "query"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_share_logs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "mobile"
    t.string   "password_digest"
    t.string   "name"
    t.string   "realname"
    t.string   "nickname"
    t.integer  "subscribe",       default: 0
    t.string   "openid"
    t.string   "headimgurl"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.index ["openid"], name: "index_users_on_openid"
  end

  create_table "wechat_sessions", force: :cascade do |t|
    t.string   "openid",     null: false
    t.string   "hash_store"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["openid"], name: "index_wechat_sessions_on_openid", unique: true
  end

  create_table "wechat_tags", force: :cascade do |t|
    t.string   "name"
    t.integer  "tagid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_wechat_tags_on_name"
    t.index ["tagid"], name: "index_wechat_tags_on_tagid"
  end

end
