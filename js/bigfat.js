$(function(){
	 $('#btn').click(function(){
		if($('#pardwer').val()===''){
			alert('请输入密码')
		}else if($('#pardwer').val()==='function'){
			$('#visNow').removeClass('visibility')
			$('#profiles').css({
				'display':'none'
			})
		}else{
			alert('密码错误')
		}
	})
	var $container = $('#container'),
		loading = false,
		currentVideoInterval,
		$loader = $('<div class="loader"></div>').hide();
	
	function classToggle($elem, className) {
	
		$('.' + className).removeClass(className);
		$elem.addClass(className);
		
		if (className == 'loading') {
		
			$('.loader').remove();
			$elem.append($loader);
			$loader.fadeIn(400);
		
		}
	}
	
	
	function openItem() {
	
		var $elem = $(this),
			$openContent = $(".item.open .content"),
			$content = $elem.children('.content'),
			imageURL = $content.attr('image-id'),
			videoId = $content.attr('video-id'),
			videoWidth = $content.attr('width-id'),
			videoHeight = $content.attr('height-id'),
			$slider = $content.parent().find(".seek");
			$playpause = $slider.siblings(".playpause");

		$openContent.tubeplayer("pause");
		
		if (loading) { console.log('still loading, returning'); return };
		
		if (imageURL) {

			$content.html('<img src="' + imageURL + '" />');
			classToggle($elem, 'loading');
			loading = true;
		
		}
		
		if (videoId) {
			
			$content.css({'width' : videoWidth, 'height' : videoHeight}); //resizing content area for isotope
			$content.tubeplayer({
			
				initialVideo: videoId,
				width: videoWidth,
				height: videoHeight,
				showControls: 0,
				modestbranding: true,
				iframed: false, //Stops buggy behaviour with iframe version and isotope
				onPlayerPlaying: sliderPlaying,
				allowFullScreen: false,
				onPlayerPaused: function() {
					clearInterval(currentVideoInterval);
					$playpause.removeClass('playing');
				}
		
			});
			// $content.html('<video src="' + videoId + '"  autoplay="autoplay" style="width:100%;height:100%" controls="controls"></video>');
			// classToggle($elem, 'loading');
			// loading = true;
			function sliderPlaying() {
				
				lightsOff($elem, true);
				
				$playpause.addClass('playing');
				clearInterval(currentVideoInterval); //Prevents more than one interval
				
				currentVideoInterval = window.setInterval(function() {
				
					var value = $content.tubeplayer("data");
					
					console.log(Math.floor(value.currentTime/value.duration*100));
					$slider.slider("option", "value", Math.floor(value.currentTime/value.duration*100));
				
				}, 2000);
			
			}
		
			$slider.on("slidestop", function(event, ui){
			
				var sliderPos = $(this).slider( "option", "value" ),
					value =  $content.tubeplayer("data");
				
				$content.tubeplayer("seek", Math.floor(value.duration/100*sliderPos));
				
			});
			
			$playpause.off("click").on("click", function() { //unbind with "off" to stop multiple bindings of same button
				console.log(1111);
				if ($(this).hasClass('playing')) {
				
					$content.tubeplayer("pause");
				
				} else {
				
					$content.tubeplayer("play");
				
				}
			
			})
		
		}
		
		$content.waitForImages( function () {
			
			loading = false;
			
			$openContent.tubeplayer("destroy"); //Removes any video elements
			$openContent.parent().find(".seek").slider("option", "value", 0); //resets slider of closed video element
			$openContent.parent().find(".playpause").removeClass("playing"); //Resets play button
			
			$('.loading').removeClass('loading');
			$('.loader').remove();
			
			classToggle($elem, 'open');
			
			$('.item').off('click', openItem); //Open item no longer clickable
			$('.item:not(.open)').on('click', openItem); //Rebind all closed items
			
			$('.item img').off('click', lightsOff); //Unbind any lights off
			$(".item img").off('mousemove', bulbTip); //Unbind any Tooltip bulb
			$('.open:not(.info) img').on('click', lightsOff); //Lights off bind
			$(".open:not(.info) img").on('mousemove', bulbTip); //Tooltip bulb
			$(".open:not(.info) img").on('mouseout', function() {
			
				$('#lightbulb').hide();
			
			});
			
			
			$("html").addClass("scrolling"); // Fixes scroll bug by making page very high for a moment
			
			$container.isotope('reLayout', function() {
			
				var position = $elem.data('isotope-item-position'),
					positionY = position.y - 100;
					containerHeight = $container.height();
					
				if (positionY < 0) { positionY = 0} 
			
				$("body").scrollTo(positionY, 500, {easing: "easeInOutQuad"})
				$("html").removeClass("scrolling");
				
			});
				
				
		});
		
		
	};
	
	function lightsOff($elem, video) {
		
		
		$('.item img').off('mousemove', bulbTip); //Unbind tooltip
		$(".open:not(.info)").on('mouseover', function() {
		
			$('#lightbulb').hide();
			
		});
		
		if (video != true) {
		
			var $elem = $(this).parents('.item');

		}
		
		$elem.addClass('lightsOff');
		$('#overlay').show('fade', 'fast', function() {
		
			$('#lightbulb').hide();
		
		});

	}
	
	function lightsOn() {
		
		$('#overlay').hide('fade', 'fast', function() {
		
			$('#lightbulb').hide();
			$(".open:not(.info) img").on('mousemove', bulbTip); //Tooltip bulb
		
		});
		
		$('.lightsOff').removeClass('lightsOff');
	
	}
	
	function bulbTip(e) {
		
		console.log('bulbtip');
		$('#lightbulb').show().css({
		
			top: (e.pageY - 15) + "px",
            left: (e.pageX + 15) + "px"
		
		});
	
	}
	
	//Building ribbon stuffs
	$('.item:not(.info) h4').each(function() {
	
		$(this).wrap('<div class="ribbonHead"></div>').after('<div class="ribbonBack"></div>');
		
	})
	
	$('.item:not(.info) h5.categories').each(function() {
	
		$(this).wrap('<div class="ribbonTag" />').after('<div class="ribbonBack"></div>');
	
	})
	
	$('.item:not(.info) h5.caption').each(function() {
	
		$(this).wrap('<div class="ribbonTag ribbonCaption" />').after('<div class="ribbonBack ribbonCaption"></div>');
	
	})

	$('.item.video h5.caption').each(function() {
	
		$(this).append('<div class="playpause"></div><div class="seek"></div>');
	
	})
	
	//binding stuffs
	$(window).on('mousewheel', function() {
		
		$(window)._scrollable().stop(); //Cancels scrolling animation when mousewheel is used, to stop conflict.
		
	}) 
	
	$('#overlay').on('click', lightsOn);
	$('#overlay').on('mousemove', bulbTip);
	
	$('.item:not(.open)').on('click', openItem);
	
	$('#nav ul li').on('click', function() {
		
		
		var filter = $(this).children('a').attr('data-filter');
		
		$('.selected').removeClass('selected');
		$(this).addClass('selected');
		
		
		$container.isotope({
		
			filter: '.static' + ' ,' + filter
			
		}, function() {
	
			$(window).stop().scrollTo($("#container"), 500, {easing: "easeInOutQuad"});
		
		})
	
	});
	
	$container.isotope({
		masonry: {
			columnWidth: 193
		},
		itemPositionDataEnabled: true,
		transformsEnabled: false
		
	});
	
	
	
	$(".seek").slider({range: "min", min: 0});
	



});