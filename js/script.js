/*
 * Proyecto de recuperación - Dawcas
 * */

const rx = { 
    "name": /^.{10,60}$/,
    "email": /^(.+\.)*.+@(.+\.)*.+$/,
    "tlf": /^(\d{3}(-|\s)?){2}\d{3}$/,
    "subject": /^.{1,50}$/,
    "textUnlimited": /^.{1,}$/,
    "nif": /^[0-9]{7,8}.$/,
    "postalCode": /^[0-9]{5}$/,
    "town": /^.{1,120}$/
}
let emps, cats, prods, ateam;

window.onload = function () {
    ateam = $('#Ateam');
    
    fetch("js/json/employees.json")
        .then(async (ems) => {
            emps = await ems.json();
            
            memberList();
        })
        .catch((err) => {
            alert("Hubo un error, inténtelo de nuevo más tarde.");
            console.log(err);
        });
        
    Promise.all([fetch('js/json/categorias.json'), fetch('js/json/productos.json')])
        .then(async ([c,p]) => {
            cats = await c.json();
            prods = await p.json();
            
            fillSelCat();
            showProds();
            if (localStorage.getItem('cart')) {
                fillCartModal();
            }
        })
        .catch((err) => {
            alert("Hubo un error, inténtelo de nuevo más tarde.");
            console.log(err);
        });
    
    $('#moreStaff').addEventListener('click', function() {
        let divs = ateam.querySelectorAll('div');
        
        for (let div of divs) {
            div.style = 'display: block;'
        }
        
        this.remove();
    });
    
    for (let lic of $$('input[name="license"]')) {
        lic.addEventListener('change', function() {
            if (this.value == 0) {
                try {
                    $('#licenseType').remove();
                } catch (e) {}
            } else if (this.value == 1) {
                let select = newL('select');
                let option;
                let licArr = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
                
                select.id = 'licenseType';
                select.name = 'licenseType';
                select.setAttribute('multiple','');
                
                for (let l of licArr) {
                    option = newL('option');
                    
                    option.value = l;
                    option.innerHTML = l;
                    
                    select.appendChild(option);
                }
                
                this.insertAdjacentElement('afterend', select);
            }
        });
    }
    
    addProvinces();
    
    $('#contactButt').addEventListener('click', goToSection);
    $('#formButt').addEventListener('click', goToSection);
    $('#workButt').addEventListener('click', goToSection);
    $('#cart').addEventListener('click', (e) => {
        e.preventDefault();
        
        $('#cartModal').style.display = 'block';
    });
    
    for (let form of $$('form')) {
        form.addEventListener('submit', function(e) {
            validateForms(e);
        });
    }
    
    $('#selCat').addEventListener('change', () => {
        showProds();
    });
    
    $('#buyButt').addEventListener('click', () => {
        alert('Gracias por realizar tu compra');
        
        localStorage.removeItem('cart');
        emptyCart();
    });
}

//~ ALIASES
//~ Alias for document.querySelector
function $(str) {
    return document.querySelector(str);
}

//~ Alias for document.querySelectorAll
function $$(str) {
    return document.querySelectorAll(str);
}

//~ Alias for newL
function newL(str) {
    return document.createElement(str);
}
//~ END ALIASES

//~ Function to determine if an element is empty
function isempty(e) {
    return (e === undefined || e === null || e === '' || e=== [] || e == 0 || !e);
}

function memberList() {
    for (let [k,v] of emps.entries()) {
        let div = newL('div');
        let h3 = newL('h3');
        let p = newL('p');
        let img = newL('img');
        
        div.className = 'w3-half';
        h3.innerHTML = v.name;
        p.innerHTML = v.position+'<br>'+v.contact.email+'<br>'+v.contact.mbl;
        p.className = 'w3-half';
        img.src = 'media/img/'+v.pics[0];
        img.className = 'w3-half';
        img.style = 'max-width: 9em; max-height: 7em;';
        
        h3.addEventListener('click', function() {
            showMemb(k);
        });
        img.addEventListener('click', function() {
            showMemb(k);
        });
        img.addEventListener('mouseover', function() {
            toggImg(this, v.pics[1]);
        });
        img.addEventListener('mouseout', function() {
            toggImg(this, v.pics[0]);
        });
        
        div.appendChild(h3);
        div.appendChild(img);
        div.appendChild(p);
        
        if (k > 1) {
            div.style = 'display: none;'
        }
        
        ateam.querySelector('input').insertAdjacentElement('beforebegin', div);
    }
}

function toggImg(img,pic) {
    img.src = 'media/img/'+pic;
}

