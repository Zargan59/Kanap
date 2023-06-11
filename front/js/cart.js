let itemInLS = JSON.parse(localStorage.getItem("product"));
let url = `http://localhost:3000/api/products`;

fetch(`http://localhost:3000/api/products`)
  .then((response) =>
    response.json().then((data) => {

      let data_ = data;

      AffichagePanier(data_)
      ModifQuantity()
      SauverPanier()
      SupprimerKanap(data_)
      Form()
      AllPriceInBasket(data_)
      AllProductInBasket()
      
      Commander()
    }))//Fin du fetch

function SauverPanier() {
  localStorage.setItem("product", JSON.stringify(itemInLS))
}
/*************Nombre d'article dans le panier*******************/
function AllProductInBasket() {
  let totalArticle = 0;
  for (let product of itemInLS) {

    totalArticle += product.quantity
    // console.log("ici "+ product.quantity);
  }
  const totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.textContent = totalArticle
  // console.log("la "+ totalArticle);
  // console.log(totalQuantity.textContent);
}

/*************Prix total des articles dans le panier*******************/
function AllPriceInBasket(data_) {
  let totalPrice = 0
  //Pour chaque kanap dans le local storage
  for (let produit of itemInLS) {
    //On cherche le prix dans l'API grace à l'id
    const dataAPI = data_.find((e) => e._id == produit.id)
    // console.log(produit.id);
    let prix = dataAPI.price
    //On multiplie par le même nombre de Kanap présent dans le localStorage
    totalPrice += prix * produit.quantity
  }
  let PrixTotal = document.querySelector("#totalPrice")
  PrixTotal.textContent = Intl.NumberFormat('fr-FR').format(totalPrice)
  // console.log(data_); 
}

//////
function Update(data_){
  setTimeout(() => {
    AllPriceInBasket(data_)
    AllProductInBasket()
  }, 100);
}

/*************Modifier la quantité*******************/
function ModifQuantity() {
  //Je récupère le input de la quantité
  let InputQuantity = document.querySelectorAll(".itemQuantity");

  for (let l = 0; l < InputQuantity.length; l++) {

    InputQuantity[l].addEventListener('change', (e) => {
      e.preventDefault();
      let NewQuantity = Number(e.target.value);
      if(NewQuantity < 1 || NewQuantity>100){
        alert("La valeur saisie n'est pas correct")
      }
      else{

        const CLOSEST_ARTICLE = InputQuantity[l].closest("article");
        const ID_PRODUIT = CLOSEST_ARTICLE.dataset.id;
        const COLOR_PRODUIT = CLOSEST_ARTICLE.dataset.color;

        //On reécupère les spécificités du Kanap
        const findKanap = itemInLS.find(element => {
          return element.id === ID_PRODUIT && element.color === COLOR_PRODUIT
        })
        findKanap.quantity = NewQuantity;
        SauverPanier()
      }
      
    })
  }
}



/*************Supprimer un produit*******************/
function SupprimerKanap(data_) {

  let btn_Suppr = document.querySelectorAll(".deleteItem");
  for (let j = 0; j < btn_Suppr.length; j++) {

    btn_Suppr[j].addEventListener("click", (event) => {

      event.preventDefault();
      const CLOSEST_ARTICLE = event.target.closest("article")
      const ID_PRODUIT = CLOSEST_ARTICLE.dataset.id;
      const COLOR_PRODUIT = CLOSEST_ARTICLE.dataset.color;
      
      itemInLS = itemInLS.filter(element => element.id !== ID_PRODUIT || element.color !== COLOR_PRODUIT)
      alert("Le produit à été supprimé de votre panier")
      
      CLOSEST_ARTICLE.remove();
      SauverPanier()
      Update(data_)
    })
  }

 }//Fin fonction SupprimerKanap

