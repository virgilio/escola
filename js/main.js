$(document).ready(function() {
  /*var header = $('#fixed-header');
  var form = $('#signup');
  var start = $(form).offset().top;
  
  $.event.add(window, "scroll", function() {
    var p = $(window).scrollTop();
    if(p > start){
      $(header).addClass("visible-header");
    }
    else{
      $(header).removeClass("visible-header");
    }
  });

  $("#show-form").click(function(){
    $(header).addClass("visible-form");
  });*/



    jQuery('#subscribe').submit(function(e) {
	e.preventDefault();
	jQuery("#subscribe").fadeOut("slow");
	var form = $(this);
	var action = form.attr('action');
	name = $("input[name='name']",form).val();
	email = $("input[name='email']",form).val();
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
		    var error = res.error.toString();
		    var number = 0;
		    if(error.indexOf("Invalid Email Address") >= 0) number = 1;
		    else if(error.indexOf("is already subscribed to list") >= 0) number = 2;
		    else number = 3;
		    if(number == 2){
			jQuery("#messages").addClass("text-warning").html(res.data).show();
		    } else {
			jQuery("#email").parent().addClass("error");
			jQuery("#subscribe").fadeIn("fast");
		    }
		} else {
		    jQuery("#messages").addClass("text-success").html(res.data).show();
		}
	    },
	    error: function() {
		jQuery("#messages").addClass("text-error").html("<p>Houve um erro, por favor, tente mais tarde</p>" + res.data).show();
	    }
	});
	return false;
    });


});