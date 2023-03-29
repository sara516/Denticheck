// const { ElementDragging } = require("fullcalendar");


function onClick(selector, callback_function){

  $(document).on('click',selector, callback_function);

};

async function delay(timeout){
await new Promise(r => setTimeout(r, timeout));
}

function searchBar(selector){
$(".search_bar").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $(selector).filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

}

function upload_image(file, selector, callback){
if(callback==undefined){callback=function(){};}

let ajax = new XMLHttpRequest();

ajax.upload.onprogress = function(e) {
  var percentComplete = Math.ceil((e.loaded / e.total) * 100);
  $(`${selector} .progress`).css("display","");
  $(`${selector} .progressText`).text(percentComplete+"%");
  $(`${selector} .progressBar`).css("width",percentComplete+"%");

};

ajax.addEventListener("load", function (e) {
    let data = JSON.parse(e.target.response);
  callback(data, 'load');	
}, false);
ajax.addEventListener("error", function (e) {
callback(e, 'error');
}, false);

ajax.addEventListener("abort", function (e) {
callback(e, 'abort');
}, false);

ajax.open("POST",'/uploads');

var formData = new FormData();
formData.append('file', file);
ajax.send(formData);
};


function carousel(selector,passed_options){
try{
$(selector).wrapInner('<div class="swiper-wrapper"></div>');
$(selector).find('.card').addClass('swiper-slide');

var options={  slidesPerView: "auto",   freeModeSticky:true, freeModeMomentumRatio:0.4	};
if(passed_options){
  $.each(passed_options, function(option_title, option_value){
    options[option_title]=option_value;
  })
}

if(GV.swipers[selector]){	GV.swipers[selector].destroy(true, true); }
GV.swipers[selector]= new Swiper (selector, options);
}catch(e){

}
}

function display_card_placeholders($selector, number) {
if ($selector.length == 0)  return; 
$selector.find('.empty-card').remove();
$selector.each(function () {
    
while ($(this).find('.card').length < number) {
        console.log('card number',$(this).find('.card').length);
  var html = `<div class="card empty-card"></div>`;
  $(this).append(html);
}
})

}
function check_form(selector) {
let res = true;
$(`${selector} .required`).each(function () {
  console.log($(this).val())
  if ($(this).val() == "" || $(this).val() == null) {
    res = false;
    $(this).css('border', '1px solid #ff0000a8');
    return true;
  }
  $(this).css('border', 'solid 1px #adb9ca');
})
return res;
}


function check_formulaire(){
var error="";

$('.required').each(function(){  
  $('.massage').html(" ") 
    if(!$(this).val()){
        $(this).css('border','1.5px solid #ff00007d');
        error="Veuillez renseigner tous les champs.";
        html = `<div class="alert">${error}</div>`
        $('.massage').html(html)

    }else{
        $(this).css('border','1.5px solid black');
        
    }
});
$('.require').each(function(){   
    if(!$(this).val()){
        $(this).css('border-color','#ff00007d');
    error="Veuillez renseigner tous les champs.";

    }else{
  
    }
});

if($('#phone-number').val() != $('#phone-number-confirmation').val()){
    $('#phone-number, #phone-number-confirmation').css('border','2px solid red');
    error="Veuillez vérifier votre N° de téléphone";
}else{
    $('#phone-number, #phone-number-confirmation').css('border-bottom','1.5px solid #ff00007d');
}
return error;
}


function initialize_observer($selector, callback){
var options={ threshold: 0.1};
$selector.each(function(){
    var intersectionObserver = new IntersectionObserver(entries => {
        var is_intersecting=true;
        if(entries[0].intersectionRatio <= 0){
            var is_intersecting=false;
        }
        callback($(entries[0].target),is_intersecting, intersectionObserver);
},options);
intersectionObserver.observe(this);

});
}


