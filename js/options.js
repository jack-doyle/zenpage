var sitesOptions = document.querySelectorAll('.site');
var weatherLocationOption = document.querySelector('#weather-location');
var weatherCelsiusOption = document.querySelector('#celsius');
var weatherFahrenheitOption = document.querySelector('#fahrenheit');
var weatherDisplayOption = document.querySelector('#display-weather');

function saveBookmarks() {
    var bookmarks = [];
    var bookmarksOptions = document.querySelectorAll('.bookmark-option-category');
    var categoryErrors = document.querySelectorAll('.error.error--category-name');
    var linkErrors = document.querySelectorAll('.error.error--category-links');

    // Reset error messages
    categoryErrors.forEach(setEmpty);
    linkErrors.forEach(setEmpty);

    // Validation
    bookmarksOptions.forEach(function(option, index) {
      var categoryName = option.querySelector('input').value;
      var categoryLinks = option.querySelectorAll('.bookmark-option-link');

      // Empty category name with at least one link
      if (categoryName.length === 0 && [].some.call(categoryLinks, validLink)) {
        handleCategoryError('Category name cannot be empty.', index);
      }

      // Category name but no complete links
      if (categoryName.length > 0 && ![].some.call(categoryLinks, validLink)) {
        handleCategoryError('Category must contain at least one bookmark.', index);
      }

      // Incomplete links
      if ([].some.call(categoryLinks, incompleteLink)) {
        handleLinkError(index);
      }
    });
 
    // If no errors
    if ([].every.call(categoryErrors, isEmpty) && [].every.call(linkErrors, isEmpty)) {
      bookmarksOptions.forEach(function(bookmark, index) {
          var categoryName = bookmark.getElementsByTagName('input')[0].value;
          var categoryLinksOptions = bookmark.getElementsByClassName('bookmark-option-link');

          var categoryLinks = [];

          Array.prototype.forEach.call(categoryLinksOptions, function(link) {
              var link = {
                  title: link.getElementsByTagName('input')[0].value,
                  url: link.getElementsByTagName('input')[1].value
              };

              categoryLinks.push(link);
          });

          categoryLinks = categoryLinks.filter(function(link) { return link.title.length > 0 && link.url.length > 0 })

          bookmarks.push({
              category: categoryName,
              links: categoryLinks
          });
      });

      bookmarks = bookmarks.filter(function(bookmark) { return bookmark.category.length > 0 });

      chrome.storage.sync.set({
          bookmarks: bookmarks
      }, function() {
          notifySave();
      });
    }

    function setEmpty(node) {
      node.textContent = '';
    }

    function isEmpty(node) {
      return node.textContent === '';
    }

    function validLink(link) {
      return [].every.call(link.querySelectorAll('input'), function(linkValue) {
        return linkValue.value.length > 0;
      });
    }

    function emptyLink(link) {
      return [].every.call(link.querySelectorAll('input'), function(linkValue) {
        return linkValue.value.length === 0;
      });
    }

    function incompleteLink(link) {
      var inputs = link.querySelectorAll('input');

      return [].some.call(inputs, function(linkValue) {
          return linkValue.value.length === 0;
        }) && [].some.call(inputs, function(linkValue) {
          return linkValue.value.length > 0;
        });
    }
}

function saveQuickLinks() {
    function getCheckbox(site) {
      return site.getElementsByTagName('input')[0];
    }

    var selectedSites = [].map.call(sitesOptions, function(site) {
      return {
        name: getCheckbox(site).id,
        selected: getCheckbox(site).checked
      };
    });

    chrome.storage.sync.set({
        selectedSites: selectedSites
    }, function() {
        // Update status to let user know options were saved.
        notifySave();
    });
}

function saveWeatherOptions() {
  var weatherUnits = 'c';

  if (weatherFahrenheitOption.checked) {
    weatherUnits = 'f';
  }

  var weatherOptions = {
    show: weatherDisplayOption.checked,
    units: weatherUnits,
    location: weatherLocationOption.value
  };

  chrome.storage.sync.set({
    weather: weatherOptions
  });
}

function saveOptions() {
    saveBookmarks();
    saveQuickLinks();
    saveWeatherOptions();
}

function notifySave() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
        status.textContent = '';
    }, 750);
}

function handleCategoryError(message, index) {
    var categoryStatus = document.querySelectorAll('.error.error--category-name')[index];
    categoryStatus.textContent = message;
}

