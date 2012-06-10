var idx = 0;

$( function() {
    var pictures = [],
        $pointer = $( '#pointer' ),
        $thumbnails = $( '#thumbnails' ),
        $title = $( '#title' ),
        $pause = $( '#pause' ),
        $flash = $( '#flash' ),
        $volume = $( '#volume' );

	$pause.show();
    // Buzz audio library

    buzz.defaults.formats = [ 'ogg', 'mp3' ];

    var trafficSound = new buzz.sound( 'sounds/Tsukiji' ),
        clickSound = new buzz.sound( 'sounds/c' ),
        focusSound = new buzz.sound( 'sounds/fs' ),
        rewindSound = new buzz.sound( 'sounds/r' ),
        cameraSounds = new buzz.group( clickSound, focusSound, rewindSound );

    if ( !buzz.isSupported() ) {
        $volume.hide();    
    }
    
    $pause.click(function() {
    	trafficSound.loop().play().fadeIn( 5000 );
    	$pause.hide();
    	
    trafficSound.loop().play().fadeIn( 5000 );

    // jScrollPane

    $thumbnails.find( 'ul' ).width( function() {
        var totalWidth = 0;
        $( this ).find( 'li' ).each( function() {
            totalWidth += $( this ).outerWidth( true );
        });
        return totalWidth;
    });

    $thumbnails.jScrollPane();

    var jScrollPaneApi = $thumbnails.data( 'jsp' );

    $( window ).bind( 'resize', function() {
        jScrollPaneApi.reinitialise();
    });

    // Vegas Background

    $thumbnails.find( 'a' ).each( function() {
        pictures.push({
            src: $( this ).attr( 'href' ),    
            title: $( this ).find( 'img' ).attr( 'title' ),
            valign: $( this ).find( 'img' ).data( 'valign' )
        });
    })

    $.vegas( 'slideshow', { 
        backgrounds: pictures,
        delay: 4000
     })( 'overlay' );
     
     $(document).keydown(function(e){
     			var max_thumbs = $("#thumbnails").find("ul").find("li").length;
			    if (e.keyCode == 37) { 
			       if (idx > 1) {
				       $("#" + (idx-1)).click();
				       idx = idx-1;
			       }
			       return false;
			    }
			    if (e.keyCode == 39) { 
			       if (idx < max_thumbs) {
				       $("#" + (idx+1)).click();
				       idx = idx+1;
			       }
			       return false;
			    }
			});
            
    $( 'body' ).bind( 'vegasload', function( e, img ) {
        var src = $( img ).attr( 'src' ),
            idx = $( 'a[href="' + src + '"]' ).parent( 'li' ).index();
            
            // Updated by Rio
            if (idx > 0) {
            	$title.fadeOut();
            	$volume.animate( { top: '20px' });
		        $thumbnails.animate( { top: '-90px' });
            }
            if (idx == 0) {
            	$title.fadeIn();
            }
            
           
			
//            $('body').mousemove(function(event) {
//            	$volume.animate( { top:'100px' });
//		        $thumbnails.animate( { top:'0px' });
//
//            });

        focusSound.play();
    
        
        //$flash.show().fadeOut( 1000 );

        var pointerPosition = $thumbnails.find( 'li' ).eq( idx ).position().left;
            
        $pointer.animate({
            left: pointerPosition
        }, 500);

        if ( ( pointerPosition > $thumbnails.width() || pointerPosition < jScrollPaneApi.getContentPositionX() ) && !$thumbnails.is( ':hover' ) ) {
            jScrollPaneApi.scrollToX( pointerPosition, true );
        }

        $pointer.click( function() {
            $thumbnails.find( 'a' ).eq( idx ).click()
        });
    });

    // Volume button

    $volume.click( function() {
        if ( $( this ).hasClass( 'all' ) ) {
            cameraSounds.unmute();
            trafficSound.mute();
        
            $( this ).removeClass( 'all' ).addClass( 'some' );
        } else if ( $( this ).hasClass( 'some' ) ) {
            cameraSounds.mute();
            trafficSound.mute();
        
            $( this ).removeClass( 'some' ).addClass( 'none' );
        } else {
            cameraSounds.unmute();
            trafficSound.unmute();
        
            $( this ).removeClass( 'none' ).addClass( 'all' );
        }
        return false;
    });

    // Photograph
	$('.vegas-overlay').click( function() {
		$volume.animate( { top:'100px' });
		$thumbnails.animate( { top:'0px' });
	});
	
    $thumbnails.find( 'a' ).click( function() {
        //$pause.show();
        //$pointer.hide();
    	//$thumbnails.fadeOut();
    	
        $volume.animate( { top: '20px' });
        $thumbnails.animate( { top: '-90px' });
        //$title.animate( { bottom: '-90px' });    

        var idx = $( this ).parent( 'li' ).index();
        $.vegas( 'slideshow', { step: idx } )( 'pause' );

        rewindSound.play();
    
        return false;
    });
    });
    
});