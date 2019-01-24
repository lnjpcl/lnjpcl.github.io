$(function(){

	$('#backgrounds img').click(function() {
	
		var newClass = 'BG' + $(this).attr('id');
		$('body').removeClass().addClass(newClass);
	
	});
	
});