function showMemb(k) {
    let memb = $('#memb');
    let butt = newL('input');
    let img = newL('img');
    let h4 = newL('h4');
    let h5 = newL('h5');
    let h6 = newL('h6');
    let contact = newL('div');
    let studies = newL('div');
    let experience = newL('div');
    let div = newL('div');
    let p = newL('p');
    let desps;
    
    ateam.style.display = 'none';
    memb.style.display = 'block';
    
    img.src = 'media/img/'+emps[k].pics[0];
    img.className = 'w3-third';
    
    h4.innerHTML = emps[k].name;
    h4.style = 'width: 100%;';
    h5.innerHTML = emps[k].position;
    h5.style = 'width: 100%; margin-bottom: 25%;';
    
    contact.className = 'desp';
    studies.className = 'desp';
    experience.className = 'desp';
    
    h6.innerHTML = 'Contacto';
    h6.style = 'border: 1px solid black;'
    
    p.innerHTML = 'Email: '+emps[k].contact.email;
    div.appendChild(p);
    p = newL('p');
    p.innerHTML = 'Teléfono: '+emps[k].contact.tlf;
    div.appendChild(p);
    p = newL('p');
    p.innerHTML = 'Móvil: '+emps[k].contact.mbl;
    div.appendChild(p);
    
    contact.appendChild(h6);
    contact.appendChild(div);
    
    h6 = newL('h6');
    h6.innerHTML = 'Formación académica';
    h6.style = 'border: 1px solid black;'
    div = newL('div');
    div.style.display = 'none';
    
    for (let [y,v] of emps[k].studies.entries()) {
        let tit = newL('p');
        let pla = newL('p');
        let time = newL('p');
        
        tit.style = 'font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em;';
        
        tit.innerHTML = emps[k].studies[y].title;
        pla.innerHTML = emps[k].studies[y].place;
        time.innerHTML = emps[k].studies[y].start+' - '+emps[k].studies[y].finish;
        
        div.appendChild(tit);
        div.appendChild(pla);
        div.appendChild(time);
        
        if (y !== (emps[k].studies.length-1)) {
            let hr = newL('hr');
            
            div.appendChild(hr);
        }
    }
    
    studies.appendChild(h6);
    studies.appendChild(div);
    
    h6 = newL('h6');
    h6.innerHTML = 'Experiencia profesional';
    h6.style = 'border: 1px solid black;'
    div = newL('div');
    div.style.display = 'none';
    
    for (let [y,v] of emps[k].experience.entries()) {
        let com = newL('p');
        let pos = newL('p');
        let time = newL('p');
        
        com.style = 'font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em;';
        
        com.innerHTML = emps[k].experience[y].company;
        pos.innerHTML = emps[k].experience[y].position;
        time.innerHTML = emps[k].experience[y].start+' - '+emps[k].experience[y].finish;
        
        div.appendChild(com);
        div.appendChild(pos);
        div.appendChild(time);
        
        if (y !== emps[k].experience.length-1) {
            let hr = newL('hr');
            
            div.appendChild(hr);
        }
    }
    
    experience.appendChild(h6);
    experience.appendChild(div);
    
    
    
    butt.className = 'w3-button w3-black w3-margin-bottom';
    butt.type = 'button';
    butt.value = 'Volver'
    butt.style = 'margin-top: 3em; margin-left: 42%; margin-right: 42%;'
    butt.addEventListener('click', () => {
        memb.style.display = 'none';
        ateam.style.display = 'block';
        
        memb.innerHTML = '';
    });
    
    memb.appendChild(img);
    memb.appendChild(h4);
    memb.appendChild(h5);
    memb.appendChild(contact);
    memb.appendChild(studies);
    memb.appendChild(experience);
    memb.insertAdjacentElement('beforeend', butt);
    
    desps = $$('.desp');
    
    for (let desp of desps) {
        desp.addEventListener('click', toggDesp);
    }
    
    function toggDesp() {
        let all = $$('.desp');
        
        for (let one of all) {
            one.querySelector('div').style.display = 'none';
        }
        
        this.querySelector('div').style.display = 'block';
    }
}

function goToSection() {
    switch(this.id) {
        case 'contactButt':
            $('#contactInfo').style.display = 'block';
            $('#contactForm').style.display = 'none';
            $('#workForm').style.display = 'none';
            location.href = '#contact';
            break;
        case 'formButt':
            $('#contactInfo').style.display = 'none';
            $('#contactForm').style.display = 'block';
            $('#workForm').style.display = 'none';
            location.href = '#contact';
            break;
        case 'workButt':
            $('#contactInfo').style.display = 'none';
            $('#contactForm').style.display = 'none';
            $('#workForm').style.display = 'block';
            location.href = '#contact';
            break;
    }
}

