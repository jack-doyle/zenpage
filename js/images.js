var images = [];
var background = document.querySelector('.background');
var credit = document.querySelector('.credit');

// Caches 20 random photos
var PATH_BASE = 'https://api.unsplash.com/photos';
var PATH_RANDOM = '/random';
var PATH_UTM = '?utm_source=startpage&utm_medium=referral&utm_campaign=api-credit';
var PARAM_FEATURED = 'featured=true';
var PARAM_ORIENTATION = 'orientation=landscape';
var PARAM_COUNT = 'count=20';
var url = PATH_BASE + PATH_RANDOM + '?' + PARAM_FEATURED + '&' + PARAM_ORIENTATION + '&' + PARAM_COUNT;

function loadImage() {
    if (images.length === 0) {
        getImages(url, function(result) {
            images = JSON.parse(result).map(function(image) {
                return {
                    url: image.urls.full,
                    user: image.user
                };
            });

            setImage(images[0]);
        });
    } else {
        var current = images.pop();
        setImage(current);
    }
}

function getImages(url, callback) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200)
            callback(xhr.responseText);
    }
    xhr.open("GET", url, true); // true for asynchronous
    xhr.setRequestHeader('Authorization', 'Client-ID ' + APP_ID);
    xhr.send(null);
}

function setImage(image) {
    background.style.backgroundImage = 'url(' + image.url + ')';
    credit.innerHTML = Sanitizer.escapeHTML(makeAttributionUrl(image.user));
}

function makeAttributionUrl(user) {
    var url =
        '<a href="' +
        user.links.html +
        PATH_UTM +
        '">Photo by ' +
        user.name +
        '</a> / <a href="https://unsplash.com">Unsplash</a>';

    return url;
}

loadImage();
