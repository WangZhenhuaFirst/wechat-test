Rails.application.routes.draw do
  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resource :wechat, only:[:show, :create] do 
    collection do 
      get :message_box
      get :direct_message_box
    end 
  end 

  namespace :wechat do  
    get 'welcome' => 'welcome#index'
    resources :users
    resources :share_logs, only: [:create]
  end 

  get 'auth/wechat/callback' => 'wechat/welcome#create'

  namespace :admin do 
    get 'login' => 'sessions#new'
    post 'login' => 'sessions#create'
    get 'logout' => 'sessions#destroy'

    resources :users, only: [:index, :show, :update] do 
      resources :share_logs, only: [:index]
    end

    resources :wechat_tags do 
      member do 
        get :users 
      end 
    end 
    root 'sessions#new'  
  end 

  
end