function addProvinces() {
    let select = $('select[name="prov"]');
    
    let provs = ['Álava','Albacete','Alicante','Almería','Asturias','Ávila','Badajoz','Barcelona','Burgos','Cáceres','Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','La Coruña','Cuenca','Gerona','Granada','Guadalajara','Guipúzcoa','Huelva','Huesca','Islas Baleares','Jaén','León','Lérida','Lugo','Madrid','Málaga','Murcia','Navarra','Orense','Palencia','Las Palmas','Pontevedra','La Rioja','Salamanca','Segovia','Sevilla','Soria','Tarragona','Santa Cruz de Tenerife','Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza'];
    
    for (let prov of provs) {
        let op = newL('option');
        
        op.value = prov;
        op.innerHTML = prov;
        
        select.appendChild(op);
    }
}

function validateForms(e) {
    e.preventDefault();
    
    let bgc = '#FFAAAA';
    let flag = true;

    for (let el of e.target) {
        let pattern;
        
        switch(el.name) {
            case 'fullname':
                pattern = rx.name;
                break;
            case 'email':
                pattern = rx.email;
                break;
            case 'tlf':
                pattern = rx.tlf;
                break;
            case 'subject':
                pattern = rx.subject;
                break;
            case 'message':
            case 'address':
            case 'note':
                pattern = rx.textUnlimited;
                break;
            case 'cp':
                pattern = rx.postalCode;
                break;
            case 'town':
                pattern = rx.town;
                break;
            case 'nif':
                var lockup = 'TRWAGMYFPDXBNJZSQVHLCKE';
                var valueDni=el.value.substr(0,el.value.length-1);
                var letra=el.value.substr(el.value.length-1,1).toUpperCase();
                
                if(lockup.charAt(valueDni % 23)!==letra) {
                    el.style.backgroundColor = bgc;
                    flag = false;
                } else {
                    el.style.backgroundColor = '';
                }
                break;
            case 'prov':
            case 'birth':
                if (isempty(el.value)) {
                    el.style.backgroundColor = bgc;
                    flag = false;
                } else {
                    el.style.backgroundColor = '';
                }
                break;
        }
        
        if (pattern) {
            if (!pattern.test(el.value)) {
                el.style.backgroundColor = bgc;
                flag = false;
            } else {
                el.style.backgroundColor = '';
            }
        }
    }
    
    if (flag) {
        let p = newL('p');
        
        if (e.srcElement.name === 'workForm') {
            p.innerHTML = 'Gracias por tu interés en nuestra empresa, estudiaremos tu candidatura y nos pondremos en contacto contigo a la mayor brevedad posible';
        } else if (e.srcElement.name === 'contactForm') {
            p.innerHTML = 'Gracias por contactar con nosotros, nos pondremos en contacto contigo a la mayor brevedad posible';
        }
        
        p.style = 'padding: 1em; background-color: black; color: white;'
        
        e.srcElement.insertAdjacentElement('afterbegin', p);
        
        window.setTimeout(function () {
            p.remove();
        }, 4500);
    }
}

function fillSelCat() {
    let sel = $('#selCat');
    
    for (let cat of cats) {
        let op = newL('option');
        
        op.value = cat.id;
        op.innerHTML = cat.titulo;
        
        sel.appendChild(op);
    }
}

function showProds() {
    let selCat = $('#selCat');
    let id = selCat.value;
    let divProds = $('#prods');
    
    divProds.innerHTML = '';
    
    if (selCat.parentElement.querySelector('p')){
        selCat.parentElement.querySelector('p').remove();
    }
    
    if (id !== '') {
        let p = newL('p');
        let h5 = newL('h5');
        
        h5.innerHTML = cats[id].titulo;
        p.innerHTML = cats[id].descripcion;
        p.insertAdjacentElement('afterbegin', h5);
        
        selCat.insertAdjacentElement('afterend', p);
    }
    
    for (let prod of prods) {
        let content = '';
        
        if (id === '' || id == prod.id_categoria) {
            content = '<img src="media/img/prods/'+prod.imagen+'" alt="Imagen de '+prod.titulo+'" style="max-width:90%;" class="w3-hover-opacity">'+
            '<div class="w3-container w3-white">'+
            '<p><b>'+prod.titulo+'</b></p>'+
            '<p class="w3-opacity">Color: '+prod.color+'</p>'+
            '<p>'+prod.descripcion+'</p>'+
            '<p>Precio: '+parseEUR(prod.precio)+'</p>'+
            '<button class="w3-button w3-black w3-margin-bottom">Añadir al carrito</button>'+
            '</div>';
        }
        
        if (!isempty(content)) {
            let div = newL('div');
            let p, img;
            
            div.className = 'w3-third w3-margin-bottom';
            div.innerHTML = content;
            
            p = div.querySelector('p');
            img = div.querySelector('img');
            
            p.style.cursor = 'pointer';
            img.style.cursor = 'pointer';
            
            p.addEventListener('click', () => {
                toggleProdSheet(prod.id);
            });
            
            img.addEventListener('click', () => {
                toggleProdSheet(prod.id);
            });
            
            div.querySelector('button').addEventListener('click', () => {
                addToCart(prod.id);
            });
            
            divProds.appendChild(div);
        }
    }
    
    toggleProdSheet(false);
}

