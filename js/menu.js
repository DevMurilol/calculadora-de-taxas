function clickMenu() {
    const itens = document.getElementById("itens");
    const menu = document.getElementById("menuHamburguer");
  
    if (itens.style.display == "block") {
      itens.style.display = "none";
      menu.style.color = "#FFFFFF";
    } else {
      itens.style.display = "block";
      menu.style.color = "#000000";
    }
  }
  function escondeMenu() {
    const itens = document.getElementById("itens");
    const menu = document.getElementById("menuHamburguer");
  
    if (itens.style.display == "block") {
      itens.style.display = "none";
      menu.style.color = "#FFFFFF";
    }
  }
  