function launch_animation($target, is_intersecting, intersectionObserver){
if(!is_intersecting){return;}
var animation_name=$target.data('animation');
$target.addClass(animation_name).removeClass('animatable');
intersectionObserver.unobserve($target[0]);
}



async function ajax(url, data) {
console.log(url)
return await $.ajax({ type: "POST", url, data });
} 



function navigate_to(page_name){
$(".page, #bars_menu_container, #overlay").css('display','none')
$(`.page[data-id="${page_name}"]`).css('display','block')
if(!GV.initialize_page[page_name]) return;
GV.initialize_page[page_name]();
GV.page_name = page_name
window.history.pushState({}, "Beker", get_next_page_url(page_name));

} 

onClick(".link", function(){
if(!$(this).data('id')) return;
$('.link').removeClass('selected_link')
$(this).addClass('selected_link')
navigate_to($(this).data('id'));
})


function getCookie(cname) {
let name = cname + "=";
let decodedCookie = decodeURIComponent(document.cookie);
let ca = decodedCookie.split(';');
for(let i = 0; i <ca.length; i++) {
  let c = ca[i];
  while (c.charAt(0) == ' ') {
    c = c.substring(1);
  }
  if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
  }
}
return "";
}

async function get_session_name(){

    try{
        GV.current_user =  getCookie("user_id")
        let data = await ajax('loadCurentUserCompany',{})
        GV.current_obj_user = data.user
        GV.current_company = data.companies 
        GV.current_group = data.group 
     }catch(e){
         $('.loading-container').append('<div class="loading-error">Une erreur s\'est produite</div>');
     
     }

}

function detectClick(callback, longClickDuration) {
  var isMouseDown = false;
  var timeoutId = null;

  function onMouseDown() {
    isMouseDown = true;
    timeoutId = setTimeout(onTimeout, longClickDuration);

  }

  function onMouseUp() {
    if (isMouseDown) {
      isMouseDown = false;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      } else {
        callback("click");
      }
    }
  }

  function onTimeout() {
    isMouseDown = false;
    timeoutId = null;
    callback("longClick");
  }

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
}




async function load_items_session (name,where,  reload = false){

$('.loading-error').remove();
// if(GV[name] && reload){
  try{
    let data = await ajax('load_items',{table_name:name,where});  
        index_itemsWithUsername(data.reponses)
        GV.username = data.username
   }catch(e){
       $('.loading-container').append('<div class="loading-error">Une erreur s\'est produite</div>');
      //  setTimeout(function(){ init_page(name); },2000);
   }
// }
}

async function load_items (select, route,where,  reload = false){

    try{ 
      $(`${select} .loading-placeholder`).html('')
      displayPlaceholder(select)
      
      let data = await ajax(`${route}`,{where});  
      index_items(data.reponses);

      $(`${select} .loading-placeholder`).html('')
  
      for(let element of Object.values(data.reponses)){
        if(Object.values(element).length != 0)return
        PlaceholderisEmpty(select)
      }   
      
     }catch(e){
         $('.loading-container').append('<div class="loading-error">Une erreur s\'est produite</div>');
     }
    
}



async function search_items (route, like, where, row ,reload = false){

$('.loading-error').remove();
    try{
      let data = await ajax(route ,{like, row, where });  
      index_items(data.reponses);
     }catch(e){
         $('.loading-container').append('<div class="loading-error">Une erreur s\'est produite</div>');     
     }
}


function displayPlaceholder(select){
  $(`${select} .loading-placeholder`).html('')
  
  $(`${select} .loading-placeholder`).html(`
    <svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg> 
    `)
    }

function PlaceholderisEmpty(select){

  if($(`${select} .loading-placeholder div`).length == 0 ){
    $(`${select} .loading-placeholder`).html('<div style=" margin: auto;"> <img style="height: 250px; margin: auto;  display: grid;" src="/img/empty.png"></div>');

}else{

  }
}


