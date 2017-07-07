Rails.application.config.middleware.use OmniAuth::Builder do
  provider :wechat, "wxe30c5c265d696aba", "6ff811f75e169a1eb3ec482692d8dfe0"
end