function toggleProdSheet(id) {
    let prodsDiv = $('#prods');
    let prodSheet = $('#prodSheet');
    
    if (id !== false) {
        feedProdSheet(id);
        
        prodSheet.style.display = 'block';
        prodsDiv.style.display = 'none';
    } else {
        prodSheet.style.display = 'none';
        prodsDiv.style.display = 'flex';
    }
    
    function feedProdSheet(id) {
        let img = newL('img');
        let h6 = newL('h6');
        let desc = newL('p');
        let color = newL('p');
        let price = newL('p');
        let back = newL('button');
        let addCart = newL('button');
        let prod = prods.find((el) => {
            return (el.id == id)?el:false;
        });
        
        prodSheet.innerHTML = '';
        
        img.src = 'media/img/prods/'+prod.imagen;
        img.alt = 'Imagen de '+prod.titulo;
        h6.innerHTML = prod.titulo;
        desc.innerHTML = prod.descripcion;
        color.innerHTML = 'Color: '+prod.color;
        price.innerHTML = 'Precio: '+prod.precio;
        back.innerHTML = 'Volver';
        back.className = 'w3-button';
        back.style.border = '1px solid white';
        back.style.margin = '0.5em';
        addCart.innerHTML = 'Añadir al carrito';
        addCart.className = 'w3-button';
        addCart.style.border = '1px solid white';
        addCart.style.margin = '0.5em';
        
        back.addEventListener('click', () => {
            toggleProdSheet(false);
        });
        
        addCart.addEventListener('click', () => {
            addToCart(id);
        });
        
        prodSheet.appendChild(img);
        prodSheet.appendChild(h6);
        prodSheet.appendChild(desc);
        prodSheet.appendChild(color);
        prodSheet.appendChild(price);
        prodSheet.appendChild(back);
        prodSheet.appendChild(addCart);
    
        location.href = '#shop';
    }
}

function addToCart(id) {
    let cart;
    
    if (!localStorage.getItem('cart')) {
        cart = new Array();
        cart[id] = 1;
    } else {
        cart= localStorage.getItem('cart').split(',');
        if (cart[id]) {
            cart[id]++;
        } else {
            cart[id] = 1;
        }
    }
    
    localStorage.setItem('cart', cart);
    
    fillCartModal();
}

function fillCartModal() {
    let cart = localStorage.getItem('cart').split(',');
    let count = 0;
    let total = 0;
    let table = newL('table');
    
    for (let [k,v] of cart.entries()) {
        let tr = newL('tr');
        
        if (k == 0) {
            let th = newL('th');
            
            th.innerHTML = 'Imagen';
            tr.appendChild(th);
            
            th = newL('th');
            th.innerHTML = 'Nombre';
            tr.appendChild(th);
            
            th = newL('th');
            th.innerHTML = 'Precio';
            tr.appendChild(th);
            
            th = newL('th');
            th.innerHTML = 'Cantidad';
            tr.appendChild(th);
            
            th = newL('th');
            th.innerHTML = 'Total';
            tr.appendChild(th);
            
            table.appendChild(tr);
            tr = newL('tr');
        }
        
        if (v) {
            let td = newL('td');
            
            td.innerHTML = '<img src="media/img/prods/'+prods[k].imagen+'" style="max-width: 4em">';
            tr.appendChild(td);
            
            td = newL('td');
            td.innerHTML = prods[k].titulo;
            tr.appendChild(td);
            
            td = newL('td');
            td.innerHTML = parseEUR(prods[k].precio);
            tr.appendChild(td);
            
            td = newL('td');
            td.innerHTML = v;
            tr.appendChild(td);
            
            td = newL('td');
            td.innerHTML = parseEUR((Math.round(prods[k].precio*v*100)/100));
            tr.appendChild(td);
            
            table.appendChild(tr);
            
            total += Math.round(prods[k].precio*v*100)/100;
            count++;
        }
    }
    
    tr = newL('tr');
    td = newL('td');
    
    td.innerHTML = '<b>TOTAL</b> '+parseEUR(total);
    td.colSpan = '5';
    td.style = 'text-align: right';
    
    tr.appendChild(td);
    table.appendChild(tr);
    
    $('#cartTable').innerHTML = '';
    
    $('#cartTable').appendChild(table);
    
    $('#cCount').innerHTML = count;
}

function emptyCart() {
    $('#cartTable').innerHTML = '';
    
    $('#cCount').innerHTML = 0;
    
    $('#cartModal').style.display = 'none';
    
    location.href = '#shop';
}

function parseEUR(n) {
    return parseFloat(n).toLocaleString('ES', { style: "currency", currency: "EUR", minimumFractionDigits: 2});
}