/*************Produit dans le localStorage*******************/
function AffichagePanier(data_) {

  for (let i = 0; i < itemInLS.length; i++) {

    const dataAPI = data_.find((e) => e._id == itemInLS[i].id)
    // console.log(dataAPI);
    // console.log(itemInLS[i].id);
    const ARTICLE = document.createElement("article");
    ARTICLE.classList.add("cart__item")
    ARTICLE.dataset.id = itemInLS[i].id
    ARTICLE.dataset.color = itemInLS[i].color
    document.querySelector("#cart__items").appendChild(ARTICLE)

    const DIV_IMG = document.createElement("div");
    DIV_IMG.classList.add("cart__item__img")
    const IMG = document.createElement("img");

    IMG.src = dataAPI.imageUrl
    IMG.alt = dataAPI.altTxt;
    DIV_IMG.appendChild(IMG);
    ARTICLE.appendChild(DIV_IMG);

    const DIV_ITEM_CONTENT = document.createElement("div");
    DIV_ITEM_CONTENT.classList.add("cart__item__content");
    ARTICLE.appendChild(DIV_ITEM_CONTENT);

    const DIV_INFO = document.createElement("div")
    DIV_INFO.classList.add("cart__item__content__description")
    const H2 = document.createElement("h2")
    const P_COLOR = document.createElement("p")
    const P_PRICE = document.createElement("p")

    DIV_INFO.appendChild(H2)
    DIV_INFO.appendChild(P_COLOR)
    DIV_INFO.appendChild(P_PRICE)
    DIV_ITEM_CONTENT.appendChild(DIV_INFO)

    P_COLOR.innerHTML = itemInLS[i].color;
    H2.innerHTML = itemInLS[i].name;
    P_PRICE.innerHTML = Intl.NumberFormat("fr-FR").format(dataAPI.price) + "€";

    const DIV_CONTENT_SETTINGS = document.createElement("div")
    DIV_CONTENT_SETTINGS.classList.add("cart__item__content__settings")

    const DIV_SETTINGS_QUANTITY = document.createElement("div")
    DIV_SETTINGS_QUANTITY.classList.add("cart__item__content__settings__quantity")
    const P_Quantity = document.createElement("p")
    P_Quantity.innerHTML = 'Qté : '
    const INPUT = document.createElement("input")
    INPUT.setAttribute("type", "number")
    INPUT.classList.add("itemQuantity")
    INPUT.setAttribute("name", "itemQuantity")
    INPUT.setAttribute("min", 1)
    INPUT.setAttribute("max", 100)
    INPUT.setAttribute("value", itemInLS[i].quantity)
    INPUT.addEventListener("change", () => Update(data_))

    DIV_ITEM_CONTENT.appendChild(DIV_CONTENT_SETTINGS)
    DIV_CONTENT_SETTINGS.appendChild(DIV_SETTINGS_QUANTITY)
    DIV_SETTINGS_QUANTITY.appendChild(P_Quantity)
    DIV_SETTINGS_QUANTITY.appendChild(INPUT)

    const DIV_CONTENT_DELETE = document.createElement("div")
    DIV_CONTENT_DELETE.classList.add("cart__item__content__settings__delete")
    const PdeleteItem = document.createElement("p")
    PdeleteItem.classList.add("deleteItem")
    PdeleteItem.innerHTML = "Supprimer"
    DIV_CONTENT_DELETE.appendChild(PdeleteItem)
    DIV_CONTENT_SETTINGS.appendChild(DIV_CONTENT_DELETE)
  }
}