function index_itemsWithUsername(data){
$.each(data, function(table_name, table_data){
    if( GV[table_name] == undefined ){   GV[table_name]={};  }
    $.each(table_data, function(row_index, row){
        GV[table_name][row.username]=row;
        $.each(row, function(column_name, column_value){
            if(typeof column_value != "string"){return true;}
            if(column_value[0] == '{' || column_value[0] == '['  ){
                try{GV[table_name][row.username][column_name]=JSON.parse(column_value);}catch(e){console.error(e)}              
            }
        });
    });
});
}
function index_items(data){
$.each(data, function(table_name, table_data){
    if( GV[table_name] == undefined ){   GV[table_name]={};  }
    $.each(table_data, function(row_index, row){
        GV[table_name][row.id]=row;
        $.each(row, function(column_name, column_value){
            if(typeof column_value != "string"){return true;}
            if(column_value[0] == '{' || column_value[0] == '['  ){
                try{GV[table_name][row.id][column_name]=JSON.parse(column_value);}catch(e){console.error(e)}              
            }
        });
    });
});
}



function uniqueid(){
var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
do {                
    var ascicode=Math.floor((Math.random()*42)+48);
    if (ascicode<58 || ascicode>64){
        idstr+=String.fromCharCode(ascicode);    
    }                
} while (idstr.length<32);

return (idstr);
}

async function addFromForm(route, form_selector,storage, error_msg){
  var obj = {}

  $(form_selector).find('input, textarea, select').each(function () { 
      if (!$(this).data('id')) {
        return;
      }
        obj[$(this).data('id')] = $(this).val();
      
    });
if(route == '/addnewdocument'){
  obj['src'] = GV.document_name
  obj['picture'] = GV.image_name
}
console.log(obj)
var data = await ajax(route, {obj});

if (data.ok == true) {
  
    $('#error').html('')
    $('.popup, #overlay').css('display','block');
    $('.message').html('Ajouté(e) avec succès')
    $('#side_menu_add_container').css('display','none');
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
    let id=data.id
    storage[id]=data.reponses[id]
    GV.id_memeberStorage = id
}else{
    if(data.ok == "message d'erreur"){
      $('#error').html(error_msg)
    }else{
        $('.popup_problem, #overlay').css('display','block');
        $('.message').html("Un problème s'est produit")
        $('#side_menu_add_container').css('display','none');
        console.log(data.error)
        alert('ça marche pas!')
    }
  }
}
async function addFromObj(route, obj,storage, action){

var data = await ajax(route, obj);

if (data.ok) {
  if(action != ""){
    $('.popup, #overlay').css('display','block');
    $('.message').html(`${action} avec succès`)
    $('#side_menu_add_container').css('display','none');
  }else{  
  }  
    let id=data.id
    console.log(data.reponses, storage, id)
    storage[id]=data.reponses[id]
}else{
    $('.popup_problem, #overlay').css('display','block');
    $('.message').html("Un problème s'est produit")
    $('#side_menu_add_container').css('display','none');
    console.log(data.error)
    alert('ça marche pas!')
 }
}

async function  updateFromValues(id,route,storage, delete_function, obj){

  if(obj==undefined){var obj = {}}else{}
  if(route == '/deletedocument'){
    obj['is_deleted'] = 1
  }
  let data = await ajax(route, {id, obj });
  if (data.ok) {
    if(delete_function != ''){
      $('.popup').css('display','block');
      $('.message').html(`${delete_function == 'remove' ? 'Supprimé(e)' : (delete_function == 'add'? 'Ajouté(e)' : 'Modifié(e)') } avec succès`)
      $('#side_menu_add_container').css('display','none');
    }else{}
    let id=data.id
    storage[id]=data.reponses[id]
  }
  else{
    $('.popup_problem, #overlay').css('display','block');
    $('.message').html("Un problème s'est produit")
    $('#side_menu_add_container').css('display','none');
      console.log(data.error)
    alert('ça marche pas!')
  }
}

