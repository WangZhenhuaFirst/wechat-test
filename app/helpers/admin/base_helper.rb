module Admin::BaseHelper
  def body_bg
    return 'gray-bg' if empty_page?
    return ''
  end

  def page_wrapper_bg
    return '' if empty_page?
    return 'gray-bg'
  end

  def empty_page?
    controller_name == 'sessions'
  end

end
