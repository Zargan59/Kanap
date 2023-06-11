//Je retourne dans l'url la valeur de l'orderId
const url = new URL(location.href)
const orderID = url.searchParams.get("orderId")
//Affichage du numéro de commande
const orderIDElement = document.querySelector("#orderId")
orderIDElement.innerHTML = orderID;