async function  updateFromForm(id,route, form_selector,storage, error_msg){

var obj = {}
$(form_selector).find('input, textarea, select, .btn_create_link').each(function () {
    if (!$(this).data('id')) {
      return;
    }
      obj[$(this).data('id')] = $(this).val();
      console.log($(this).val())
  });
  if(route == '/updatedocument'){
    obj['src'] = GV.document_name
    obj['picture'] = GV.image_name
  }
let data = await ajax(route, {
    id,
    obj
  });

if (data.ok) {
  $('.popup').css('display','block');
  $('.message').html('Modifié(e) avec succès')
  $('#side_menu_add_container').css('display','none');
  let id=data.id
  storage[id]=data.reponses[id]
}
else{
  if(data.ok == "message d'erreur"){
    $('#error').html(error_msg)
  }else{
      $('.popup_problem, #overlay').css('display','block');
      $('.message').html("Un problème s'est produit")
      $('#side_menu_add_container').css('display','none');
      console.log(data.error)
      alert('ça marche pas!')
  }
}
}

async function delete_item(id , route,storage, popup){

let data = await ajax(route, {id});

if (data.ok) {
    if(popup == 'none'){

    }else{
      $('.popup').css('display','block');
      $('.modal_add').css('display', 'none')
      $('.message').html('Supprimé(e) avec succès.')
    }
    delete storage[id]
}else{
    $('.popup_problem, #overlay').css('display','block');
    $('.message').html("Un problème s'est produit")
    $('#side_menu_add_container').css('display','none');
    console.log(data.error)
    alert('ça marche pas!')
}

}


function check_obj_filters(obj, filters){ 
if(!filters) filters={};
if(filters.category != obj  && filters.category != "") return false;
return true;  
}

function ExportToExcel(selector, fileName, type, fn, dl) {
  
  var elt = document.getElementById(selector);
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  return dl ?
    XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
    XLSX.writeFile(wb, fn || ( fileName + (type || 'xlsx')), );
  }
  
function sliders(){
if(/iPad|iPod/i.test(navigator.userAgent)){
$('.slider').slick({
autoplay:true,
autoplaySpeed:1600,
arrows:true,
slidesToShow:3,
slidesToScroll:1,
});}
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  $('.slider').slick({
    autoplay:true,
    autoplaySpeed:1800,
    arrows:true,
    mobileFirst: true,
    });}
    else{
  $('.slider').slick({
    autoplay:true,
    autoplaySpeed:1500,
    arrows:true,
    slidesToShow:3,
    slidesToScroll:2,
  
    });
}  

}

function text(){
var side = {id : "form_event", title_add: "Ajouter Evénement" , title_update: "Modifier Evénement",  btn_add: "add_event" , btn_update: "update_event" }
var arr = [
{data_id : 'type', selector : 'input', type : 'text', label : "Nom de l'événement *", id : ''}
,{data_id : 'type', selector : 'input', type : 'text', label : "Nom de l'événement *", id: ''},  

{data_id : 'type', selector : 'select', type : 'text', label : "de l'événement *", id: '', option : [{value : "name" , html : 'Nom' }]},   
{data_id : 'type', selector : 'select', type : 'text', label : "de l'événement *", id: '', option : [{value : "name" , html : 'Nom' }]},   
]
displaySide(arr, side, '244', GV.files[244])

}

