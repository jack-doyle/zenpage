var SEARCH_BASE = 'https://encrypted.google.com/#q=';
var searchInput = document.querySelector('.search__input');

searchInput.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
	var keycode = event.which || event.keyCode;
	if (keycode === 13) {
		google();
	}
}

function google() {
	var query = searchInput.value;
	window.location.href = SEARCH_BASE + query;
}