function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  
  console.log("tabname: ", tabName);
  document.getElementById(tabName).style.display = "block";
  console.log("display: ", document.getElementById(tabName).style.display);
  evt.currentTarget.className += " active";
}