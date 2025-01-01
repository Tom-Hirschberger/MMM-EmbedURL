// on form_loaded event
$(document).on('form_loaded1', function () {
	// find all the elements of our when selection list and get the selected option in each
	let counter = 0
	$('.m_MMM-EmbedURL .embed').each(
		// process each
		function(){
			if(counter++ & 1){
				$(this).css("background-color",'#d2e0d2')
			}
		}
	)
})