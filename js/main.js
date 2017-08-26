(function() {
	var timeDisplay = document.querySelector('.time');
	var dateDisplay = document.querySelector('.date');
	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	var hintRight = document.querySelector('.hint.right');
	var hintBottom = document.querySelector('.hint.bottom');

	var bookmarks = document.querySelector('.bookmarks');
	var bookmarksWrap = document.querySelector('.bookmarks-wrap');
	var bookmarksBtn = hintBottom.querySelector('span:last-child');
	var loadImageBtn = hintRight.querySelector('span:last-child');
	var closeBtn = document.querySelector('.hint.top.left span:last-child');

	document.addEventListener('click', function(e) {
		if (bookmarksBtn.contains(e.target) && !bookmarks.classList.contains('open')) {
			openBookmarks();
		} else if (bookmarks.classList.contains('open') && !bookmarksWrap.contains(e.target)) {
			closeBookmarks();
		} else if (closeBtn.contains(e.target) && bookmarks.classList.contains('open')) {
			closeBookmarks();
		} else if (loadImageBtn.contains(e.target)) {
			document.querySelector('.hint.right').classList.add('animated', 'jello');
			document.querySelector('.hint.right').classList.remove('animated', 'jello');
			loadImage();
		}
	});

	document.addEventListener('keydown', function(e) {
		if (e.keyCode === 66 && e.ctrlKey && !bookmarks.classList.contains('open')) {
			openBookmarks();
		} else if (e.keyCode === 27 && bookmarks.classList.contains('open')) {
			closeBookmarks();
		} else if (e.keyCode === 67 && e.ctrlKey) {
			document.querySelector('.hint.right').classList.add('animated', 'jello');
			loadImage();
		}
	});

	hintRight.addEventListener('animationend', resetAnimation);	

	setInterval(tick, 1000);

	function openBookmarks() {
		bookmarks.classList.add('open');
		document.querySelector('.container').style.filter = 'blur(2px)';
		document.querySelector('.background').style.filter = 'blur(2px)';
	}

	function closeBookmarks() {
		bookmarks.classList.remove('open');
		document.querySelector('.container').style.filter = 'none';
		document.querySelector('.background').style.filter = 'brightness(50%) contrast(80%)';
	}

	function resetAnimation() {
		this.classList.remove('animated', 'jello');
	}

	function tick() {
		var t = moment().format("HH:mm:ss");
		var d = moment().format("dddd, MMMM Do YYYY");
		timeDisplay.innerHTML = Sanitizer.escapeHTML(t);
		dateDisplay.innerHTML = Sanitizer.escapeHTML(d);
	}
})();