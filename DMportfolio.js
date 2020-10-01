var currentFilter = ""

const filterPortEntries = (e) => {
  currentFilter = e.target.innerHTML;
  hidePortEntries(currentFilter);
}

const hidePortEntries = (currentFilter) => {

  var portEntries = document.querySelectorAll("div.PortfolioEntry")
  var clearFilter = document.querySelectorAll("div.ClearFilter")

  clearFilter[0].classList.remove('hidden')
  clearFilter[0].innerHTML = "Remove filter for " + currentFilter

  for(i=0; portEntries.length; i++) {
    if( currentFilter == portEntries[i].dataset.type || 
        currentFilter == portEntries[i].dataset.language ||
        currentFilter == portEntries[i].dataset.library
      ) {
        portEntries[i].classList.remove('hidden'); 
      } else {
        portEntries[i].classList.add('hidden'); 
      }
  }
}

const showPortEntries = () => {

  var portEntries = document.querySelectorAll("div.PortfolioEntry")
  var clearFilter = document.querySelectorAll("div.ClearFilter")

  clearFilter[0].classList.add('hidden')

  for(i=0; portEntries.length; i++) {
    portEntries[i].classList.remove('hidden'); 
  }
}

const addListeners = () => {

  var skillPills = document.querySelectorAll("div.skillPill")

  for(let i=0; skillPills.length; i++){
    skillPills[i].
      addEventListener("click", filterPortEntries, false);
  }
  
}