function displaySide(arr, side, exit, object, id, id_delete){
  var index = 0
  console.log(object, 'iihuqsf')
  $('#side_menu').html('')
  let html = `  
      <div class="header_side_menu">
        <div id="skip_btn" class=" ${exit == 'side'? 'exit' : 'exit_side'}"><i class="fas fa-chevron-left "></i></div>
        <div class="title">${id==undefined ? side.title_add : side.title_update}</div>
      </div>
      <div class="body_side_menu">
        <div id="${side.id}" class="form_container">
        </div>        
        <div id="error"></div>
      </div>
      <div class="footer_side_menu">
        <div class="buttons_container cursor " style="${id_delete != undefined ? 'display: grid ;grid-template-columns:1fr 1fr; gap: 10px': ''}" >
          ${id_delete != undefined  ? `<div id="${id_delete}" data-id="${id}" class="btn button text_color3 cursor text_center second_color_btn" >Supprimer</div>`: "" }
          <div id="${id==undefined ? side.btn_add : side.btn_update}" data-element="" data-id="${ id==undefined ? "" : side.data_id}" class="btn button text_color3 cursor text_center primary_color_btn" >Valider</div>
        </div>
      </div>
      `
  $('#side_menu').html(html)  
  for(element of arr){
    var array = element
    var data_id = array.data_id 
    var data_idgrid = array.data_idgrid 
    
    if(array.class=='grid'){
      if(array.selector == "input"){

        let inputHtml=`
        <div class="grid colmn2 gap20">
          <div class="input-container ${array.uniqueClass} ${array.type == "file" ? array.id : ""}">
            <div class="label">${array.label} *</div>
            <input id="${array.id}" class="content_editable ${array.required}" type="${array.type}" data-id="${array.data_id}" contenteditable="true" placeholder="${array.placeholder == undefined ? "" : array.placeholder}" value="${id==undefined ? "" : object[data_id]}"></input>
            ${array.type == "file" ? 
            `
            <div class="progress" style="position: relative ;  height : 7px ;">
              <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
              <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
            </div>` : ""
            }
          </div>
          <div class="input-container ${array.uniqueClass} ${array.type1 == "file" ? array.id1 : ""}">
            <div class="label">${array.label1} *</div>
            <input id="${array.id1}" class="content_editable ${array.required1}" type="${array.type1}" placeholder="${array.placeholder1 == undefined ? "" : array.placeholder1}" data-id="${array.data_idgrid}" contenteditable="true" value="${id==undefined ? "" : object[data_idgrid]}"></input>
            ${array.type1 == "file" ? 
            `
            <div class="progress" style="position: relative ;  height : 7px ;">
              <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
              <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
            </div>` : ""
            }
          </div>
        </div>
        ` 
     
        $('.form_container').append(inputHtml)
        if(array.type == "date" && id!=undefined){
          document.getElementById(array.id).valueAsDate =new Date(object[data_id]);
        }else{}
        if(array.type1 == "date" && id!=undefined){
          document.getElementById(array.id1).valueAsDate =new Date(object[data_idgrid]);
        }else{}
      }
      else{

    }

    }else{
      if(array.selector == "label"){
        let labelHtml = `
        <div class="header-title">${array.label}</div>
        `
        $('.form_container').append(labelHtml)
      }if(array.selector == "input"){
        
        let inputHtml=`
        <div class="input-container ${array.uniqueClass} ${array.type == "file" ? array.id : ""}">
          <div class="label ${array.type == "hidden" ? "hide" : ""}">${array.label} *</div>
          <input id="${array.id}" class="content_editable ${array.required}" placeholder="${array.placeholder == undefined ? "" : array.placeholder}" type="${array.type}" data-id="${array.data_id}" contenteditable="true" value="${id==undefined ? "" : object[data_id]}"></input>
          ${array.type == "file" ? 
          `
          <div class="progress" style="position: relative ;  height : 7px ;">
            <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
            <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
          </div>` : ""
          }
        </div>
        ` 
        $('.form_container').append(inputHtml)
      }if(array.selector == "img"){
        
        let inputHtml=`
        <div class="input-container ${array.uniqueClass} ${array.id} style="margin-bottom : 10px" >
          <div class="label">${array.label} *</div>
          <input  id="${array.id}" class="content_editable ${array.required}" placeholder="${array.placeholder == undefined ? "" : array.placeholder}" type="${array.type}" contenteditable="true" value="${id==undefined ? "" : object[data_id]}"></input>
          <div class="progress" style="position: relative ;  height : 7px ;">
              <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
              <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
          </div>
        </div>
        ` 
  
        $('.form_container').append(inputHtml)
      }if(array.selector == "textarea"){
        let textareaHtml = `
        <div class="input-container ${array.uniqueClass}">
          <div class="label">${array.label} *</div>
          <textarea class="content_editable ${array.required}" type="${array.type}" placeholder="${array.placeholder == undefined ? "" : array.placeholder}" data-id="${array.data_id}" contenteditable="true" value="${id==undefined ? "" :  object[data_id]}">${id==undefined ? "" :  object[data_id]}</textarea>
        </div>
        `
        $('.form_container').append(textareaHtml)
  
      }if(array.selector == "select"){
          index++
          let selectHtml = `
          <div class="input-container ${array.uniqueClass}">
            <div class="label">${array.label} *</div>
            <select id="${array.id}" class="section-options display_option${index} content_editable ${array.required}"  data-id="${array.data_id}" contenteditable="true">
              <option value="${id==undefined ? "" :  object[data_id]}" ${id==undefined ? 'selected="true" disabled="disabled"' : ''} >${id==undefined ? "Sélectionner une valeur" :  object[data_id]}</option>
            </select> 
          </div>
          `        
          $('.form_container').append(selectHtml)
  
          for(element of array.option){
          var option =  element
          optionHtml = `
          <option value="${option.value}">${option.html}</option>
          `
  
          $(`.display_option${index}`).append(optionHtml)
  
        }
      }if(array.selector == "div"){

        let divHtml = `<div id="${array.id}" class="input-container ${array.uniqueClass}"> </div>`        
        $('.form_container').append(divHtml)

    }else{
  
      }

    }
    
  }

}


