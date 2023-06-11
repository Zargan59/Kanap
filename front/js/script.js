let url = `http://localhost:3000/api/products`;



fetch(url)
    .then((response) =>
    response.json().then((data) => {



        const items = document.querySelector('#items');
        const nbKanap = data.length;
        let kanapImage = data[0].imageUrl
        console.log(kanapImage)
        


            for (let i = 0; i < nbKanap; i+=1)
            {
                //Créer le nouveau lien
                const A = document.createElement("a");
                items.appendChild(A);
                A.setAttribute('href', './product.html?id=' + data[i]._id) ;
                
                const ARTICLE = document.createElement("article") ;


                //L'image correspond au nouveau lien
                const IMG = document.createElement("img") ;
                IMG.setAttribute('src',data[i].imageUrl);
                IMG.setAttribute('alt',data[i].altTxt)
                ARTICLE.appendChild(IMG);
                A.appendChild(ARTICLE);
                
                //Le Nom correspond au canapé
                const H3 = document.createElement("h3") ;
                H3.setAttribute('class',data[i].name)
                H3.innerHTML = data[i].name;
                ARTICLE.appendChild(H3);
                
                
                //La description correspond au canapé
                const P = document.createElement("p");
                P.setAttribute('class',data[i].description)
                P.innerHTML = data[i].description;
                ARTICLE.appendChild(P);
            }
    })
    
    ).catch(err => console.log('Erreur : ' + err));
    
