function updatePage() {
  var pages = ["home", "about", "schedule", "faq"];

  for (var i = 0; i < pages.length; i++) {
    var page = document.getElementById(pages[i]);

    if (page === null) {
      continue;
    }

    if (!page.classList.contains("hidden")) {
      page.classList.add("hidden");
    }
  }

  var newPageId = window.location.hash.substring(1);

  if (!pages.includes(newPageId)) {
    newPageId = "home";
  }

  document.getElementById(newPageId).classList.remove("hidden");
}

window.onhashchange = updatePage;

window.onload = function() {
  if (window.location.hash.length !== 0) {
    updatePage();
  }
};