function handleLinkError(index) {
  var linkStatus = document.querySelectorAll('.error.error--category-links')[index];
  linkStatus.textContent = 'You have one or more incomplete bookmarks.';
}

function restoreBookmarks() {
  chrome.storage.sync.get({ bookmarks: [] }, function(items) {
    var bookmarks = items.bookmarks;
    var len = bookmarks.length > 3 ? bookmarks.length : 3; // Default 3 categories

    var bookmarksList = document.querySelector('.bookmark-options ul');

    for (var i = 0; i < len; i++) {
      var bookmarkCategory = document.createElement('li');
      bookmarkCategory.classList.add('bookmark-option-category');

      var categoryInput = document.createElement('input');
      categoryInput.placeholder = 'Category';
      categoryInput.value = bookmarks[i] ? bookmarks[i].category : '';
      categoryInput.type = 'text';

      var categoryStatus = document.createElement('span');
      categoryStatus.classList.add('error', 'error--category-name');

      bookmarkCategory.appendChild(categoryInput);
      bookmarkCategory.appendChild(categoryStatus);

      var linksList = document.createElement('ul');
      var linkStatus = document.createElement('span');
      linkStatus.classList.add('error', 'error--category-links');
      linksList.appendChild(linkStatus);

      var linkElements = makeLinks(bookmarks[i] ? bookmarks[i].links : []);

      linkElements.forEach(function(el) {
        linksList.appendChild(el);
      });

      bookmarkCategory.appendChild(linksList);
      bookmarksList.appendChild(bookmarkCategory);
    }
  });
}

function makeLinks(links) {
  var linksList = document.createElement('ul');
  var linksElements = [];
  var len = links.length > 3 ? links.length : 3; // Default 3 links per category

  for (var j = 0; j < len; j++) {
    var linkEl = document.createElement('li');
    linkEl.classList.add('bookmark-option-link');

    var linkTitleInput = document.createElement('input');
    linkTitleInput.placeholder = 'Name';
    linkTitleInput.value = links[j] ? links[j].title : '';
    linkTitleInput.type = 'text';

    var linkUrlInput = document.createElement('input');
    linkUrlInput.placeholder = 'Url';
    linkUrlInput.value = links[j] ? links[j].url : '';
    linkUrlInput.type = 'text';

    linkEl.appendChild(linkTitleInput);
    linkEl.appendChild(linkUrlInput);
    linksElements.push(linkEl);
  }

  return linksElements;
}

function restoreQuickLinks() {
  chrome.storage.sync.get({
        selectedSites: []
    }, function(items) {
        items.selectedSites.forEach(function(site) {
            document.getElementById(site.name).checked = site.selected;
        });
    });
}

function restoreWeatherOptions() {
  chrome.storage.sync.get({
    weather: {}
  }, function(options) {
    if (options.weather.show) {
      weatherDisplayOption.checked = true;
    }

    if (options.weather.units === 'c') {
      weatherCelsiusOption.checked = true;
    } else if (options.weather.units === 'f') {
      weatherFahrenheitOption.checked = true;
    }

    if (options.weather.location) {
      weatherLocationOption.value = options.weather.location;
    }
  });
}

function restoreOptions() {
  restoreQuickLinks();
  restoreBookmarks();
  restoreWeatherOptions();  
}

function enableAutocomplete() {
  var autocomplete = new google.maps.places.Autocomplete(weatherLocationOption);
}

function getCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      if (position) {
        getFormattedLocation(position, setLocation);
      } else {
        alert('Error getting location. Please manually enter your location in the text box.');
      }
    }, function(error) {
      alert('Error: ' + error.message);
    });
  } else {
    alert('Your browser doesn\'t support geolocation. Please manually enter your location in the text box.');
  }
}

function getFormattedLocation(position, callback) {
  var request = new XMLHttpRequest();
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyAm8PKuGMBtijZo_1uvv0vgaDZWbXyssoM";

  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {

        var response = JSON.parse(request.responseText);
        var formattedLocation = response.results.filter(isCity)[0].formatted_address;

          if (callback && typeof callback === "function") {
            callback(formattedLocation);
          }
      } else {
          alert('Error getting location information.');
      }
    }
  }

  request.open('GET', url);
  request.send();
}

function setLocation(formattedLocation) {
  weatherLocationOption.value = formattedLocation;
}

function isCity(address) {
  return address.types.indexOf("locality") > -1;
}

document.querySelector('.geolocate').addEventListener('click', getCurrentLocation);

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);
