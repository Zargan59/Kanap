let url = `http://localhost:3000/api/products`;



/***************Récupéraction de l'id dans la page du produit*****************/
const URL_ID = location.search;
const urlSearchParams = new URLSearchParams(URL_ID);
const ID = urlSearchParams.get("id");
// console.log(ID);

fetch(`http://localhost:3000/api/products/${ID}`)
    .then((response) =>
        response.json().then((data) => {


            /***************Affichage des informations du produit*****************/
            /*Création de l'image du canapé*/
            const ItemIMG = document.querySelector('.item__img');
            const IMG = document.createElement("img")
            ItemIMG.appendChild(IMG);
            IMG.src = data.imageUrl
            IMG.alt = data.altTxt;


            /*Création du nom et prix du canapé*/
            const Title = document.querySelector("#title");
            const Price = document.querySelector("#price");
            Title.innerHTML = data.name;
            Price.innerHTML = data.price;

            /*Création de la description du canapé*/
            const Descr = document.querySelector("#description")
            Descr.innerHTML = data.description

            /*Création des options de couleurs du canapé*/
            const nbColors = data.colors.length;
            const colorKanap = document.querySelector("#colors")
            // console.log(nbColors);
            for (let i = 0; i < nbColors; i++) {

                let COLOR = document.createElement("option")
                COLOR.setAttribute('value', data.colors[i])
                COLOR.innerHTML = data.colors[i];
                colorKanap.appendChild(COLOR);
            }




            // ********************** Bouton ajouter au panier **********************


            // const quantiteKanap = document.querySelector('#quantity')
            const btnPanier = document.querySelector('#addToCart')
            const idColor = document.querySelector('#colors');

            function MessageAlert() {

                let choixQuantity = document.querySelector('#quantity').value;
                /******Message d'erreur si la commande n'est pas valide******/
                if (idColor.value == "" && choixQuantity == "0") {
                    alert('Veuillez choisir une couleur et une quantité')
                }
                else if (idColor.value == "") {
                    alert('Veuillez choisir une couleur')
                }
                else if (choixQuantity == "0") {
                    alert('Veuillez choisir une quantité')
                }
                return
            }
            
            btnPanier.addEventListener('click', (event) => {
            let choixQuantity = document.querySelector('#quantity').value;

                if (idColor.value == "" || choixQuantity == 0) {
                    event.preventDefault();
                    MessageAlert();
                    console.log("J'appelle la fonction ALERT");
                }

                else {
                    
                    // const quantitySelected = document.querySelector('#quantity')
                    const choixColor = idColor.value;
                    // let choixQuantite = quantitySelected.value

                    /***************** Variable contenant les informations qu'on souhaite stocker *****************/
                    let optionKanap = {
                        name: data.name,
                        id: data._id,
                        color: choixColor,
                        quantity: Number(choixQuantity),
                    };
                    if (choixQuantity < 0 || choixQuantity>100){
                        alert("ERREUR : La valeur saisie est incorrecte")  
                    }
                    
                    else{
                    console.log("Le nb ajouté est : "+ choixQuantity);
                    let ProductInLS = JSON.parse(localStorage.getItem("product"))
                    //Si le panier comporte au moins un article
                    if (ProductInLS) {
                        const FindKanap = ProductInLS.find((el) => el.id === ID && el.color === choixColor);
                        //Si le kanap est déjà dans le panier
                        if (FindKanap) {
                            console.log('Le kanap est déjà dans le panier');
                            let NewQuantity = parseInt(optionKanap.quantity) + parseInt(FindKanap.quantity);
                            FindKanap.quantity = NewQuantity
                            //Si la quantité est supérieur à 100
                            if (NewQuantity >100){
                                alert("La valeur dans le panier ne peut pas être supérieur à 100")
                            }
                            if(NewQuantity<=100){
                                alert("Le canapé à bien été ajouté au panier")
                                localStorage.setItem("product", JSON.stringify(ProductInLS))
                                // console.table(ProductInLS);
                            }

                        }
                        //Si le Kanap n'est pas dans le LS
                        else {
                            ProductInLS.push(optionKanap)
                            localStorage.setItem("product", JSON.stringify(ProductInLS))
                            console.log(ProductInLS);
                            console.log('Ce canapé n est pas dans le panier');
                        }
                    }
                    //Si le panier est vide
                    else {
                        ProductInLS = []
                        ProductInLS.push(optionKanap);
                        localStorage.setItem("product", JSON.stringify(ProductInLS))
                        console.log(optionKanap);
                        console.log('Le panier est vide');
                    }
                    console.log(choixQuantity);
                }

                }
            })//Fin de l'event on click
        })


    ).catch(err => console.log('Erreur : ' + err));