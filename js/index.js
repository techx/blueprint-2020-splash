function updatePage() {
  var pages = ["home", "about", "schedule", "faq"];
  var newPageId = window.location.hash.substring(1);

  if (!pages.includes(newPageId)) {
    return;
  }

  for (var i = 0; i < pages.length; i++) {
    var page = document.getElementById(pages[i]);

    if (page === null) {
      continue;
    }

    if (!page.classList.contains("hidden")) {
      page.classList.add("hidden");
    }
  }

  document.getElementById(newPageId).classList.remove("hidden");

  var menuButton = document.getElementById("menu-button");

  if (newPageId === "home") {
    menuButton.classList.add("hidden");
  } else {
    menuButton.classList.remove("hidden");
  }
}

window.onhashchange = updatePage;

window.onload = function() {
  if (window.location.hash.length !== 0) {
    updatePage();
  }
};
