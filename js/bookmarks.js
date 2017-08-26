var bookmarks = document.querySelector('.bookmarks-wrap');

loadBookmarks();

function loadBookmarks() {
    chrome.storage.sync.get({
        bookmarks: []
    }, function(items) {
        if (items.bookmarks.length === 0) {
            var heading = document.createElement('h1');
            bookmarks.appendChild(heading);
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
