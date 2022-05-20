let modalQt = 1; // Quantidade padrão estabelecida assim que o usuário abrir o modal de pedidos
let cart = [] // Aqui recebemos um array do carrinho de compras, onde será exibida a lista de pizzas inseridas
let modalKey = 0 // A informação inicial de seleção de sabor de pizza em '0'

const c = (element) => document.querySelector(element);
const cs = (element) => document.querySelectorAll(element);
    // criamos a const para retornar sempre a variável "c" do querySelector através da arrow function, e evitar a repetição do document.QuerySelector no código, deixando mais enxuto.
    // lembrando que na variável CS retornará um array dos itens que foram encontrados no HTML


// LISTAGEM DAS PIZZAS
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // preencher as informações em pizza item

    pizzaItem.setAttribute('data-key', index);
    // Aqui setamos o atributo e selecionamos a chave de uma determinada pizza, através do seu ID ou key, para a exibição no modal
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {e.preventDefault();
    // na tag "a" que é o link, adicionamos um evento de clique, ou seja, iremos previnir que ele execute a função padrão, através da função preventDefault()

    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    // Em seguida, criamos uma variável, que irá procurar o item mais próximo na class pizza-item, através da função 'closest()'
    // Ao entrar na class, pegaremos o atributo através da função getAttribute() e selecionaremos a chave data-key através da div, e ai pegaremos esse atyributo e exibiremos no modal
    
    modalQt = 1; 
    // Aqui setamos a quantidade padrão que irá aparecer inicialmente no modal assim que o usuário for escolher a sua pizza
    
    modalKey = key; // Aqui será exibido qual é a pizza selecionada no modal, que irá aparecer no carrinho


    // SESSÃO DO MODAL
    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaInfo--actualPrice').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
    c('.pizzaInfo--size.selected').classList.remove ('selected');
    cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    // Nesta sessão estabelecemos um querySelectorAll através do "cs" e criamos um loop com forEach() na class .pizzaInfo--size 
     if (sizeIndex == 2) {
         size.classList.add('selected');  // Quando o size index estiver no item '2' (pizza grande), ele irá adicionar a class 'selected'
     }
    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    // Aqui iremos atribuir os tamanhos das pizzas que ficaram na tag "span" do HTML, e acessamos as informações através do pizzaJson[key] e selecionamos os tamanhos através de sizes[sizeIndex]

    });

    c('.pizzaInfo--qt').innerHTML = modalQt;

    c('.pizzaWindowArea').style.opacity = 0; 
    // setamos a opacidade em 0 para ficar em exibição nula
    c('.pizzaWindowArea').style.display = 'flex';
    // adicionamos o display flex diretamente do JS para a exibição da janela
    setTimeout (()=>{
        c('.pizzaWindowArea').style.opacity = 1;
    },200);
    // setamos a função setTimeout() para a exibição da opacidade em 100% em 0,2 milesegundos e ser basicamente uma exibição animada e instantanea.

    });
    

    c('.pizza-area').append(pizzaItem);
    // através do append criamos a ligação entre os elementos da variável pizzaItem sem a substituição apenas a soma dos elementos contidos na variável

});

// EVENTO DE CANCELAMENTO DE PEDIDO NO MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0; 
    setTimeout (()=>{
        c('.pizzaWindowArea').style.display = 'none';
}, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
item.addEventListener('click', closeModal)
});

// EVENTO DE ADICIONAR MAIS OU MENOS UNIDADES DE PIZZA

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }      
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// EVENTO DE SELECIONAR O TAMANHO DA PIZZA DE FORMA ALTERNADA ENTRE PEQUENA, MÉDIA E GRANDE.

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
   
     size.addEventListener('click', ()=>{
    c('.pizzaInfo--size.selected').classList.remove ('selected');
    size.classList.add('selected');
})
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;
    // Criamos um identificador da pizza que irá está selecionada 
    // através da concatenação do id da pizza + @ + o tamanho dela
    
    let key = cart.findIndex((item)=> item.identifier == identifier); // nesta linha estamos fazendo uma verificação no carrinho caso o item tenha sido selecionado
    if (key > -1) {
        cart(key).qt += modalQt; // se item 'key' é maior que -1 então a quantidade será exibida no carrinho, adicionando a quantidade desejada.
    } else {  // caso o contrário, o usuário ainda não adicionou a pizza no carrinho, ai sim, procedemos com o push das informações.
    cart.push ({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
});
}
    closeModal();
    updateCart();
});


// ADICIONANDO EVENTOS DE CLIQUE NO MOBILE PARA ABRIR E FECHAR O CARRINHO
c('.menu-openner').addEventListener ('click', ()=>{

if (cart.length > 0) {

  c('aside').style.left = '0';
}
});
c('.menu-closer').addEventListener ('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length; // Aqui inserimos no menu do mobile a função de add a pizza no carrinho



    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; // Aqui ao adicionarmos um item no carrinho, automaticamente ele irá zerar para a adição de mais itens

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
         // criamos um loop onde ao selecionarmos a pizza, o pizzaJson vai percorer os itens e vai selecionar o item específico que irá receber a verificação no cart
        // e retornará um array com as especificações da pizza, incluindo a imagem.
            subtotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true); // Aqui pegamos os itens da divs e faremos um clone para a exibição na tela através do clonenode(true)
        
        let pizzaSizeName;  // Aqui é a exibição das pizzas no carrinho pelo seu tamanho através de um switch
            switch(cart[i].size) {
            case 0:
                pizzaSizeName = 'P';
                break;
            case 1:
                pizzaSizeName = 'M';
                break;
            case 2:
                pizzaSizeName = 'G';
                break;
            }
        
        let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; // Criamos um template string para a exibição ocorrer em forma de string no carrinho

            cartItem.querySelector('img').src = pizzaItem.img;  // Aqui vai exibir a imagem da pizza selecionada no carrinho
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; // Aqui vai exibir o nome da pizza selecionada no carrinho
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; // Aqui vai exibir a quantidade de pizzas adicionadas ao carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
            if (cart[i].qt > 1) {
                cart[i].qt--;
                 
            } else {
                cart.splice(i, 1);
            }
                updateCart();
            
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
       
            c('.cart').append(cartItem);
    } 

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
        } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
        }
}