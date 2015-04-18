$(function() {
    // var width = $('.row.meme-image img').width();
    // var height = $('.row.meme-image img').height();
    // var aspect = width / height,
    //     image = $('.row.meme-image img'),
    //     container = image.parent();
    // $(window).on('resize', function() {
    //     var width = $('.row.meme-image img').width();
    //     var height = $('.row.meme-image img').height();
    //     var maxWidth = 400; // Max width for the image
    //     var maxHeight = 300; // Max height for the image
    //     var ratio = 0;
    //     var targetWidth = container.width();
    //     console.log(width);
    //     console.log(height);
    //     // Check if the current width is larger than the max
    //     if (width > maxWidth) {
    //         ratio = maxWidth / width; // get ratio for scaling image
    //         $('.row.meme-image img').css("width", maxWidth); // Set new width
    //         $('.row.meme-image img').css("height", height * ratio); // Scale height based on ratio
    //         height = height * ratio; // Reset height to match scaled image
    //         width = width * ratio; // Reset width to match scaled image
    //     } else {
    //         image.attr("width", targetWidth);
    //     }

    //     // Check if current height is larger than max
    //     if (height > maxHeight) {
    //         ratio = maxHeight / height; // get ratio for scaling image
    //         $('.row.meme-image img').css("height", maxHeight); // Set new height
    //         $('.row.meme-image img').css("width", width * ratio); // Scale width based on ratio
    //         width = width * ratio; // Reset width to match scaled image
    //     } else {
    //         image.attr("height", Math.round(targetWidth / aspect));
    //     }
    // }).trigger("resize");

		var width = $('.row.meme-image').width();
    var height = $('.row.meme-image').height();
		var aspect = width / height,
        image = $('.row.meme-image'),
        container = image.parent();
      $(window).on('resize', function() {
      	var windowWidth = $(window).width();
	      var targetWidth = container.width();
	      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
	      {
	      	image.attr("width", 300);
		      image.attr("height", Math.round(300/aspect));
	      }
	      else
	      {
		      if(windowWidth >= 580)
		      {
		        console.log(targetWidth/2)
		        image.attr("width", 495);
		        image.attr("height", Math.round(495 / aspect));
		      }
		      else
		      {
		      	image.attr("width", targetWidth);
		      	image.attr("height", Math.round(targetWidth/aspect));
		      }
		    }
      }).trigger("resize");

          $('#data-information ul#dropdown2 li a').click(function(e){

              $.ajax({
                    url: '/data',
                    data: JSON.stringify(data),
                    type: 'POST',
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        console.log(response);
                        //  Render checkboxes...To select the paths to be drawn
                    },
                    error: function(error) {
                        console.log(error);
                    },
                    dataType: "json"
                });

    // $('.row.meme-image img').each(function() {

    //     var ratio = 0;  // Used for aspect ratio
    //     var width = $(this).width();    // Current image width
    //     var height = $(this).height();  // Current image height




});