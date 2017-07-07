# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

disableWrapper = ($wrapper) ->
  $wrapper.addClass('hidden')
  $wrapper.find('input, select').prop('disabled', true)

enableWrapper = ($wrapper) ->
  $wrapper.removeClass('hidden')
  $wrapper.find('input, select').prop('disabled', false)

$ ->
  if $('.admin-user-form').length
    $('#user_role').change ->
      role = $(this).val()
      # console.log role
      switch role
        when 'patient' 
          disableWrapper($('.user_representative_id'))
          enableWrapper($('.user_consultant_id'))
        when 'consultant'
          enableWrapper($('.user_representative_id'))
          disableWrapper($('.user_consultant_id'))
        when 'representative'
          disableWrapper($('.user_consultant_id'))
          disableWrapper($('.user_representative_id'))