var th = ['', ' Mille', ' Millions', ' Milliards', ' Billions', ' Mille-billions', ' Trillion'];
var dg = ['Zéro', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf'];
var tn = ['Dix', 'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze', 'Seize', 'Dix-sept', 'Dix-huit', 'Dix-neuf'];
var tw = ['Vingt', 'Trente', 'Quarante', 'Cinquante', 'Soixante', 'Soixante-dix', 'Quatre-vingt', 'Quatre-vingt-dix'];

function convertNumber(numString){
// var numString =   $('#total_file').html();
if (numString == '0') {
    document.getElementsByClassName('containerNumber').innerHTML = 'Zéro';
    return;
}
if (numString == 0) {
    document.getElementsByClassName('containerNumber').innerHTML = 'messeg tell to enter numbers';
    return;
}
console.log(toWords(numString))
var output = toWords(numString);
$('.containerNumber').html(`Le Total en lettre : ${output.replace('Soixante-dix Zéro', 'Soixante-dix')
                                                         .replace('Soixante-dix Un', 'Soixante-et-onze')
                                                         .replace('Soixante-dix Deux', 'Soixante-douze')
                                                         .replace('Soixante-dix Trois', 'Soixante-treize')
                                                         .replace('Soixante-dix Quatre', 'Soixante-quatorze') 
                                                         .replace('Soixante-dix Cinq', 'Soixante-quinze')
                                                         .replace('Soixante-dix Six', 'Soixante-seize')
                                                         .replace('Soixante-dix Sept', 'Soixante-dix-sept')
                                                         .replace('Soixante-dix Huit', 'Soixante-dix-huit')
                                                         .replace('Soixante-dix Neuf', 'Soixante-dix-neuf')
                                                         .replace('Quatre-vingt-dix Zéro', 'Quatre-vingt-dix')
                                                         .replace('Quatre-vingt-dix Un', 'Quatre-vingt-onze')
                                                         .replace('Quatre-vingt-dix Deux', 'Quatre-vingt-douze')
                                                         .replace('Quatre-vingt-dix Trois', 'Quatre-vingt-treize')
                                                         .replace('Quatre-vingt-dix Quatre', 'Quatre-vingt-quatorze') 
                                                         .replace('Quatre-vingt-dix Cinq', 'Quatre-vingt-quinze')
                                                         .replace('Quatre-vingt-dix Six', 'Quatre-vingt-seize')
                                                         .replace('Quatre-vingt-dix Sept', 'Quatre-dix-sept')
                                                         .replace('Quatre-vingt-dix Huit', 'Quatre-dix-huit')
                                                         .replace('Quatre-vingt-dix Neuf', 'Quatre-dix-neuf')
                                                         .replace('Un Cent', 'Cent')
                                                        } TTC`)

}

function toWords(s) {

s = s.toString();
s = s.replace(/[\, ]/g, '');
if (s != parseFloat(s)) return 'not a number';
var x = s.indexOf('.');
if (x == -1) x = s.length;
if (x > 15) return 'too big';
var n = s.split('');
var str = '';
var sk = 0;
for (var i = 0; i < x; i++) {
if ((x - i) % 3 == 2) {
if (n[i] == '1') {
  console.log(1)
    str += tn[Number(n[i + 1])] + ' ';
    console.log(tn[Number(n[i + 1])] )
    i++;
    sk = 1;
} else if (n[i] != 0) {
  console.log(2)
    str += tw[n[i] - 2] + ' ';
    console.log(tw[n[i] - 2] )
    sk = 1;
    console.log(str)
}
} else if (n[i] != 0) {
console.log(3)

// if(dg[n[i]] == "Un"){

// }else{
  str += dg[n[i]] + ' ';
// }
console.log(dg[n[i]])
//if((dg[n[i]] == 'un') && ((x - i) / 3 == 1)){str = 'Cent ';}
if ((x - i) % 3 == 0) {str += 'Cent ';}
sk = 1;
}
if ((x - i) % 3 == 1) {
//test
if((x - i - 1) / 3 == 1){
  console.log(4)
    var long = str.length;
    subs = str.substr(long-3);
    if(subs.search("un")!= -1){
        //str += 'OK';
        str = str.substr(0, long-4);
        console.log(str.substr(0, long-4))
    }

}
if(dg[n[i]] == 'Un' && th[(x - i - 1) / 3] == " Millions"){
  if (sk) str += 'Un Million '
}else{
  if (sk) str += th[(x - i - 1) / 3] + ' ';
  sk = 0;
}

}
}


if (x != s.length) {

str += 'Dinars et';
var y = s.length;
str += ' ';

for (var i = x + 1; i < y; i++){
console.log(i, x, y, Number(n[i + 1]), tw[n[i] - 2],  dg[n[i]] , n[i + 1])
if (n[i + 1]== undefined) {

      str += dg[n[i]] + ' ';
      sk = 1;
} else {
    if (n[i] == '1') {
      console.log(n[i])
        str += tn[Number(n[i + 1])] + ' ';
        console.log(tn[Number(n[i + 1])] )
        i++;
        sk = 1;
    }else {
      str +=  tw[n[i] - 2] + ' ';
      sk = 1;
    }   
}
} 
str += ' Centimes';
}else{
str += 'Dinars';
}
//if(str.length == 4){}
str.replace(/\s+/g, ' ');
return str.split('un Cent').join('Cent ');
//return str.replace('un cent', 'Cent ');
}



function separator(numb) {
  var str = numb.toString().split(",");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
  }
  


  function groupElementBy(arr, element){


    const groupBy = (arr, key) => {
      const initialValue = {};
      return arr.reduce((acc, cval) => {
        const myAttribute = cval[key];
        acc[myAttribute] = [...(acc[myAttribute] || []), cval]
        return acc;
      }, initialValue);
    };
    
    const res = groupBy(arr, element);
    console.log("group by:", res);
    return res
  }
  
  
  
  












