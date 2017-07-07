root = exports ? this

root.show_flash = (type, message) ->
  flash_div = $('.alert-' + type)
  if flash_div.length == 0
    flash_div = $('<div class="alert alert-' + type + '" />')
    $('.flash-wrapper').prepend flash_div
  flash_div.html(message).show().delay(10000).slideUp()
  return

$.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] )

# $.fn.editable.defaults.mode = 'inline'
# $.fn.editable.defaults.ajaxOptions = {type: "put"}

$ ->

  # MetsiMenu
  $('#side-menu').metisMenu()

  $('.navbar-minimalize').click ->
    $("body").toggleClass("mini-navbar");

  window.UMEDITOR_CONFIG.imageUrl = '/admin/images'
  window.UMEDITOR_CONFIG.imagePath = ''
  window.UMEDITOR_CONFIG.UMEDITOR_HOME_URL = '/assets/umeditor/'

  window.um = UM.getEditor('umeditor-content', 
    textarea: $('#umeditor-content').data('name')
  )

  $('.chosen-select, .select2').select2()

  $('.select2-with-clear').select2
    allowClear: true

  $('[data-toggle="tooltip"]').tooltip();

  # Fix sortable helper
  fixHelper = (e, ui) ->
    ui.children().each ->
      $(this).width $(this).width()
      
    return ui

  $('table.sortable').ready ->
    td_count = $(this).find('tbody tr:first-child td').length
    $('table.sortable tbody').sortable
      handle: '.handle'
      helper: fixHelper
      placeholder: 'ui-sortable-placeholder'
      update: (event, ui) ->
        $('#progress').show()
        positions = {}
        $.each $('table.sortable tbody tr'), (position, obj) ->
          reg = /admin_(\w+_?)+_(\d+)/
          parts = reg.exec($(obj).prop('id'))
          if parts
            positions['positions[' + parts[2] + ']'] = position
          return
        $.ajax
          type: 'POST'
          dataType: 'script'
          url: $(ui.item).closest('table.sortable').data('sortable-link')
          data: positions
          success: (data) ->
            $('#progress').hide()
            return
        return
      start: (event, ui) ->
        # Set correct height for placehoder (from dragged tr)
        ui.placeholder.height ui.item.height()
        # Fix placeholder content to make it correct width
        ui.placeholder.html '<td colspan=\'' + td_count - 1 + '\'></td><td class=\'actions\'></td>'
        return
      stop: (event, ui) ->
        # Fix odd/even classes after reorder
        $('table.sortable tr:even').removeClass('odd even').addClass 'even'
        $('table.sortable tr:odd').removeClass('odd even').addClass 'odd'
   
  uniqueId = 1
  $('.admin_add_fields').click ->
    target = $(this).data('target')
    new_table_row = $(target + ' tr:visible:last').clone()
    new_id = (new Date).getTime() + uniqueId++
    new_table_row.find('input, select').each ->
      el = $(this)
      el.val ''
      el.prop 'id', el.prop('id').replace(/\d+/, new_id)
      el.prop 'name', el.prop('name').replace(/\d+/, new_id)
      return
    # When cloning a new row, set the href of all icons to be an empty "#"
    # This is so that clicking on them does not perform the actions for the
    # duplicated row
    new_table_row.find('a').each ->
      el = $(this)
      el.prop 'href', '#'
      return
    $(target).append new_table_row
    return

  $('body').on 'click', '.delete-resource', ->
    el = $(this)
    if confirm(el.data('confirm'))
      $.ajax
        type: 'POST'
        url: $(this).prop('href')
        data:
          _method: 'delete'
        dataType: 'script'
        success: (response) ->
          $flash_element = $('.alert-success')
          if $flash_element.length
            el.parents('tr').fadeOut 'hide', ->
              $(this).remove()
        error: (response, textStatus, errorThrown) ->
          show_flash 'error', response.responseText
    return false

  $('#last-week-orders-btn').on 'click', ->
    d = new Date
    $('#filterrific_with_order_time_end').val $.datepicker.formatDate('yy-mm-dd', d)
    d.setHours -7 * 24
    $('#filterrific_with_order_time_begin').val $.datepicker.formatDate('yy-mm-dd', d)
    $('.order-filter-form').submit()

  $('a[data-toggle="tab"]').tab()

  $('.clear-btn').click ->
    $form = $(this).closest('form')
    $form.find('input[type=text], input[type=date], select').val('')

  $('.filterrific_date').datepicker
    todayBtn: 'linked'
    keyboardNavigation: false
    forceParse: false
    calendarWeeks: true
    autoclose: true
    dateFormat: "yy-mm-dd"
    onSelect: ->
      $(this).closest('form').submit()
 