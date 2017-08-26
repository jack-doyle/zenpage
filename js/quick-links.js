var quickLinks = document.querySelector('.quick-links');

loadQuickLinks();

function loadQuickLinks() {
	chrome.storage.sync.get({
		selectedSites: []
	}, function(items) {
		items.selectedSites
			.filter(function(site) { 
				return site.selected; 
			})
			.forEach(function(site) {
				var link = makeLink(site);
				quickLinks.appendChild(link);
		});
	});
}

function makeLink(site) {
	var siteInfo = find(site.name);

	var a = document.createElement('a');
	a.href = siteInfo.url;

	var icon = document.createElement('span');
	icon.classList.add('fa', siteInfo.icon);

	a.appendChild(icon);
	return a;
}

function find(siteName) {
	return siteInfo.filter(function(site) {
		return site.name === siteName;
	})[0];
}