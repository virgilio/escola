$(document).ready(function() {

  var hash = window.location.hash;
  if(hash)
    jQuery('html, body').animate({ scrollTop: $(hash).offset().top - 70 }, 300);

  //Scrolling to the given element
  jQuery(".menu a, .participe a").click(function(e){
    jQuery('html, body').animate({ scrollTop: $(this.hash).offset().top - 70 }, 300);
  });

  // Popup
  jQuery('.popup').click(function(event) {
    event.preventDefault();
    var width  = 575,
    height = 400,
    left   = ($(window).width()  - width)  / 2,
    top    = ($(window).height() - height) / 2,
    url    = this.href + '&url=' + encodeURI(window.location),
    opts   = 'status=1' +
    ',width='  + width  +
    ',height=' + height +
    ',top='    + top    +
    ',left='   + left;
    window.open(url, 'twitter', opts);
    return false;
  });

  // Subscription to mailchip
  jQuery('#subscribe').submit(function(e) {
    //Preventing the form to be submitted
  	e.preventDefault(); 

    // Hide subscribe form
  	jQuery("#subscribe").fadeOut("slow");
    jQuery("#messages").hide();

    // Form and action
  	var form = $(this);
  	var action = form.attr('action');
  	
    // Date
    name = $("input[name='name']",form).val();
  	email = $("input[name='email']",form).val();

    //
    //jQuery("#subscribing")
  	
    jQuery.ajax({
     url: action,
     type: 'POST',
     data: {
      name: name,
      email: email
    },
    success: function(data){
      var res = jQuery.parseJSON(data);
      if(res.error){
         jQuery("#subscribe").fadeIn("fast");
         jQuery("#messages").removeClass("text-success").addClass("text-error").html(res.data).fadeIn("fast");
      } else {
        jQuery("#subscribe").fadeIn("fast");
        jQuery("#messages").removeClass("text-error").addClass("text-success").html(res.data).fadeIn("fast");
      }
    },
    error: function() {
      jQuery("#messages")
        .removeClass("text-success")
        .addClass("text-error")
        .html("<p>Houve um erro no servidor, por favor nos contate através do e-mail abaixo</p>" + res.data).show();
      }
    });
  	return false;
  });


});