var bookmarks = document.querySelector('.bookmarks-wrap');

loadBookmarks();

function loadBookmarks() {
    chrome.storage.sync.get({
        bookmarks: []
    }, function(items) {
        if (items.bookmarks.length === 0) {
            var bookmarksInfo = document.createElement('div');
            bookmarksInfo.classList.add('bookmarks-info');
            
            var title = document.createElement('span');
            title.textContent = 'No bookmarks yet.';
            title.classList.add('title');

            var subtitle = document.createElement('p');
            subtitle.innerHTML = 'Add bookmarks on the <a href="options.html">options page</a>.';
            subtitle.classList.add('subtitle');

            bookmarksInfo.appendChild(title);
            bookmarksInfo.appendChild(subtitle);

            bookmarks.appendChild(bookmarksInfo);
        } else {
            items.bookmarks.forEach(function(bookmark) {
                var newCategory = document.createElement('div');
                newCategory.classList.add('category');

                var categoryNameHtml = `<div class="category__name">${bookmark.category}</div>`;
                var categoryLinksHtml = buildLinks(bookmark.links);

                newCategory.innerHTML = Sanitizer.escapeHTML(categoryNameHtml + categoryLinksHtml);
                bookmarks.appendChild(newCategory);
            });
        }
    });
}

function buildLinks(links) {
    var html = '<div class="category__links"><ul>';

    links.forEach(function(link) {
        html += `<a href="${link.url}"><li>${link.title}</li></a>`;
    });

    html += '</ul></div>';
    return html;
}
