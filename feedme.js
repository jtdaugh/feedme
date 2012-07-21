// Load the SDK Asynchronously
(function(d) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

// Once SDK has loaded
window.fbAsyncInit = function() {
	FB.init({
		appId : '445135842173553', 
		channelUrl : '//www.arbrr.com/channel.html', // Channel File
		status : true, // check login status
		cookie : true, // enable cookies to allow the server to access the session
		xfbml : true // parse XFBML
	});
	
	var FEEDME = FEEDME || {};
	$.extend(FEEDME, {
    handleResize: function() {
      $('#imageListHolder').height($(window).height() - 110);
		  $('.container').width(Math.max(Math.min($(window).width(),1060), 370) - 60);
      $('#imageListHolder, #copyright').each(function() {
        $(this).width(Math.max(Math.min($(window).width(),1060), 370) - 80);
      });
      $('.likeImage').each(function() {
        $(this).width($("#imageListHolder").width() - Math.floor(($("#imageListHolder").width() / 30)));
      });
      $('.shadeImage').each(function() {
        $(this).remove();
      });
    },
    resizeToFitWindow: function () {
      $(window).resize(function(){
        FEEDME.delay(function () {
          FEEDME.handleResize()
        }, 200);
      });
    },
    delay: (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })(),
    setFacebookEventHandling: function() {
      $('#login_link').bind('click', function() {
				FB.login(function(r) {}, { scope : 'email,user_likes' });					
		  });
      FB.Event.subscribe('auth.statusChange', function(response) {
				if (response.authResponse) {
					// user has auth'd the app and is logged into Facebook
					$("#imageList").html("<li>loading...</li>");
					FB.api("/me/likes", FEEDME.handleLikes);
				} else {
					// user has not auth'd your app, or is not logged into Facebook
					$('#imageList').html('<li><a href="#" id="login_link">Login</a></li>');
				}
			});
    },
    createListItem: function(pageId,photoSrc) {
      var itemToAppend = '<li id="';
      itemToAppend += pageId;
      itemToAppend += '" style="margin:15px;"><a href="//facebook.com/';
      itemToAppend += pageId;
      itemToAppend += '" target="_blank"><img class="likeImage" width="';
      itemToAppend += ($("#imageListHolder").width() - 30);
      itemToAppend += 'px" src="';
      itemToAppend += photoSrc;
      itemToAppend += '"/></a></li>';
      return itemToAppend;
    },      	
  	handleLikes: function(response) {
			$("#imageList").html("<li>Things you like:</li>");
			$.each(response.data, function() {
				FB.api('/' + this.id, FEEDME.handlePhoto);
			});
		},
	  handlePhoto: function(aLike) {
			if (aLike.cover != undefined) { 
				$("#imageList").append(FEEDME.createListItem(aLike.id,aLike.cover.source));
				$('#' + aLike.id + ' > a').bind('mouseover', function(){
			    $(this).parent('li').css({position:'relative'});
			    var img = $(this).children('img');
			    $('<div class="shadeImage" />').html('<a href="//facebook.com/' + aLike.id + '"target=_blank" >'+ aLike.name + '</a>').css({
		        'height': ((img.height()/2) + 12),
		        'width': img.width() - 20,
		        'background-color': 'black',
		        'position': 'absolute',
		        'top': 0,
		        'left': (($(this).parent().width() - img.width()) / 2),
		        'opacity': 0.0, 
		        'margin': '0 auto',
		        'text-align':'center',
		        'line-height':Math.floor(img.width() / 20) + 'px',
		        'padding':((img.height()/2) - 10) + 'px 10px 0',
		        'font-size':Math.floor(img.width() / 20) + 'px',
		        'font-weight':'bold',
			    }).bind('mouseleave', function(){
				    $(this).fadeOut('fast', function(){
	            $(this).remove();
		        });
			    }).insertAfter(this).animate({
		        'opacity': 0.8
			    }, 'fast');
				});  
			}
		}
	});
  
  //pretty much put all FB dependent DOM ready shit here (runs after SDK is loaded and FEEDME is extended)
  FEEDME.handleResize();
  FEEDME.resizeToFitWindow();
  FEEDME.setFacebookEventHandling();
};  	