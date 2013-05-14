var fnames = new Array();
  var ftypes = new Array();
  fnames[0] = 'EMAIL';
  ftypes[0] = 'email';
  try {
    var jqueryLoaded = jQuery;
    jqueryLoaded = true;
  } catch (err) {
    var jqueryLoaded = false;
  }
  var head = document.getElementsByTagName('head')[0];
  if (!jqueryLoaded) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js';
    head.appendChild(script);
    if (script.readyState && script.onload !== null) {
      script.onreadystatechange = function () {
        if (this.readyState == 'complete') mce_preload_check();
      }
    }
  }
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://downloads.mailchimp.com/js/jquery.form-n-validate.js';
  head.appendChild(script);
  var err_style = '';
  try {
    err_style = mc_custom_error_style;
  } catch (e) {
    err_style = '.mc_embed_signup input.mce_inline_error{border-color:background: rgba(220, 90, 100, 1);} .mc_embed_signup div.mce_inline_error{margin: 0 0 1em 0; padding: 5px 10px; background-color: rgba(220, 90, 100, 1); font-weight: bold; z-index: 1; color:#fff;}';
  }
  var head = document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = err_style;
  } else {
    style.appendChild(document.createTextNode(err_style));
  }
  head.appendChild(style);
  setTimeout('mce_preload_check();', 250);

  var mce_preload_checks = 0;

  function mce_preload_check() {
    if (mce_preload_checks > 40) return;
    mce_preload_checks++;
    try {
      var jqueryLoaded = jQuery;
    } catch (err) {
      setTimeout('mce_preload_check();', 250);
      return;
    }
    try {
      var validatorLoaded = jQuery("#fake-form").validate({});
    } catch (err) {
      setTimeout('mce_preload_check();', 250);
      return;
    }
    mce_init_form();
  }

  function mce_init_form() {
    jQuery(document).ready(function ($) {
      var options = {
        errorClass: 'mce_inline_error',
        errorElement: 'div',
        onkeyup: function () {},
        onfocusout: function () {},
        onblur: function () {}
      };
      
      $(".mc-embedded-subscribe-form").unbind('submit'); //remove the validator so we can get into beforeSubmit on the ajaxform, which then calls the validator
      $(".mc-embedded-subscribe-form").each(function(){
        var thisForm = $(this);
        var mce_validator = thisForm.validate(options);
        var options = {
          context: this, // Important trick for the "success" context
          url: thisForm.attr('post-json'),
          type: 'GET',
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          beforeSubmit: function () {
            thisForm.find('.mce_tmp_error_msg').remove();
            thisForm.find('.datefield', '.mc_embed_signup').each(function () {
              var txt = 'filled';
              var fields = new Array();
              var i = 0;
              thisForm.find(':text', this).each(function () {
                fields[i] = this;
                i++;
              });
              thisForm.find(':hidden', this).each(function () {
                var bday = false;
                if (fields.length == 2) {
                  bday = true;
                  fields[2] = {
                    'value': 1970
                  }; //trick birthdays into having years
                }
                if (fields[0].value == 'MM' && fields[1].value == 'DD' && (fields[2].value == 'YYYY' || (bday && fields[2].value == 1970))) {
                  this.value = '';
                } else if (fields[0].value == '' && fields[1].value == '' && (fields[2].value == '' || (bday && fields[2].value == 1970))) {
                  this.value = '';
                } else {
                  if (/\[day\]/.test(fields[0].name)) {
                    this.value = fields[1].value + '/' + fields[0].value + '/' + fields[2].value;
                  } else {
                    this.value = fields[0].value + '/' + fields[1].value + '/' + fields[2].value;
                  }
                }
              });
            });
            return mce_validator.form();
          },
          success: mce_success_cb
        };
        thisForm.ajaxForm(options);
      });
    });   
  }

  function mce_success_cb(resp) {
    var thisForm = $(this);
    if (resp.result == "success") {
      thisForm.find('.mce-' + resp.result + '-response').show().delay(5000).slideUp();
      thisForm.find('.mce-' + resp.result + '-response').html(
        "Entre em seu e-mail e confirme-o, por favor"
        //resp.msg
      ).delay(5000).slideUp();
      thisForm.find('.mc-embedded-subscribe-form').each(function () {
        this.reset();
      });
    } else {
      var index = -1;
      var msg;
      try {
        var parts = resp.msg.split(' - ', 2);
        if (parts[1] == undefined) {
          msg = resp.msg;
        } else {
          i = parseInt(parts[0]);
          if (i.toString() == parts[0]) {
            index = parts[0];
            msg = parts[1];
          } else {
            index = -1;
            msg = resp.msg;
          }
        }
      } catch (e) {
        index = -1;
        msg = resp.msg;
      }
      try {
        if (index == -1) {
          thisForm.find('.mce-' + resp.result + '-response').show().delay(5000).slideUp();;
          thisForm.find('.mce-' + resp.result + '-response').html(msg).delay(5000).slideUp();;
        } else {
          err_id = 'mce_tmp_error_msg';
          html = '<div class="' + err_id + '" style="' + err_style + '"> ' + msg + '</div>';

          var input_id = '.mc_embed_signup';
          var f = $(input_id);
          if (ftypes[index] == 'address') {
            input_id = '.mce-' + fnames[index] + '-addr1';
            f = thisForm.find(input_id).parent().parent().get(0);
          } else if (ftypes[index] == 'date') {
            input_id = '.mce-' + fnames[index] + '-month';
            f = thisForm.find(input_id).parent().parent().get(0);
          } else {
            input_id = '.mce-' + fnames[index];
            f = thisForm.find().parent(input_id).get(0);
          }
          if (f) {
            $(f).append(html).delay(5000).slideUp();
            thisForm.find(input_id).focus();
          } else {
            thisForm.find('.mce-' + resp.result + '-response').show().delay(5000).slideUp();
            thisForm.find('.mce-' + resp.result + '-response').html(msg).delay(5000).slideUp();
          }
        }
      } catch (e) {
        thisForm.find('.mce-' + resp.result + '-response').show().delay(5000).slideUp();
        thisForm.find('.mce-' + resp.result + '-response').html(msg).delay(5000).slideUp();
      }
    }
  }