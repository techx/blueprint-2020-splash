function getChild(arr, clss){
  for(let i=0; i < arr.length; i++){
    if (arr[i].className === clss){
      return arr[i]
    }
  }
}

// menu selectors
const allItems = {'home':["menu-play","menu-register","menu-schedule","menu-faq","menu-about"],
                  'schedule':["schedule-learn", "schedule-hack"],
                  'about':["about-learn","about-hack"]}
var currentSelected = {"home": 0, "schedule": 0, "about": 0}

for (let [key, menuItems] of Object.entries(allItems)){
  for(let i=0; i < menuItems.length; i++){
    let item = document.getElementById(menuItems[i])
    if (item === null){
      console.log(menuItems[i])
    }
    item.onmouseover = function(){
      for (let j=0; j < menuItems.length; j++){
        lol = document.getElementById(menuItems[j]).childNodes
        selector = getChild(lol, "selected")
        if(selector.parentNode == item){
          selector.style.opacity = 1;
          let newIdx = menuItems.indexOf(selector.parentNode.id)
          if(newIdx !== -1){ currentSelected[key] = newIdx }
        }
        else {
          selector.style.opacity = 0;
        }
      }
    }
  }
}

document.addEventListener('keydown', handleFaq)

const faqItems = document.getElementsByClassName("faq-q")
var currentFaq = 0

for(let i=0; i < faqItems.length; i++){
  faqItems[i].onmouseover = function(){
    for (let j of faqItems){
      j.style.color = "#fff"
    }
    faqItems[i].style.color = '#fff600'
    currentFaq = i
  }
}

function handleFaq(e){
  oldFaq = currentFaq;
  if(window.location.hash.substring(1) === 'faq'){
    if(e.key === "ArrowUp"){
      currentFaq= (faqItems.length + currentFaq - 1) % faqItems.length
    }
    else if(e.key === "ArrowDown"){
      currentFaq = (faqItems.length + currentFaq + 1) % faqItems.length
    }
    else if(e.key === "Enter") {
      faqItems[currentFaq].click()
    }
    // console.log(oldFaq, currentFaq)
    faqItems[oldFaq].style.color = '#fff'
    faqItems[currentFaq].style.color = '#fff600'
    // console.log(faqItems[currentFaq], faqItems[currentFaq] === document.activeElement)
  }
}

document.addEventListener('keydown', handleMenu);

function handleMenu(e){
  let url = window.location.hash.substring(1);
  if(url === ''){
    url = "home"
    console.log(url)
  }
  let oldSelected = currentSelected[url]
  if(Object.keys(allItems).includes(url) && (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter")){
    menuItems = allItems[url]
    if(e.key === "ArrowUp"){
      currentSelected[url] = (menuItems.length + currentSelected[url] - 1) % menuItems.length
    }
    else if(e.key === "ArrowDown"){
      currentSelected[url] = (menuItems.length + currentSelected[url] + 1) % menuItems.length
    }
    else if(e.key === "Enter" && (url !== 'register' && url !== 'play')) {
      bruh = document.getElementById(menuItems[currentSelected[url]])
      console.log(bruh)
      bruh.click()
    }
    console.log(oldSelected, currentSelected[url])
    document.getElementById(menuItems[oldSelected]).childNodes[3].style.opacity = 0;
    document.getElementById(menuItems[currentSelected[url]]).childNodes[3].style.opacity = 1;
  }
  else if(e.key === "Escape"){
    const menuButton = document.getElementById("menu-button");
    if(!menuButton.classList.contains("hidden")){
      menuButton.click()
    }

  }
}

document.addEventListener('keydown', handleReplay);
function handleReplay(e){
  url = window.location.hash.substring(1)
  if(e.key === "Enter" && (url === 'lose' || url === 'win')){
    document.getElementById('win-button').click()
  }
}