let value = 0;
/***********Validation du formulaire***************/
function Form() {
  const form = document.querySelector(".cart__order__form");

  /*****FirstName*****/
  firstName = document.querySelector("#firstName");

  const NameRegExp = new RegExp("^[a-zA-Z-\s]{2,50}$");
  let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$')
  let AdresseRegExp = new RegExp("^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ,.' -]+$")
  // ('/^\s*\S+(?:\s+\S+){2}/')

  form.firstName.addEventListener("change", function () { validFirstName(firstName) });

  const validFirstName = function () {
    let firstNameMessageError = firstName.nextElementSibling;

    if (NameRegExp.test(firstName.value)) {
      firstNameMessageError.innerHTML = "Le champs renseigné est valide";
      firstNameMessageError.style.color = 'green';

    } else {
      firstNameMessageError.innerHTML = " Le champs renseigné n'est pas valide";
      firstNameMessageError.style.color = 'red';
      value +=1
    }
  };

  /*****LastName*****/
  let LastName = document.querySelector("#lastName");

  form.lastName.addEventListener("change", function () { validLastName() })

  const validLastName = function () {
    let lastNameMessageError = LastName.nextElementSibling;

    if (NameRegExp.test(LastName.value)) {
      lastNameMessageError.innerHTML = "Le champs renseigné est valide";
      lastNameMessageError.style.color = 'green';
    }
    else {
      lastNameMessageError.innerHTML = " Le champs renseigné n'est pas valide";
      lastNameMessageError.style.color = 'red'
      value +=1

    }
  };

  /*****Adresse*****/
  let Adresse = document.querySelector("#address");

  form.address.addEventListener("change", function () { validAdress() })
  const validAdress = function () {
    let adressMessageError = Adresse.nextElementSibling;
    if (AdresseRegExp.test(Adresse.value)) {
      adressMessageError.innerHTML = "Le champs renseigné est valide";
      adressMessageError.style.color = 'green';
    } else {
      adressMessageError.innerHTML = "Le champs renseigné n'est pas valide";
      adressMessageError.style.color = 'red';
      value +=1

    }

  }
  /*****Ville*****/
  let City = document.querySelector("#city");

  form.city.addEventListener("change", function () { validCity() })

  const validCity = function () {
    let cityError = City.nextElementSibling;

    if (NameRegExp.test(City.value)) {
      cityError.innerHTML = "Le champs renseigné est valide";
      cityError.style.color = 'green';
    }
    else {
      cityError.innerHTML = " Le champs renseigné n'est pas valide";
      cityError.style.color = 'red'
      value +=1
    }
  };
  /*****Mail*****/
  let Mail = document.querySelector("#email");

  form.email.addEventListener("change", function () { validmail() })

  const validmail = function () {
    let mailError = Mail.nextElementSibling;

    if (emailRegExp.test(Mail.value)) {
      mailError.innerHTML = "Le champs renseigné est valide";
      mailError.style.color = 'green';
    }
    else {
      mailError.innerHTML = " Le champs renseigné n'est pas valide";
      mailError.style.color = 'red'
      value +=1
    }
    return value
  };
}//Fin de la fonction Form


/***********Bouton "Commander"***************/
let formRempli = 0 

function formComplet(){
    const form = document.querySelector(".cart__order__form")
    const input = form.querySelectorAll("input")
    //Pour chaque donné du formulaire on vérifie que la case ne soit pas vide
    input.forEach((input) => {
      //Si elle est vide je renvoie que le formulaire n'est pas complet
        if(input.value === ""){
            // alert("Veillez à remplir tous les champs")
            formRempli+= 1
          }
          //Sinon je renvoie que le formulaire est complet
        else{
    console.log("Cette valeur est bonne");
  }
});
}


function Commander(){
  const Btn_Command = document.querySelector('#order');
  
  Btn_Command.addEventListener("click", (e) =>{
    e.preventDefault()
    formComplet()
    console.log(value);

    if(formRempli >=1){
      console.log("Formulaire incomplet");
      alert("Veillez à remplir tous les champs")
      formRempli = 0
    }
    else if(value >=1){
      alert("Veillez à remplir correctement tous les champs")
      value = 0
    }
    else{
      Post()
      console.log("Formulaire complet");
    }
  })
}  

function Post(){
  if(itemInLS.length === 0) {
    alert("Votre panier est vide")
    return
  }

  if(formComplet())return

  else{
    let inputFirstName = document.querySelector("#firstName")
    let inputLastName = document.querySelector("#lastName")
    let inputAddress = document.querySelector('#address')
    let inputCity = document.querySelector("#city")
    let inputMail = document.querySelector('#email')
    
    let newCart = []

      for(let product of itemInLS) { 
        newCart.push(product.id)
      }    

      const order = {
        contact : {
          firstName : inputFirstName.value,
          lastName: inputLastName.value,
          address : inputAddress.value,
          city : inputCity.value,
          email : inputMail.value
        },
        products: newCart,
      };
      // console.log(order);
       
      const postInfos = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-type": 'application/json'
        },
        body: JSON.stringify(order),
    };

        fetch("http://localhost:3000/api/products/order", postInfos)
        .then((res)=> res.json())
        .then((orderData) => 
        {
          console.log("Commande envoyé");
          localStorage.clear();
          document.location.href = "confirmation.html?orderId=" + orderData.orderId;
        })
        .catch((error)=> console.log(error))
}
}



 

    