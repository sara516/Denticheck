
GV={initialize_page:{}, notification: {}}
GV.url = "http://localhost"
GV.domain_name = 'localhost'

$(document).ready(  async function () {

    GV.networkStatus = 1
    setTimeout(showPage, 3000);
    moment.locale();
    await get_session_name()
 

  });

function showPage() {
  document.getElementById("loading_page").style.display = "none";
}



function get_first_page() {
  let path = window.location.pathname;
  // console.log(path)
  // if (path == "/dashboard") return "dashboard";
  // if (path == "/subscription") return "subscription";
  // if (path == "/comptes") return "comptes";
  // if (path == "/statistique") return "statistique";
  // if (path == "/facturation") return "facturation";
  // if (path == "/crm") return "crm";
  // if (path == "/profil") return "profil";
  // if (path == "/list") return "list";
  // if (path == "/list_staff") return "list_staff";

  // return "dashboard";
}

function get_next_page_url(page_name){
  return `/${page_name}`;
  }






  //! ///////////////////////////////////////////////////////////
//! //////////////////!    DASHBOAR   //////////////////////////
//! ///////////////////////////////////////////////////////////



 GV.initialize_page.dashboard = async function(){
  displayPlaceholder()
  isManager()
  isAdministater()

  }

async function displaySideStatus(id){

  var file = GV.files[id]
  $('#side_menu').html("")

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
            <div class="title">Modifier le status du document</div>
        </div>
        <div id="form_status_price" class="body_side_menu">
          <div class="form_container">
              <div class="input-container">
                <div class="label">Devis réaisé : </div>
                  <table id="table_invoice_not_valid">
                  </table>
              </div>
              <div class="input-container">
                <div class="label">Status*</div>
                <select class="content_editable"  data-id="validation" contenteditable="true">
                    <option value = "" disabled> Sélectionner </option>
                    <option value="1">Confirmer</option>
                    <option value="2">Décliner</option>
                </select>

              </div>

          </div>
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="edit_status_valid" data-id="${file.id}" class="btn button text_color3 cursor text_center submitBtn" >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
  $('#table_invoice_not_valid').html()
  let header_table = `
  <tr>
    <th>Désignation</th>
    <th>Prix unitaire</th>
    <th>Qtn</th>
    <th>Réducion</th>
    <th>TOTAL</th>
  </tr>
  `
  $('#table_invoice_not_valid').prepend(header_table)
  await load_items( 'items', {id_file : file.id})
   for(let id_item of Object.keys(GV.items)){
    var item = GV.items[id_item]
    let html = `
    <tr style="font-weight: 600 !important;">
      <td class="desc" style="width: auto;">${item.description} </td>
      <td class="unit">${item.unit_price.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}DA</td>
      <td class="qty" style="max-width: 70px !important;">${item.quantity}</td>
      <td class="qty" style="max-width: 70px !important;">${item.unity_reduce == 'DA' ? separator(parseFloat(item.reduce).toFixed(2).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})) : item.reduce } ${item.unity_reduce}</td>
      <td class="total">${item.total_price.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>
    </tr>

    `
    $('#table_invoice_not_valid').append(html)
}
}

onClick('.dropbtn_task_dash', function () {
  let id= $(this).data("id")
  $('.dropdown-content').removeClass('show')
  document.getElementById(`myDropdown_task_dash_${id}`).classList.toggle("show"); 
});


onClick('.dropbtn_notification', function () {
  $('.dropdown-content').removeClass('show')
  document.getElementById(`dropbtn_notification`).classList.toggle("show"); 
});






  //! ///////////////////////////////////////////////////////////
//! //////////////////!    Profile   //////////////////////////
//! ///////////////////////////////////////////////////////////



$(document).on('click', function(event) {

  if (event.target.className == 'btn_notif' ) {  
    if ($(".content_notif").hasClass("show")) {
      $(".content_notif").removeClass("show")
    } else {
      $(".content_notif").addClass("show")
      displayNotifications()
    }    
  }else{   
    $(".content_notif").removeClass("show")
  }
  if (event.target.className == 'dropdown_info' ) {
    if ($(".dropdown_container").hasClass("active")) {
      $(".dropdown_container").removeClass("active")
    } else {
      $(".dropdown_container").addClass("active")
    }
  }else{
    $(".dropdown_container").removeClass("active")
  }
});

$(".close_left_bar").click(function(){

    if($(this).find('i').hasClass( "fa-angles-left" )){
      $(this).find('i').removeClass('fa-angles-left').addClass('fa-angles-right')
      $('.header .hide-tag').addClass("header-tag")
    }else{
      $(this).find('i').removeClass('fa-angles-right').addClass('fa-angles-left')
      $('.header .hide-tag').removeClass("header-tag")
    }
    $('#body').toggleClass("responsive_clomn")
    $('.header-title').toggleClass("hide")
    $('.header .content_header').toggleClass("hide")
    $('.header .show').toggleClass("hide")
    $('.header .header-button').toggleClass("margin5")
    $('.header .icon_header').toggleClass("margin5")
    $('.header .header-button').toggleClass("padding5")
    $('#header-logo-container img').toggleClass("height20")
});


window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown_container");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('active')) {
        openDropdown.classList.remove('active');
      }
    }
  }
}



//! ///////////////////////////////////////////////////////////
//! /////////////!    subscription      ///////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.subscription= async function(){
  
  displayPlaceholder()
  searchBar(".table_items")
  GV.subscription = {}
  GV.folders = {}
  GV.subscription_start = ""
  GV.subscription_end = ""
  if(GV.ObjCurrentUser.manager == "0"){
    await load_items("folders",{id_profil: GV.current_company.id, id_account : GV.current_user})
    await load_items("subscription",{id_profil: GV.current_company.id, id_account : GV.current_user})
  }else{
    await load_items("folders",{id_profil: GV.current_company.id})
    await load_items("subscription",{id_profil: GV.current_company.id})
  }
  displaySubscription()
  displayAccount()
  isManager()
  isAdministater()
  PlaceholderisEmpty('#subscription_page')

}

function displayAccount(){
  $('.total_box').html('')
  let length = $('#list_subscription .table_items').length
  $('.total_box').html(`Total: ${length}`)
}

$(document).on('change','#subscription_start', async function(){
  GV.subscription_start =$(this).val()
  displaySubscription()  
  displayAccount()
})

$(document).on('change','#subscription_end', async function(){
  GV.subscription_end =$(this).val()
  displaySubscription()  
  displayAccount()
})

function displaySubscription(){  
  $('#list_subscription').html("")

    for(let id of Object.keys(GV.subscription)){
      var subscription=GV.subscription[id]
      console.log(moment(subscription.start_date).format('YYYY-MM-DD'), GV.subscription_start)
      if ( moment(subscription.start_date).format('YYYY-MM-DD') < GV.subscription_start && GV.subscription_start != "")continue;
      if ( moment(subscription.start_date).format('YYYY-MM-DD') > GV.subscription_end && GV.subscription_end != "")continue;
      html = `
      <div  class="table_items grid colmn5 padding_top15 text_color1  center">
        <div class="blod text_color3">${subscription.title}</div>       
        <div class="blod text_color10">${GV.folders[subscription.id_folder].name}</div>     
        <div class="blod text_color10">${moment(subscription.start_date).format('DD/MM/YYYY')}</div>     
        <div class="blod text_color10">${moment(subscription.end_date).format('DD/MM/YYYY')}</div>     
       <div>
          <div class="dropdown">
            <i class="fas fa-ellipsis-v dropbtn dropbtn_folder" data-id="${subscription.id}" style="font-size: 20px;padding: 10px;"></i>
            <div id="myDropdown_folder_${subscription.id}" class="dropdown-content">
            <div class="action" id="edit_subscription"  data-id="${subscription.id}"><i class="fa-solid fa-info light_grey padding5"></i>Modifier</div>
            <div class="action" id="delete_subscription"  data-id="${subscription.id}"><i class="fas fa-trash-alt light_grey padding5"></i>Supprimer</div>
          </div>
        </div>
      </div>   
      `
      $('#list_subscription').append(html)
    } 


}

onClick('#add_new_subscription', function(){
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  displaySideSubscription()

})
onClick('#edit_subscription', function(){
  let id = $(this).data('id')
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  displaySideSubscription(id)

})



function displaySideSubscription(id){
  var subscription = GV.subscription[id]   
  $('#side_menu').html("")

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
            <div class="title">${id==undefined ? "Ajouter un nouvel abonnement" : "Modifier l'abonnement"}</div>
        </div>

        <div id="form_supscription" class="body_side_menu">
          <div class="form_container">
            <div>
              <div class="input-container grid colmn2 gap-10">

                <div>
                  <div class="label">Désignation *</div>
                  <input class="content_editable required" type="text" data-id="title" contenteditable="true" value="${id==undefined ? "" : subscription.title}"></input>
                </div>

                <div>
                  <div class="label">Entreprise *</div>
                  <select id="client_display" class="content_editable required"  data-id="id_folder" contenteditable="true" placeholder="Unité"> 
                    <option value="${id==undefined ? "" :  subscription.id_folder}">${id==undefined ? "" :  GV.folders[subscription.id_folder].name}</option>                   
                  </select>
                </div>

              </div>

              <div class="input-container">
                <div class="label">Description</div>
                <textarea class="content_editable " type="text" data-id="description" contenteditable="true">${id==undefined ? "" :  ( subscription.description == null ? "" :  subscription.description)}</textarea>
              </div>

              <div class="input-container grid colmn2 gap-10">

                <div>
                  <div class="label">Date du début *</div>
                  <input id='start_subscription' class="content_editable required" type="date" data-id="start_date" contenteditable="true" value="${id==undefined ? "" : moment(subscription.start_date).format('YYYY-MM-DD')}"></input>
                </div>

                <div>
                  <div class="label">Date de fin *</div>
                  <input id="end_subscription" class="content_editable required" type="date" data-id="end_date" contenteditable="true" value="${id==undefined ? "" : moment(subscription.end_date).format('YYYY-MM-DD')}"></input>
                </div>

              </div>

          </div>
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="${id==undefined ? "add_subscription_valid" : 'edit_subscription_valid'}" data-id="${id==undefined ? "" : subscription.id}" class="btn button text_color3 cursor text_center  submitBtn" >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
    displayClient()
   
}

function displayClient(){
  $('#client_display').html("")
  for(let id of Object.keys(GV.folders)){
    let folder = GV.folders[id]
    let html=`
    <option value="${folder.id}">${folder.name}</option>                  

    `
    $('#client_display').append(html)
  }
 
}
onClick('#add_subscription_valid', async function () { 
  if(GV.networkStatus==0)return;
  if (!check_form("#form_supscription")) {
    return;
  }
  await add("subscription", "#form_supscription",GV.subscription) 
  displaySubscription()
  $('#side_menu').css('display','none');
  $('#overlay').css('display','none'); 
});

onClick('#edit_subscription_valid', async function () { 
  if(GV.networkStatus==0)return;
  if (!check_form("#form_supscription")) {
    return;
    }
  let id = $(this).data('id')
  await update(id,"subscription", "#form_supscription",GV.subscription) 
 
  $('#side_menu').css('display','none');
  $('#overlay').css('display','none');
  displaySubscription()

});
onClick('#delete_subscription', async function () { 
  if(GV.networkStatus==0)return;
  let id = $(this).data('id')
  await delete_item(id,"subscription",GV.subscription) 
  displaySubscription()    
});
//! ///////////////////////////////////////////////////////////
//! //////////////////!    list      //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.list= async function(){
  displayPlaceholder()
  searchBar(".table_items")
  GV.files = {}
  GV.folders = {}
  GV.value_searched = ""
  GV.value_searched_cancled = ""
  GV.start_date = ""
  GV.end_date = ""
  displayListInvoicesFilters()
  if(GV.ObjCurrentUser.manager == "0"){
    await load_items("folders",{id_profil: GV.current_company.id,  id_account : GV.current_user})
    await load_items('files', {id_profil: GV.current_company.id, id_account : GV.current_user})
  }else{
    await load_items("files",{id_profil: GV.current_company.id})
    await load_items("folders",{id_profil: GV.current_company.id})
  }
  displayAllInvoice({category: ""},  {category: ""})
  isManager()
  isAdministater()
  PlaceholderisEmpty('#list_page')
}

function displayListInvoicesFilters(){
  $('#list_invoice_filters').html('')
  let html = `
  
  <div>
    <div class="input-group">
      <input required="" type="text" name="text" autocomplete="off" class="input search_bar">
      <label class="user-label">Recherche</label>
    </div>
  </div>
  <div class="selected_filter box"> 
    <select id="search-invoice" class="filter" type=text value="" placeholder="Toutes les entreprises"> 
        <option value="">Toutes les factures</option>
        <option value="Payée">Factures payées</option>
        <option value="Versement">Factures avec versement</option>
        <option value="Non payée">Factures impayées</option>                        
    </select>
    
  </div>
  <div class="selected_filter box"> 
    <select id="search-cancled-invoice" class="filter" type=text value="" placeholder="Toutes les entreprises"> 
        <option value="">Toutes les factures</option>
        <option value="1">Factures annulées</option>
        <option value="0">Factures non annulées</option>                        
    </select>
    
  </div>
  <div class="selected_filter grid" style="grid-template-columns: 20px 1fr ;"> 
    <div class="blod text_color10  margin-auto"> Du</div>
    <input id="start_date" class="box_input" value="" type="date"  autocomplete="off">
  </div>
  <div class="selected_filter grid" style="grid-template-columns: 20px 1fr ;"> 
    <div class="blod text_color10  margin-auto"> Au</div>
    <input id="end_date" class="box_input " value="" type="date"  autocomplete="off">
  </div>
  <div  class=" w100 text_right" > 
    <button id="print_list_invoice" class="manager_access">
        <span>Télécharger</span>
    </button>                    
  </div> 
  `
  $('#list_invoice_filters').html(html)
}

$(document).on('change','#search-invoice', function(){
  GV.value_searched = $(this).val()
  displayAllInvoice({category: GV.value_searched}, {category: GV.value_searched_cancled})
});

$(document).on('change','#search-cancled-invoice', function(){
  GV.value_searched_cancled = $(this).val()
  displayAllInvoice({category: GV.value_searched} , {category: GV.value_searched_cancled})
});

onClick('#print_list_invoice', function(){
  ExportToExcel('download_list', 'test.')
})

async function displayAllInvoice(filters, filters_status){
  $('#invoices').html(" ")
  $('#download_list').html(" ")

  let html = " "
  headerTable = `
  <thead style="background: red">
      <th class="bold">Numéro</th>
      <th class="bold">Date d'émission</th>
      <th class="bold">N° Facture</th>
      <th class="bold">Client</th>
      <th class="bold">Montant HT</th>
      <th class="bold">Montant TTC</th>
      <th class="bold">Etat</th>
      <th class="bold">Type de paiment</th>
  </thead>`
  $('#download_list').prepend(headerTable)
  var index = 1
  for(let id of Object.keys(GV.files)){
    var file=GV.files[id]
    var obj = file.status
    var status = file.cancel_status
    if (file.type != 'Facture')continue;
    if (file.validation != '1')continue;
    if (!check_obj_filters(obj, filters))continue;
    if (!check_obj_filters(status, filters_status))continue;    
    if ( moment(file.date_issue).format('YYYY-MM-DD') < GV.start_date && GV.start_date != "")continue;
    if ( moment(file.date_issue).format('YYYY-MM-DD') > GV.end_date && GV.end_date != "")continue;

    var date_emission = moment(file.date_issue).format('DD/MM/YYYY')
    var date_deadline = moment(file.payment_deadline).format('DD/MM/YYYY')
    var today = new Date()
    var price = (file.total).replace(/,/g,'')

    var prixHT = parseFloat(price)
    var sum = 1+(parseFloat(file.tva)/100)
    var prixTTC = prixHT*sum

    html = `
      <div  class="table_items grid colmn7 padding_top15 text_color1  center">
        <div class="blod text_color7">${GV.folders[file.id_folder].name} </div>    
        <div class="bold text_color3" style="${today > new Date(file.payment_deadline) && file.status == 'Non payée' && file.cancel_status != '1'  ? 'color: white; padding: 10px 20px;border-radius: 5px;background-image: linear-gradient(98.69deg,#ff8ea5 -32.8%,#e94e6e 153.9%);' : ''}" >${file.cancel_status == '1' ? 'Facture' : file.type.split('_').join(' ')}  ${file.cancel_status == '1' ? "Annulée" :  ` ${file.status} `} </div>            
        <div class="blod text_color10" style="${file.cancel_status == '1' ? 'text-decoration: line-through;' : ""}"> N° ${file.file_number} </div>     
         
        <div class="bold text_color3"> ${date_emission}</div>     
        <div class="bold text_color3"> ${date_deadline}</div>  
        <div class="blod text_color10">${separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</div>
     
        <div class="dropdown">
          <i class="fas fa-ellipsis-v dropbtn dropbtn_operation" data-id="${file.id}" style="font-size: 20px;padding: 10px;    z-index: 500!important;"></i>
          <div id="myDropdown_operation_${file.id}" class="dropdown-content">
          <div class="action" id="print_crm_file" data-id="${file.id}"><i class="fa-solid fa-print light_grey padding5"></i>Imprimer</div>
          <div class="action" id="download_crm_file" data-id="${file.id}"><i class="fa-solid fa-download light_grey padding5"></i>Télécharger</div>
          <div class="action" id="send_mail_document" style="display: ${file.cancel_status == '1' || file.imported == '1' ? 'none !important' : ""}" data-id="${file.id}"><i class="fas fa-sign-out-alt  light_grey padding5"></i>Envoyer mail</div>
        </div>
      </div> 

    `
      htmlDownload = `       

      <tbody>
          <tr>
              <td>${index++}</td>
              <td>${date_emission}</td>
              <td>${file.file_number}</td>
              <td>${GV.folders[file.id_folder].name}</td>
              <td>${file.total.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>
              <td>${separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>
              <td>${file.cancel_status == '1' ? "Annulée" : file.status} </td>
              <td>${file.type_paiment == null || file.type_paiment == 'null'  ? "" : file.type_paiment} </td>
          </tr>

      </tbody>
  `

    $('#invoices').append(html)

    $('#download_list').append(htmlDownload)
  }


}



//! ///////////////////////////////////////////////////////////
//! //////////////////!    designation      //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.designation= async function(){
  displayPlaceholder()
  searchBar(".table_items")
  GV.designations ={}
  await load_items('designations', {id_profil: GV.current_company.id})
  displayDesignation()
  PlaceholderisEmpty('#designation_page')
  }


  function displayDesignation(){

    $('#designation_content').html("")
    for(let id of Object.keys(GV.designations)){
      var designation=GV.designations[id]
  
      html = `
      <div  class="table_items grid colmn5 padding_top15 text_color1  center">
        <div class="blod text_color3">${designation.name}</div>       
        <div class="blod text_color10">${designation.unit_price}</div>     
        <div class="blod text_color10">${designation.ref == null ? "" : designation.ref}</div>     
        <div class="blod text_color10">${designation.unity == null ? "" : designation.unity}</div>     
       <div>
          <div class="dropdown">
            <i class="fas fa-ellipsis-v dropbtn dropbtn_folder" data-id="${designation.id}" style="font-size: 20px;padding: 10px;"></i>
            <div id="myDropdown_folder_${designation.id}" class="dropdown-content">
            <div class="action" id="edit_designation"  data-id="${designation.id}"><i class="fa-solid fa-info light_grey padding5"></i>Modifier</div>
            <div class="action" id="delete_designation"  data-id="${designation.id}"><i class="fas fa-trash-alt light_grey padding5"></i>Supprimer</div>
          </div>
        </div>
      </div>   
      `
      $('#designation_content').append(html)
    } 
  
  }

    onClick('#edit_designation', function(){
      var id = $(this).data('id')
      $('#overlay').css('display', 'grid')
      $('#side_menu').css('display', 'grid')
      displaySideDesignation(id)
    })
    
    
    onClick('#add_new_designation', function(){
      $('#overlay').css('display', 'grid')
      $('#side_menu').css('display', 'grid')
      displaySideDesignation()
    
    })



  function displaySideDesignation(id){
    var designation = GV.designations[id]   
    $('#side_menu').html("")
  
    let html=`
          <div class="header_side_menu">
              <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
              <div class="title">${id==undefined ? "Ajouter un nouvel article" : "Modifier l'article"}</div>
          </div>
  
          <div id="form_designation" class="body_side_menu">
            <div class="form_container">
              <div >
                <div class="input-container grid colmn2 gap-10">
  
                  <div>
                    <div class="label">Désignation *</div>
                    <input class="content_editable required" type="text" data-id="name" contenteditable="true" value="${id==undefined ? "" : designation.name}"></input>
                  </div>
  
                  <div>
                    <div class="label">Référence </div>
                    <input class="content_editable " type="text" data-id="ref" contenteditable="true" value="${id==undefined ? "" : ( designation.ref == null ? "" :  designation.ref) }"></input>
                  </div>

                </div>
  
                <div class="input-container">
                  <div class="label">Description </div>
                  <textarea class="content_editable " type="text" data-id="description" contenteditable="true">${id==undefined ? "" :  ( designation.description == null ? "" :  designation.description)}</textarea>
                </div>
                <div class="input-container grid colmn2 gap-10">
  
                  <div>
                    <div class="label">Unité</div>
                    <select class="content_editable"  data-id="unity" contenteditable="true" placeholder="Unité"> 
                      <option value="${id==undefined ? "Unité" :  ( designation.unity == null ? "Unité" :  designation.unity)}">${id==undefined ? "Unité" :  ( designation.unity == null ? "Unité" :  designation.unity)}</option>
                      <option value="Gramme">Gramme</option>
                      <option value="Heure">Heure</option>
                      <option value="Jour">Jour</option>              
                      <option value="Forfait">Forfait</option>              
                      <option value="Année">Année</option>              
                      <option value="Caractère">Caractère</option>              
                      <option value="Ligne">Ligne</option>              
                      <option value="Licence">Licence</option>              
                      <option value="Article">Article</option>              
                      <option value="Mois">Mois</option>              
                      <option value="Kilogramme">Kilogramme</option>              
                      <option value="Kilomètre">Kilomètre</option>              
                      <option value="Litre">Litre</option>              
                      <option value="Lot">Lot</option>              
                      <option value="Mètre">Mètre</option>              
                      <option value="Mètre carré">Mètre carré</option>              
                      <option value="Mètre cube">Mètre cube</option>              
                      <option value="Mètre linéaire">Mètre linéaire</option>              
                      <option value="Personne">Personne</option>              
                      <option value="Tonne">Tonne</option>              
                      <option value="Mot">Mot</option>              
                      <option value="Page">Page</option>              
                      <option value="Feuillet">Feuillet</option>              
                      <option value="Paragraphe">Paragraphe</option>              
                      <option value="Minute">Minute</option>              
                    </select>
                  </div>
  
                  <div>
                    <div class="label">Prix unitaire HT * </div>
                    <input class="content_editable " type="number" data-id="unit_price" contenteditable="true" value="${id==undefined ? "" : ( designation.unit_price == null ? "" :  designation.unit_price) }"></input>
                  </div>

                </div> 
  
            </div>
            <div id="error"></div>
          </div>
          </div>
  
          <div class="footer_side_menu">
              <div class="buttons_container cursor ">
                <div id="${id==undefined ? "add_designation_valid" : 'edit_designation_valid'}" data-id="${id==undefined ? "" : designation.id}" class="btn button text_color3 cursor text_center  submitBtn" >Valider</div>
              </div>
          </div>
  
            `
      $('#side_menu').html(html)
  }

  onClick('#add_designation_valid', async function () { 
    if(GV.networkStatus==0)return;
    await add("designations", "#form_designation",GV.designations) 
    if(GV.page_name == 'facturation'){
      displayDropdownItems()
    }else{
      displayDesignation()
    }    
    $('#side_menu').css('display','none');
    $('#overlay').css('display','none'); 
  });

  onClick('#edit_designation_valid', async function () { 
    if(GV.networkStatus==0)return;
    let id = $(this).data('id')
    await update(id,"designations", "#form_designation",GV.designations) 
   
    $('#side_menu').css('display','none');
    $('#overlay').css('display','none');
    displayDesignation()
    
  });
  onClick('#delete_designation', async function () { 
    if(GV.networkStatus==0)return;
    let id = $(this).data('id')
    await delete_item(id,"designations",GV.designations) 
    displayDesignation()    
  });

//! ///////////////////////////////////////////////////////////
//! //////////////////!    account      //////////////////////////
//! ///////////////////////////////////////////////////////////



  GV.initialize_page.comptes= async function(){
    displayPlaceholder()
    searchBar(".table_items")
    GV.accounts = {}
    if(GV.ObjCurrentUser.manager == "0"){
      await search_items ("accounts", 'id_profil', {id:GV.current_user, disable : '0'}, `"${GV.current_company.id}"` )
    }else{
      await search_items ("accounts", 'id_profil', {admin : "0",  disable : '0'}, `"${GV.current_company.id}"` )
      await load_items("accounts", {admin : "1"})
    }
    displayAccounts()
    isManager()
    isAdministater()
    PlaceholderisEmpty('#comptes_page')
    
  }

  async function displayAccounts(){
    $('#list_account').html("")
     for(var id of Object.keys(GV.accounts)){
      var account=GV.accounts[id]
      if( account.disable == '1')continue;
      html = `
      <div  class="table_items grid colmn5 padding_top15 text_color1  center">

        <div> <div class="header-admin-image"><img src="${account.picture == null || account.picture == "" ? `${GV.url}/img/default-user.jpg` : `${GV.url}/img/uploads/${account.picture}`}"></div></div>   
        <div class="blod text_color5">${account.first_name} ${account.last_name}</div>
        <div class="blod text_color5">${account.admin == '1' ? 'Administrateur': (account.manager == '1' ? 'Manager' : 'Utilisateur')}</div>
        <div class="blod text_color10">${account.email}</div>       
        <div>
          <div class="dropdown" style="display : ${account.admin == 1 ? "none": "block"}">
            <i class="fas fa-ellipsis-v dropbtn dropbtn_account" data-id="${account.id}" style="font-size: 20px;padding: 10px;"></i>
            <div id="myDropdown_account_${account.id}" class="dropdown-content">
            <div class="action manager_access" id="btn_edit_side_account"  style="display : ${account.admin == 1 ? "none": "block"}" data-id="${account.id}"><i class="far fa-edit light_grey padding5" ></i>Modifier</div>
              <div class="action manager_access" id="btn_popup_delete_account" style="display : ${account.admin == 1 ? "none": "block"}" data-id="${account.id}"><i  class="fas fa-trash-alt light_grey padding5"></i>Désactiver le compte</div>
            </div>
          </div>
        </div>
      </div>   
     `

     $('#list_account').append(html)
    } 
  }
  onClick('.dropbtn_account', function () {
    let id= $(this).data("id")
    $('.dropdown-content').removeClass('show')
    document.getElementById(`myDropdown_account_${id}`).classList.toggle("show"); 
  });

  onClick('#btn_edit_side_account', function(){
    var id = $(this).data('id')
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideAccount(id)
  })

  onClick('#btn_popup_delete_account', async function () { 
    if(GV.networkStatus==0)return;
    $('.modal_add').css('display', 'block')
    $('#overlay').css('display', 'block')
    $('.modal_add').html("")
    var id= $(this).data("id")
    let  html = `
    <div class="modal-content">
    <h5>Êtes-vous sur de vouloir désactiver ce compte ?</h3>
        <div class="modal_footer">
            <div style="font-size: 30px;" class="supprimer btn btn-outline-danger" id='valid_not'><i
                    class="far fa-times-circle cursor red"></i>  </div>

            <div style="font-size: 30px;" class="btn btn-outline-success" id='btn_validate_delete_account' data-id=${id}><i
                    class="far fa-check-circle cursor green"></i>  </div>

        </div>
    </div>`
    $(".modal_add").html(html)

  });

  onClick('#btn_validate_delete_account', async function () { 
    if(GV.networkStatus==0)return;
    $('.modal_add').css('display', 'none')
    $('#overlay').css('display', 'none')


    var id = $(this).data('id')
    await update(id,"accounts", "manual_data",GV.accounts) 

    displayAccounts()
  });



  onClick('#add_new_account', function(){
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideAccount()
  })


async function displaySideAccount(id){

  var account = GV.accounts[id]
  GV.image_name = {}
  if(id == undefined){
    GV.WilayArray= []
    GV.companyArray = []
  }else{
    GV.WilayArray =  account.wilaya
    GV.companyArray = account.id_profil
  }
  $('#side_menu').html("")

  let html=`
  <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Ajouter un nouveau compte</div>
  </div>

<div  class="body_side_menu">
<div class="form_container">
  <div id="form_account">
    <div class="input-container grid colmn2 gap-10">
      <div>
        <div class="label">Prénom *</div>
        <input class="content_editable required" type="text" data-id="last_name" contenteditable="true" value="${id==undefined ? "" : account.last_name}"></input>
      </div>
      <div>
          <div class="label">Nom *</div>
          <input class="content_editable required" type="text" data-id="first_name" contenteditable="true" value="${id==undefined ? "" : account.first_name}"></input>
      </div>
    </div>

    <div class="input-container">
      <div class="label">Email *</div>
      <input class="content_editable required" type="email" data-id="email" contenteditable="true" value="${id==undefined ? "" : account.email}"></input>
    </div>
    <div class="input-container">
      <div class="label">Willaya *</div>
        <select id="willaya" class="content_editable required" contenteditable="true">
        </select> 
      </div>
      <div class="d-flex" id='list_wilya'  style=" flex-wrap: wrap;">
        
      </div>

      <div class="input-container">
        <div class="label">Entrerise lié a ce compte*</div>
          <select id="company_list_dropdown" class="content_editable required" contenteditable="true">
          </select> 
        </div>
        <div class="d-flex" id='company_list_selected'  style=" flex-wrap: wrap;">
          
      </div>

    <div class="input-container validatedImageFile" style="margin-bottom : 10px" >
      <div class="label">Photo d'identité*</div>
      <input class="content_editable link_media" type="file" id="validatedImageFile" value="${id==undefined ? "" : GV.image_name}"></input>
      <div class="progress" style="position: relative ;  height : 7px ;">
          <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
          <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
      </div>
    </div>


    <div class="input-container">
      <div class="label">Nom d'utilisateur *</div>
      <input class="content_editable required username" type="text" data-id="username" contenteditable="true" value="${id==undefined ? "" : account.username}"></input>
    </div>


    <div class="input-container">
      <div class="label">Mot de passe *</div>
      <input class="content_editable required" id="password" type="password" data-id="backup_psw" contenteditable="true" value="${id==undefined ? "" : account.backup_psw}"></input>
    </div>
      <div class="input-container">
        <div class="label">Montant de la prime à ajoutée en pourcentage (%) *</div>
        <input class="content_editable required" type="number" data-id="percentage_bonus" contenteditable="true" value="${id==undefined ? "0" : account.percentage_bonus}"></input>
      </div>
    

  <div class="input-container">
  <div class="label"> Accès *</div>

    


    <label class="container  font_family">
      <input class="cheked_class" data-id="compte" ${id==undefined ? "value='0'" : CheckStatut(account.compte) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Comptes
      <span class="checkmark"></span>
    </label>

    <label class="container  font_family">
      <input class="cheked_class" data-id="crm" ${id==undefined ? "value='0'" : CheckStatut(account.crm) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Entreprises
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="crm" ${id==undefined ? "value='0'" : CheckStatut(account.fournisseur) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Fournisseurs
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="facturation" ${id==undefined ? "value='0'" : CheckStatut(account.facturation) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Facturation
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="designation" ${id==undefined ? "value='0'" : CheckStatut(account.designation) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Articles
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="list_invoice" ${id==undefined ? "value='0'" : CheckStatut(account.list_invoice) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Listes des factures
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="payment" ${id==undefined ? "value='0'" : CheckStatut(account.payment) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Liste des paiements
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="subscription" ${id==undefined ? "value='0'" : CheckStatut(account.subscription) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Abonnements
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="list_account" ${id==undefined ? "value='0'" : CheckStatut(account.list_account) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Commerciaux
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="statistique" ${id==undefined ? "value='0'" : CheckStatut(account.statistique) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Statistiques
      <span class="checkmark"></span>
    </label>
    <label class="container  font_family">
      <input class="cheked_class" data-id="profile" ${id==undefined ? "value='0'" : CheckStatut(account.profile) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Profil
      <span class="checkmark"></span>
    </label>

    <label class="container  font_family bold">
      <input class="cheked_class" data-id="manager" ${id==undefined ? "value='0'" : CheckStatut(account.manager) ==true? "checked  value='1'" :"value='0'"} type="checkbox" >Manager
      <span class="checkmark"></span>
    </label>

  </div>

</div>


<div id="error"></div>
<div  class="message-info red hide">Ce nom d'utilisateur existe déjà, veuillez choisir un nouveau </div>

</div>

</div>

<div class="footer_side_menu">
  <div class="buttons_container cursor ">
    <div id="${id==undefined ? "add_account_valid" : "edit_account_valid"}" data-id="${id==undefined ? "" : account.id}" class="btn button text_color3 cursor text_center submitBtn" >Valider</div>
  </div>
</div>

          `
    $('#side_menu').html(html)
    displayWilayas()
    displaywilayarray(GV.WilayArray)
    await profilsDropDown()
    displayCompanyListe(GV.companyArray)
}


async function profilsDropDown(){
  await load_items("profil",{})

  $('#company_list_dropdown').html('')

  let html_prepend = ` <option value="" selected="true" disabled="disabled">Sélectionnez un entreprise </option>`
  $('#company_list_dropdown').prepend(html_prepend)

  for(let id of Object.keys(GV.profil)){
    let profil = GV.profil[id]
    let html = ` <option value="${profil.id}">${profil.name}</option>`
    $('#company_list_dropdown').append(html)
  }
}


$(document).on('change','#willaya', function(){

  var element = $('#willaya').val()
  GV.WilayArray.push(element);
  displaywilayarray(GV.WilayArray)
});

$(document).on('change','#company_list_dropdown', function(){

  var element = $('#company_list_dropdown').val()
  GV.companyArray.push(element);
  displayCompanyListe(GV.companyArray)
});


function displayCompanyListe(array){
  $('#company_list_selected').html("")
  console.log(array)
  for (let element of array){
    console.log(array)
    if(GV.profil[element] == undefined )continue;
    let html= ` <div class="comany-tag grid " style="grid-template-columns: 20px 1fr;">
    <div class="remove-company bold cursor" data-element="${element}" style=" padding-right: 2px;"> X </div>
    ${GV.profil[element].name}</div> `
    $('#company_list_selected').append(html)
  }
}

onClick('.remove-company', async function(){
  if(GV.networkStatus==0)return;
  var arr = GV.companyArray
  var element = $(this).data('element')
  GV.companyArray = removeA(arr, element.toString());
  displayCompanyListe(GV.companyArray)
    
})



function displaywilayarray(array){
  $('#list_wilya').html("")
  console.log(array)
  for (let element of array){

    let html= ` <div class="wilaya-tag grid " style="grid-template-columns: 20px 1fr;">
    <div class="remove-wilaya bold cursor" data-element="${element}" style=" padding-right: 2px;"> X </div>
    ${element}</div> `
    $('#list_wilya').append(html)
  }
}


onClick('.remove-wilaya', async function(){
  if(GV.networkStatus==0)return;
  var arr = GV.WilayArray
  var element = $(this).data('element')
  
  GV.WilayArray =removeA(arr, element);
  displaywilayarray(GV.WilayArray)
    
})

function removeA(arr) {
  var what, a = arguments, L = a.length, ax;  
  while (L > 1 && arr.length) {
      what = a[--L];
      console.log( arr.indexOf(what))   
      while ((ax= arr.indexOf(what)) !== -1) {   
          arr.splice(ax, 1);
      }
  }
  return arr;
}


onClick('#add_account_valid', async function () { 
  if(GV.networkStatus==0)return;
  if (!check_form("#form_account")) {
    return;
    }
  var wilaya_lenght = $( ".wilaya-tag" ).length;
  var company_lenght = $( ".comany-tag" ).length;
  $('#error').html('')
  if(company_lenght == 0 && wilaya_lenght == 0){
    $('#error').html('')
    $('#error').html('Veuiller ajouter une entreprise et une willaya pour ce compte')
    return
  }if(company_lenght == 0 && wilaya_lenght != 0){
    $('#error').html('')
    $('#error').html('Veuiller ajouter une entreprise pour ce compte')
    return
  }if(wilaya_lenght == 0 && company_lenght != 0){
    $('#error').append('<br>Veuiller ajouter une willaya pour ce compte')
    $('#error').html('')
    return
  }else{
    $('#error').html('')
  }
  var username = $("#form_account .username").val()
  
  GV.accounts = {}
  await  load_items("accounts", {username :username, disable : '0' })
  var accounts = Object.values(GV.accounts)
  
  if(accounts.length == 0){   
    $('.message-info').css('display', 'none')
    await add("accounts", "#form_account",GV.accounts) 
    GV.accounts = {}
    if(GV.ObjCurrentUser.manager == "0"){
      await search_items ("accounts", 'id_profil', {id:GV.current_user,  disable : '0'}, `"${GV.current_company.id}"` )
    }else{
      await search_items ("accounts", 'id_profil', {admin : "0",  disable : '0'}, `"${GV.current_company.id}"` )
      await load_items("accounts", {admin : "1"})
    }
    displayAccounts()
    $('#side_menu').css('display','none');
    $('#overlay').css('display','none');
  } else{

    $('.message-info').removeClass('hide')
  }   
});

onClick('#edit_account_valid', async function () { 
  if(GV.networkStatus==0)return;
  var id =$(this).data('id')
  await update(id,"accounts", "#form_account",GV.accounts) 
  GV.accounts = {}
  if(GV.ObjCurrentUser.manager == "0"){
    await search_items ("accounts", 'id_profil', {id:GV.current_user,  disable : '0'}, `"${GV.current_company.id}"` )
  }else{
    await search_items ("accounts", 'id_profil', {admin : "0",  disable : '0'}, `"${GV.current_company.id}"` )
    await load_items("accounts", {admin : "1"})
  }
  displayAccounts()
  $('#side_menu').css('display','none');
  $('#overlay').css('display','none');

});


function CheckStatut( selector ){
if(selector == "1"){
  return true
}
}


$(document).on('change','.cheked_class', function(){
  if($(this).is(":checked")) {
    $(this).val(1)
  }else{   
    $(this).val(0)
  }
});


//! ///////////////////////////////////////////////////////////
//! //////////////////!    facturation     //////////////////////////
//! ///////////////////////////////////////////////////////////
GV.item_index = 1

GV.initialize_page.facturation= async function(){
  searchBar(".table_items") 
  GV.designations = {}
  GV.folders= {}
  GV.files= {}
  if(GV.ObjCurrentUser.manager == "0"){
    await load_items('folders',{id_profil: GV.current_company.id,  id_account : GV.current_user})
    await load_items('designations',{id_profil: GV.current_company.id})
  }else{
    await load_items('folders',{id_profil: GV.current_company.id})
    await load_items('designations',{id_profil: GV.current_company.id})
  }
  displaybtnFracture('Facture_proforma')
  displayDropdownClient('crm')
  displayDropdownItems()
  displayEmptyTheInvoice()
  displayInvoiceShow()
  isManager()
  isAdministater()
  $('.btn_type').removeClass('btn_type_selected')
  $('.btn_nav_devis').addClass('btn_type_selected')
  $(".number_facture").hide()
}

onClick('.refrech_invoice', async function () { 
  displayEmptyTheInvoice()
  displayInvoiceShow()
  })


  function addMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);
  
    return date;
  }

function displayEmptyTheInvoice(){
  // $('#payment_deadline').prop( "disabled", true );
  document.getElementById('date_issue').valueAsDate = new Date();
  // document.getElementById('payment_deadline').valueAsDate = addMonths(1, new Date()) 
  $('#input_company').val('')
  $('#number_bon').val('')
  $('#articles_section').html('') 
  $('#total_file').val('0')
  $('#filter_operations').css("display", "none")
}


// $(document).on('change','#facturation_page .deadline_time', async function(){

//   let val = $(this).val()
//   if(val == '0'){
//     $('#payment_deadline').prop( "disabled", false );
//   }else{
//     $('#payment_deadline').prop( "disabled", true );
//     document.getElementById('payment_deadline').valueAsDate = addMonths(val, new Date()) 
//   }
// })

function displayDropdownItems(){
  $('#facturation_page .filter_items').html("")

  html1 = `<option value="" style="color: #aaaaaa;" selected="true" disabled="disabled">Sélectionnez un article depuis votre bibliothèque </option>`
  $('#facturation_page .filter_items').append(html1)

   for(let id of Object.keys(GV.designations)){
    var designation=GV.designations[id]
    html = `<option value="${designation.id}">${designation.name} ( ${designation.unit_price} DA )</option>`
    $('#facturation_page .filter_items').prepend(html)
   }
  
}

function displaybtnFracture(file){

  var date = moment().format("YYYY-MM-DD");

  $('.title_type').html('')
  html1=`${file.split('_').join(' ')}`
  $('.title_type').html(html1)

  $('.number_file').html('')
  html_number=`N°${file.split('_').join(' ')}`
  $('.number_file').html(html_number)

  $('#date_file').html('')
  html_date=`${date}`
  $('#date_file').html(html_date)


  $('.btn_files').html('')
  html=`
  <div id="generate_file" data-id="${file}" class="button   text_center cursor bold "  style=" width: 50%; padding: 10px;margin: auto; color: #ffff;    background-image: linear-gradient(98.69deg,#1ea2f0 -32.8%,#1262e5 153.9%);"> Générer</div>
`
  $('.btn_files').html(html)
}

$(document).on('change','#facturation_page .filter_items', async function(){

  let id = $(this).val()
  let item_index = GV.item_index++
  let item = GV.designations[id]
  let html = `
<div class="margin_top10 this_item content_${item_index}" style="background-color: rgb(248 249 253); padding: 10px;border-radius: 5px; ">
  <div class="header-title  margin_top10 content_${item_index}"> # Articles : <div class="remove_item" data-id="${item_index}" style="width: fit-content;"><i class="fa-solid fa-trash" style="color: #20203a;"></i> </div> </div>
  <div class=" item_content grid gap-10 margin_top10">
      <div>
        <div class="label" style="padding: 0px !important; width: 100%; font-size: 12px!important;"> Article </div>
        <input id="description${item_index}" class="content_editable description" type="text" value="${item.name}">
      </div>
  </div>
  <div class=" item_content grid colmn5 gap-10 margin_top10">
      <div>
        <div class="label" style="padding: 0px !important; width: 100%; font-size: 12px!important;"> Ref </div>
        <input id="reference${item_index}" class="content_editable description" type="text" value="${item.ref}">
      </div>
      <div>
        <div class="label" style="padding: 0px !important; width: 100%; font-size: 12px!important;"> Unité </div>
        <input id="unit${item_index}" class="content_editable unit" type="text"   value="${item.unity}">
      </div>
      <div>
        <div class="label" style="padding: 0px !important; width: 100%; font-size: 11px!important;"> Prix unitaire </div>
        <input id="unit_price${item_index}" data-value="${item_index}" class="content_editable unit_price_item" type="number"  value="${item.unit_price}">
      </div>
      <div>
        <div class="label" style="padding: 0px !important; width: 100%; font-size: 12px!important;"> Qantité </div>
        <input id="quantity${item_index}" data-value="${item_index}" class="content_editable quantity_item" type="number"  value="1">
      </div>
      <div>
        <div class="label" style="padding: 0px !important; width: 100%; font-size: 12px!important;"> Total </div>
        <input id="total_price${item_index}" class="content_editable qty1 "  disabled  value="">
      </div>
  </div>
  <div>
      <div class="label" style="color: #0075eb; "> + Réduction </div>
      
      <div class="grid colmn2 facturation_form gap-10">
     
          <div class="box"> 
            <select id="reduce_unity${item_index}" type="text" class="reduce_unity"> 
                <option value="DA">DA</option>
                <option value="%">%</option>                        
            </select>
          </div>      
          
          <input id="reduce${item_index}" data-value="${item_index}" class="content_editable reduce_item" type="number"  value="0" style="margin: 5px; ">
        
      </div>
  
  </div>
</div>
  `
  $('#articles_section').prepend(html)

  console.log(item_index)
  
  let quantity = $(`#quantity${item_index}`).val()
  let unit_price = $(`#unit_price${item_index}`).val()
  let reduce= $(`#reduce${item_index}`).val()
  let total = (parseFloat(quantity)*parseFloat(unit_price))-parseFloat(reduce)
  
  $(`#total_price${item_index}`).val(total)
  displayTotalInvoice()
  displayInvoiceShow()
})

function displayInvoiceShow(){
  $('#invoice_show').html("")

if( $("#total_file").val()== ''){
  var total_file = '0'
}else {
  var total_file = $("#total_file").val()
}
if($('.filter_clients').val() == ''){
  var id_folder = ''
}else{
  for(var i = 0 ; i < Object.values(GV.folders).length; i++){
    if(Object.values(GV.folders)[i].hasOwnProperty("name") && Object.values(GV.folders)[i].name === $('.filter_clients').val()) {
      var id_folder = Object.values(GV.folders)[i].id    
    }
  } 
}

 var file = {total:  total_file,
             tva:  $("#tva_value").val(), 
             id_folder: id_folder, 
             type: $(".title_type").html(),
             number_bon: $('#number_bon').val(),
             number_facture: $('#number_facture').val(),
             escompte : $('#escompte_file').val(),
             escompte_unity:   $('#escompte_unity').val(),
             description: $('.ql-editor').html(),
            }
             
 var price = (file.total).replace(/,/g,'')

  var prixHT = parseFloat(price)
  var sum = 1+(parseFloat(file.tva)/100)
  var prixTTC = prixHT*sum
  var decimalPart = prixTTC - parseInt(prixTTC);
  
  var tva = prixHT*(parseFloat(file.tva)/100)
  let html = `
  <div class="modal-content_details" style="padding: 0rem; height: 75vh;">

  <div class="modal-body_details" style="grid-template-columns: 1fr !important; padding: 10px; height: 100% !important; overflow-x: hidden;">

  <div class="invoice_container"  style="-webkit-print-color-adjust: exact; font-size: 15px !important; padding: 0px !important;">
  <div class="clearfix header_pdf" style=" -webkit-print-color-adjust: exact;     font-size: 10px;">

      <div id="invoice">
          
        <h2>${file.type.split('_').join(' ')}  </h2>
        <div class="date">Date : ${moment($('#date_issue').val()).format('DD/MM/YYYY')}</div>

        <div class="date">${file.type =='Facture' ? 'N° bon de commande : '+file.number_bon : ''} ${file.type =="Facture_d'avoir" ? "N° bon de l'ancienne facture : "+file.number_facture : ''}</div>


      </div>
      <div id="logo" style=" -webkit-print-color-adjust: exact;">
      <img src="${GV.url}/img/uploads/${GV.current_company.logo}" style=" -webkit-print-color-adjust: exact;">
      </div>
  </div>

    <div id="details" class="clearfix" style=" font-size: 10px;">
      <div id="client" style="max-width: 275px !important" >
      
        <h2 class="name"><div>${file.id_folder == '' || file.id_folder == undefined ? " " : GV.folders[file.id_folder].raison_social} ${file.id_folder == '' || file.id_folder == undefined ? " " : GV.folders[file.id_folder].name}</div></h2>
        <div class="address">${file.id_folder == '' || file.id_folder == undefined  ? " " : GV.folders[file.id_folder].address} ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].wilaya}</div>
        <div class="email">${file.id_folder == '' || file.id_folder == undefined  ? " " :GV.folders[file.id_folder].phone}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIF :  ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].nif}` }</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `RC : ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].rc}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `AI : ${file.id_folder == '' || file.id_folder == undefined  ? " " :GV.folders[file.id_folder].ai}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIS: ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].nis}`}</div>
      </div>
      <div id="company" style=" -webkit-print-color-adjust: exact;">
        <h2 class="name" style=" -webkit-print-color-adjust: exact;">${GV.current_company.raison_social} ${GV.current_company.name}</h2>

        <div>(+213) ${GV.current_company.phone}</div>
        <div style=" -webkit-print-color-adjust: exact;"><a href="mailto:contact@bgicc.com">${GV.current_company.email}</a></div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">NIF :  ${GV.current_company.nif}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">RC : ${GV.current_company.rc}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">NIS: ${GV.current_company.nis}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">AI: ${GV.current_company.ai}</div>
      </div>
    
    </div>
    <table class="table-pdf" border="0" cellspacing="0" cellpadding="0" style=" font-size: 10px;">
      <thead>
        <tr>
          <th scope="col" style="display: none !important ; background: #fff; padding: 5px;">N°</th>
          <th scope="col" style="width: 35%; font-weight: 600 !important; background: #fff; padding: 5px;">Désignation</th>
          <th scope="col" style="font-weight: 600 !important; background: #fff; padding: 5px;">Unité</th>
          <th scope="col" style="font-weight: 600 !important; background: #fff; padding: 5px;">Prix unitaire </th>
          <th scope="col" style="width: 10%; font-weight: 600 !important; background: #fff;padding: 5px;">Qtn</th>
          <th scope="col" style="max-width: 70px !important; font-weight: 600 !important; background: #fff;padding: 5px;">Réduction</th>
          <th class="total" style="text-align: end; background: #fff;">TOTAL</th>
        </tr>
      </thead>
      <tbody class="items_invoice">


      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">Escompte</td>
          <td colspan="2">${file.escompte_unity =='DA' ? separator(parseFloat(file.escompte).toFixed(2)) : file.escompte} ${file.escompte_unity}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">Total HT</td>
          <td colspan="2">${file.total.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}DA</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">TVA ${file.tva}%</td>
          <td colspan="2">${separator(parseFloat(tva).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2" style="border-bottom: 1px solid #1c1c2b">Total TTC</td>
          <td colspan="2" style="border-bottom: 1px solid #1c1c2b">${separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>

        </tr>
      </tfoot>
    </table>
    <div class="containerNumber" ></div>
    <div> ${file.type == 'Facture' ? `Le délai de paiement : ${moment(file.payment_deadline).format('DD/MM/YYYY')}` : ''} </div>
    
    <div id="thanks" style=" margin-top: 15px;">${file.description}</div>
    <div style="padiing-top : 10px; height: 80px; text-align:right !important;"><img src="${GV.url}/img/uploads/${GV.current_company.cachet}" style="padiing-top : 20px; height: 80px; text-align:right !important;"></div>

</div>

</div>
</div>
  `
  
  $('#invoice_show').html(html)
  $('.items_invoice').html('')
  

  if(decimalPart.toFixed(2) == "0.00"){
    convertNumber(prixTTC.toFixed(0))
   }else{
    convertNumber(prixTTC.toFixed(2))
   }


    $('#invoice_show').html(html)
    displayitems()
}

function displayitems(){
  var number_item = 1
  for( i= 1 ; i<= parseInt(GV.item_index) ; i++){
    if($(`.content_${i}`)[0]){

      if($(`#reduce_unity${i}`).val() == '%'){
        let amount_reduce = ((parseFloat($(`#unit_price${i}`).val()) * parseFloat($(`#quantity${i}`).val()))* parseFloat($(`#reduce${i}`).val()))/100
        var reduce = `<div style="font-size: 10px;color: #4e4e4e;" >${amount_reduce} DA  </div> ${$(`#reduce${i}`).val()}`
      }else{
        var reduce = `${$(`#reduce${i}`).val()}`
      }
      let html = `
      <tr style="font-weight: 600 !important;">
        <td class="desc" style="display: none !important">${number_item++}</td>
        <td class="desc" style="width: auto;padding: 5px;"><div style="color: #9e9e9e;font-size: 9px;">${$(`#reference${i}`).val()} </div>${$(`#description${i}`).val()} </td>
        <td class="qty" style="max-width: 70px !important;">${$(`#unit${i}`).val()}</td>
        <td class="unit">${separator(parseFloat($(`#unit_price${i}`).val()).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}DA</td>
        <td class="qty" style="max-width: 70px !important; padding: 5px;">${$(`#quantity${i}`).val()}</td>
        <td class="qty" style="max-width: 70px !important;padding: 5px;">${$(`#reduce_unity${i}`).val() == 'DA' ? separator(parseFloat($(`#reduce${i}`).val()).toFixed(2).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})):  reduce } ${$(`#reduce_unity${i}`).val()}</td>
        <td class="total" style="padding: 5px;">${separator(parseFloat($(`#total_price${i}`).val()).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>
      </tr>
      `      
      $('.items_invoice').append(html)

    }else{

    }}
}
onClick('.remove_item', async function () { 
  let data = $(this).data('id')
  $(`.content_${data}`).remove();
  displayTotalInvoice()
  displayInvoiceShow()
})

function displayTotalInvoice(){

  let sum = 0;
  let escompte_file = $(`#escompte_file`).val()
  let escompte_unity = $(`#escompte_unity`).val()

  $(".qty1").each(function(){
    sum += +$(this).val();
  });

  if(escompte_unity == 'DA'){
    var totalPrice = sum - escompte_file
  }if(escompte_unity == '%'){

    var percentage = (parseFloat(sum) * parseFloat(escompte_file))/100
    var totalPrice = sum - percentage
    
  }else{

  }
  $("#total_file").val(totalPrice);
}


$("#editor").keyup(function(){

  let id = $(this).data('value')
  let quantity = $(`#quantity${id}`).val()
  let unit_price = $(`#unit_price${id}`).val()
  let reduce_unity = $(`#reduce_unity${id}`).val()
  let reduce= $(`#reduce${id}`).val()
  if(reduce_unity == 'DA'){
    var total = (parseFloat(quantity)*parseFloat(unit_price))-(parseFloat(reduce)*parseFloat(quantity))
  }if(reduce_unity == '%'){
    var total = (parseFloat(quantity)*parseFloat(unit_price))-(((parseFloat(reduce)*parseFloat(unit_price))/100)*parseFloat(quantity))
  }else{
  }

  $(`#total_price${id}`).val(total)
  displayTotalInvoice()
  displayInvoiceShow()
});


$(document).on('change','.unit_price_item, .reduce_unity, .quantity_item, .reduce_item, #input_company, #escompte_file, #tva_value, #escompte_unity, #facture_page .unit, #facture_page .description, .ql-editor', async function(){

  
  let id = $(this).data('value')
  let quantity = $(`#quantity${id}`).val()
  let unit_price = $(`#unit_price${id}`).val()
  let reduce_unity = $(`#reduce_unity${id}`).val()
  let reduce= $(`#reduce${id}`).val()
  if(reduce_unity == 'DA'){
    var total = (parseFloat(quantity)*parseFloat(unit_price))-(parseFloat(reduce)*parseFloat(quantity))
  }if(reduce_unity == '%'){
    var total = (parseFloat(quantity)*parseFloat(unit_price))-(((parseFloat(reduce)*parseFloat(unit_price))/100)*parseFloat(quantity))
  }else{
  }

  $(`#total_price${id}`).val(total)
  displayTotalInvoice()
  displayInvoiceShow()
})




onClick('#generate_file', async function () { 
  if(GV.networkStatus==0)return;
  if($(".filter_clients").val() == '' || $(".filter_operations").val() == null ){
    $('.message_error').css('display', 'none')
    $('.message_error').css('display', 'block')
  }else{
    for(var i = 0 ; i < Object.values(GV.folders).length; i++){
      if(Object.values(GV.folders)[i].hasOwnProperty("name") && Object.values(GV.folders)[i].name === $('.filter_clients').val()) {
        var client = Object.values(GV.folders)[i].id    
      }
    } 
    if(($('#generate_file').data('id') != 'Facture_proforma') &&  ((GV.folders[client].nis == null ||GV.folders[client].nis == "") || (GV.folders[client].nif == null ||GV.folders[client].nif == "") || (GV.folders[client].rc == null ||GV.folders[client].rc == "") || (GV.folders[client].ai == null ||GV.folders[client].ai == "") || (GV.folders[client].email == null ||GV.folders[client].email == "")  )){
      // alert()
      $('.popup_alert').css('display', 'block')     
      $('.popup_alert .btn-outline-success').css('display', 'none')     
      $('.message_alert').html(`Afin de poursuivre cette opération veuillez compléter les informations suivantes <br> <div class="btn btn-outline-success cursor margin_top10 brder" style=" font-weight: 600; color: #1b2045; padding-top: 5px;" id="btn_edit_side_folder" data-id="${client}"> Rensegner les informations</div>`)        

      // navigate_to('crm')
    }else{

      $(this).prop( "disabled", true );
      await add("files", "#facturation_form",GV.files)
      await additems()

      let number = parseFloat($('#total_file').val())
      let amount = parseFloat(GV.current_company.max_amount)
      if((GV.current_company.max_amount != 'null' || GV.current_company.max_amount != null) && (number >= amount &&  GV.ObjCurrentUser.manager != '1')){


          $('.popup').css('display', 'none')
          $('.message_error').css('display', 'none')
          $('#overlay').css('display', 'none')
          $('.popup_alert').css('display', 'block')     
          // $('.popup_alert .btn-outline-success').css('display', 'none')     
          $('.message_alert').html(`Le montant de ce document est important et doit être soumis à une validation par un manager`)        
         
        }else{
          await displayFactureGenerate(GV.id_fileUnique)
          $('.modal-dialog_details').css('display', 'block')
          $('.modal_details').css('display', 'block')
          $('.popup').css('display', 'none')
          $('.message_error').css('display', 'none')
        }
 
      await displayFinalFile(GV.id_fileUnique,`http`, "print") 
      var file = GV.files[GV.id_fileUnique]
      var type = file.type
      await generatFile(GV.id_fileUnique, type)
  }}
  $(this).prop( "disabled", false );
  })
  
  
  async function generatFile(id, type){
  var filId = id
  var html = $('.pdf').html()
  var options = {
    type: "POST",
    url: `/generatFile`,
    cache: false,
    data:{html, filId, type},
  };
  
  var received_data = await $.ajax(options);
  if (received_data.ok) {
      console.log('ok')
      alert()      
  }  
  }


onClick('#download_file', async function () { 
  let id = $(this).data('id')
  ExportPdf(GV.files[id].type)
  })
  onClick('#print_file', async function () { 
      printJS({ printable: 'pdf', type: 'html',  css: 'css/admin.css',  css: 'css/general_style.css', targetStyles:['*'],
      style: `

  .pdfnone{display: none;}
  .clearfix:after { content: ""; display: table;clear: both;}
  a {color: #0087C3; text-decoration: none;}
  .header_pdf {padding: 10px 0;} 
  #logo { float: right;margin-top: 8px;} 
  #logo img { height: 85px;}
  #company {float: left; text-align: left;   border-left: 2px solid #c0c0c0;   padding-left: 10px; font-size: 9px;
  } 
  #details {margin-bottom: 20px;} 
  #client { padding-left: 6px; float: right; font-size: 9px;
  } 
  #client .to { color: #777777;} 
  h2.name {font-size: 1.4em; font-weight: normal;margin: 0;} 
  #invoice { float: left;text-align: left;  }
  #invoice h1 {color: #0087C3;font-size: 2.4em; line-height: 1em;font-weight: normal; margin: 0  0 10px 0;} 
  #invoice .date {font-size: 1.1em;color: #777777;}
  .table-pdf { width: 100%;border-collapse: collapse;border-spacing: 0; margin-bottom: 20px;} 
  .table-pdf th, .table-pdf td {padding: 5px;border-bottom: 1px solid #cecece;; }
  .table-pdf th { white-space: nowrap;font-weight: normal; }
  th, td {    border-style: solid;}
  .table-pdf td {  text-align: left; } 
  .table-pdf td h3{color: #1c1c2b;font-size: 1.2em;font-weight: normal;margin: 0 0 0.2em 0;} 
  .table-pdf .no {color: #FFFFFF;font-size: 1.6em;  background: #1c1c2b;}
  .table-pdf .desc { text-align: left; }
  .table-pdf .unit { }
  th, td {
    border-style: solid 1px #DDD;
  }
  .table-pdf .total {font-weight: 600
    color: #272727; }

  .table-pdf td.unit,
  .table-pdf td.qty,
  .table-pdf td.total { font-size: 12.5px; }

  .table-pdf tbody tr:last-child td {}

  .table-pdf tfoot td { padding: 5px;  background: #FFFFFF; border-bottom: none;font-size: 10px; white-space: nowrap; border-top: 1px solid #AAAAAA; }
  .table-pdf tfoot tr:first-child td {border-top: none; }

  .table-pdf tfoot tr:last-child td {color: #1c1c2b;font-size: 12px;font-weight: 600;border-top: 1px solid #1c1c2b;     width: 100% !important;
  }

  .table-pdf tfoot tr td:first-child {border: none;}

  #thanks{ }

  #notices{padding-left: 6px;border-left: 6px solid #0087C3;}

  #notices .notice {font-size: 1.2em;}

  .footer_pdf { color: #777777;width: 100%;height: 30px; position: absolute; bottom: 0; border-top: 1px solid #AAAAAA; padding: 8px 0; text-align: center; }

  .invoice-head td { padding: 0 8px;}
  .invoice_container {padding:20px;
  font-size: 15px !important
  }
  .label_container { padding:10px;border:5px solid black;border-radius: 5px; height: 15cm; width: 10cm;display: grid; grid-template-rows: 130px 1fr;  margin-top:20px
  }
  .invoice-body{  background-color:transparent;}
  .invoice-thank{ margin-top: 60px; padding: 5px;}
  .address{ margin-top:15px;}`})

})
  function ExportPdf(name){
 
    var element = document.getElementById('id_pdf');
    html2pdf(element, {
      margin:   10,
      filename:  `${name}.pdf`,
      jsPDF:    { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });

  }



  




  function displayDropdownOperation(){

    $('.filter_operations').html("")
    html1 = `<option value="" selected="true" disabled="disabled">Sélectionner une opération</option>`
    $('.filter_operations').append(html1)
  
     for(let id of Object.keys(GV.operations)){
      var operation=GV.operations[id]
      html = `<option value="${operation.id}">${operation.name}</option>`
      $('.filter_operations').prepend(html)
  
     }
  }
  
  onClick('#add_new_operation_facturation', function(){
    $('#overlay').css('display', 'grid')
    // $('#overlayTop').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    for(var i = 0 ; i < Object.values(GV.folders).length; i++){
      if(Object.values(GV.folders)[i].hasOwnProperty("name") && Object.values(GV.folders)[i].name === $('.filter_clients').val()) {
        var id_folder = Object.values(GV.folders)[i].id    
      }
    } 
    GV.id_folder =  id_folder
    displaySideOperation()
  })
  

  
  $(document).on('change','#facturation_page .filter_clients', async function(){

    if($('.filter_clients').val()==''){
      $('#filter_operations').css( "display", 'none' );
  console.log($('.filter_clients').val())
    }else{  

      for(var i = 0 ; i < Object.values(GV.folders).length; i++){
        if(Object.values(GV.folders)[i].hasOwnProperty("name") && Object.values(GV.folders)[i].name === $('.filter_clients').val()) {
          var id_folder = Object.values(GV.folders)[i].id
          
        }
      } 
      if(id_folder === undefined){
        $('.filter_clients').css('border', '1px solid red')
        $('.message_not_find').css('display', 'block')
        $('#filter_operations').css( "display", 'none' ); 
        GV.operations = {}
        displayDropdownOperation()  
      }else{
        $('.filter_clients').css('border', 'solid 1px #364d6c')
        $('.message_not_find').css('display', 'none')
        $('#filter_operations').css( "display", 'block' ); 
        GV.operations = {}
        await load_items('operations',{id_folder: id_folder})
        displayDropdownOperation()  
      }
   
    }
  })

  function displayDropdownClient(obj){
    $('#facturation_page .filter_clients').html("")
  
    html1 = `<option value="" selected="true" disabled="disabled">Sélectionner un client</option>`
    $('#facturation_page .filter_clients').append(html1)
  
    
     for(let id of Object.keys(GV.folders)){
      var folder=GV.folders[id]
      if(obj == 'fournisseur'){
        if(folder.category != "Fournisseur")continue;
      }else{
        if(folder.category == "Fournisseur")continue;
      }
      html = `<option data-value='${folder.name}' value="${folder.name}"></option>`
      $('#facturation_page .filter_clients').prepend(html)
     }
  }

  onClick('.btn_type', async function () { 
    $('.btn_type').removeClass('btn_type_selected')
    $(this).addClass('btn_type_selected')
    
    
    var file = $(this).data('type')
    displaybtnFracture(file)
    
    if(file == 'Bon_de_commande'){
      displayDropdownClient('fournisseur')
    }else{
      displayDropdownClient('crm')
    }

    if(file == "Facture" ){
      $(".number_bon").show()
    }else{
      $(".number_bon").hide()
    }
    if(file == "Facture_d_avoir"){
      $(".number_facture").show()
    }else{
      $(".number_facture").hide()
    }
    displayInvoiceShow()
    })

    async function additems(){
      if(GV.networkStatus==0)return;
      let item = $("#articles_section").find(".item_content")
     
      if(item.length == 0){
        GV.products = ["test_empty"]
      }else{
        for( i= 1 ; i<= parseInt(GV.item_index) ; i++){
          if($(`.content_${i}`)[0]){
    
            GV.unit =$(`#unit${i}`).val()
            GV.quantity =  $(`#quantity${i}`).val()
            GV.unit_price = separator(parseFloat($(`#unit_price${i}`).val()).toFixed(2))
            GV.total_price =separator(parseFloat($(`#total_price${i}`).val()).toFixed(2))
            GV.description = $(`#description${i}`).val()  
            GV.reference= $(`#reference${i}`).val()  
            GV.unity_reduce = $(`#reduce_unity${i}`).val()  
            GV.reduce = $(`#reduce${i}`).val()  
          await load_items('items', {})
          console.log(i, GV.unit_price )
          await add("items", "#articles_section",GV.items)
    
          }else{
    
          }
    
    
        }
      }
    }


async function displayFactureGenerate(id){

  await load_items('folders', {})
  await load_items('files', {id : id})

  var file = GV.files[id]
  console.log(file)
  $('.pdf').html('')
  $('.modal-dialog_details').html("")
  var price = (file.total).replace(/,/g,'')

  var prixHT = parseFloat(price)
  var sum = 1+(parseFloat(file.tva)/100)
  var prixTTC = prixHT*sum
  var decimalPart = prixTTC - parseInt(prixTTC);
  
  var tva = prixHT*(parseFloat(file.tva)/100)
  html_modal = `
  <div class="modal-content_details">
  <div class="modal-header_details" style="background-color: #1c1c2b;">
      <div class="grid colmn3">
        <div id="print_file" class="text_color2 text_center cursor  manager_access" style=" width: 90%; padding: 10px ; font-size: 15px;"> <i class="fa-solid fa-print light_grey "></i><br>Imprimer</div>
        <div id="download_file" data-id="${file.id}" class=" text_color2 text_center cursor  manager_access" style=" width: 90%;     padding: 10px ; font-size: 15px;"><i class="fa-solid fa-download light_grey "></i> <br>Télécharger </div>
        <div id="send_file_mail" data-id="${file.id}" class=" text_color2 text_center cursor  manager_access" style=" width: 90%;padding: 10px ; font-size: 15px;"><i class="fas fa-sign-out-alt  light_grey "></i> <br>Envoyer </div>
        
      </div>

    <div id="details_skip" class="exit refrech_invoice"><i class="fa fa-times exit"></i></div>
  </div>

  <div class="modal-body_details" style="grid-template-columns: 1fr !important">

  <div class="invoice_container"  style="-webkit-print-color-adjust: exact; font-size: 15px !important">
  <div class="clearfix header_pdf" style=" -webkit-print-color-adjust: exact;">

    <div id="company" style=" -webkit-print-color-adjust: exact;">
      <h2 class="name" style=" -webkit-print-color-adjust: exact;">${GV.current_company.raison_social} ${GV.current_company.name}</h2>

      <div>(+213) ${GV.current_company.phone}</div>
      <div style=" -webkit-print-color-adjust: exact;"><a href="mailto:contact@bgicc.com">${GV.current_company.email}</a></div>
      <div class="email" style=" -webkit-print-color-adjust: exact;">NIF :  ${GV.current_company.nif}</div>
      <div class="email" style=" -webkit-print-color-adjust: exact;">RC : ${GV.current_company.rc}</div>
      <div class="email" style=" -webkit-print-color-adjust: exact;">NIS: ${GV.current_company.nis}</div>
      <div class="email" style=" -webkit-print-color-adjust: exact;">AI: ${GV.current_company.ai}</div>
    </div>
    <div id="logo" style=" -webkit-print-color-adjust: exact;">
     <img src="${GV.url}/img/uploads/${GV.current_company.logo}" style=" -webkit-print-color-adjust: exact;">
    </div>
  </div>

    <div id="details" class="clearfix">
      <div id="client" style="max-width: 275px !important" >
      
        <h2 class="name"><div>${GV.folders[file.id_folder].raison_social} ${GV.folders[file.id_folder].name}</div></h2>
        <div class="address">${GV.folders[file.id_folder].address} ${GV.folders[file.id_folder].wilaya}</div>
        <div class="email">${GV.folders[file.id_folder].phone}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIF :  ${GV.folders[file.id_folder].nif}` }</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `RC : ${GV.folders[file.id_folder].rc}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `AI : ${GV.folders[file.id_folder].ai}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIS: ${GV.folders[file.id_folder].nis}`}</div>
      </div>
      <div id="invoice">
      <h2>${file.type.split('_').join(' ')}  </h2>
      ${file.cancel_status == "1" ? "<h3 style='color: red'>Facture annulée</h3>" : ''}
      
        <div class="date">Date : ${moment(file.date_issue).format('DD/MM/YYYY')}</div>

        <div class="date">${file.type =='Facture' ? 'N° bon de commande : '+file.number_bon : ''} ${file.type =="Facture_d'avoir" ? "N° bon de l'ancienne facture : "+file.number_facture : ''}</div>


      </div>
    </div>
    <table class="table-pdf" border="0" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th scope="col" style="display: none !important">N°</th>
          <th scope="col" style="width: 35%;  height: auto; font-weight: 600 !important;">Désignation</th>
          <th scope="col" style="width: auto; height: auto; font-weight: 600 !important; ">Unité</th>
          <th scope="col" style="font-weight: 600 !important;">Prix unitaire </th>
          <th scope="col" style="width: 10%;  font-weight: 600 !important;">Qtn</th>
          <th scope="col" style="max-width: 70px !important; font-weight: 600 !important;">Réduction</th>
          <th class="total" style="text-align: end;">TOTAL</th>
        </tr>
      </thead>
      <tbody class="items_invoice">


      </tbody>
      <tfoot>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">Escompte</td>
            <td colspan="2">${file.escompte_unity =='DA' ? separator(parseFloat(file.escompte).toFixed(2)) : file.escompte} ${file.escompte_unity}</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">Total HT</td>
            <td colspan="2">${file.total.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}DA</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">TVA ${file.tva}%</td>
            <td colspan="2">${separator(parseFloat(tva).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}</td>
            </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2" style="border-bottom: 1px solid #1c1c2b">Total TTC</td>
            <td colspan="2" style="border-bottom: 1px solid #1c1c2b">${separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>

          </tr>
      </tfoot>
    </table>
    <div class="containerNumber" ></div>
    <div> ${file.type == 'Facture' ? `Le délai de paiement : ${moment(file.payment_deadline).format('DD/MM/YYYY')}` : ''} </div>
    
    <div id="thanks" style=" margin-top: 15px;">${file.description}</div>
    ${file.type == "Facture_proforma" ? "": `<div style="padiing-top : 20px; height: 120px;  text-align:right !important;"><img src="${GV.url}/img/uploads/${GV.current_company.cachet}" style="padiing-top : 20px; height: 120px; text-align:right !important;"></div>` }


</div>


</div>
</div>
  `
  html = `

  <div class="invoice_container" style="font-size: 15px !important">
    <div id="invoice">
      <h2>${file.type.split('_').join(' ')} : ${file.file_number} </h2>
     ${file.cancel_status == "1" ? "<h3 style='color: red'>Facture annulée</h3>" : ''}
      <div class="date">Date : ${moment(file.date_issue).format('DD/MM/YYYY')}</div>  
      <div class="date">${file.type =='Facture' ? 'N° bon de commande : '+file.number_bon : ''}</div> 
    </div>
    <div id="logo" style=" -webkit-print-color-adjust: exact;">
      <img src="${GV.url}/img/uploads/${GV.current_company.logo}" style=" -webkit-print-color-adjust: exact;">
    </div>
  </div>

    <div id="details" class="clearfix">
      
      <div class="clearfix header_pdf">

        <div id="company" style=" -webkit-print-color-adjust: exact;">
        <h2 class="name" style=" -webkit-print-color-adjust: exact;">${GV.current_company.raison_social} ${GV.current_company.name}</h2>
    
        <div>(+213) ${GV.current_company.phone}</div>
        <div style=" -webkit-print-color-adjust: exact;"><a href="mailto:contact@bgicc.com">${GV.current_company.email}</a></div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">NIF :  ${GV.current_company.nif}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">RC : ${GV.current_company.rc}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">NIS: ${GV.current_company.nis}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">AI: ${GV.current_company.ai}</div>
      </div>
      <div id="client" style="max-width: 275px !important">
      
        <h2 class="name"><div>${GV.folders[file.id_folder].name}</div></h2>
        <div class="address">${GV.folders[file.id_folder].address} ${GV.folders[file.id_folder].wilaya}</div>
        <div class="email">${GV.folders[file.id_folder].phone}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIF :  ${GV.folders[file.id_folder].nif}` }</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `RC : ${GV.folders[file.id_folder].rc}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `AI : ${GV.folders[file.id_folder].ai}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIS: ${GV.folders[file.id_folder].nis}`}</div>
      </div>

    </div>
    <table class="table-pdf" border="0" cellspacing="0" cellpadding="0">
      <thead>
        <tr style="font-weight: 600 !important;">
          <th scope="col" style="display: none !important">N°</th>
          <th scope="col" style="width: 35%; height: auto; font-weight: 600 !important;">Désignation</th>
          <th scope="col" style="width: auto; height: auto; font-weight: 600 !important;">Unité</th>

          <th scope="col" style="font-weight: 600 !important;">Prix unitaire </th>
          <th scope="col" style="width: 10%; font-weight: 600 !important;">Quantitée</th>
          <th scope="col" style="max-width: 70px !important; font-weight: 600 !important;">Réduction</th>
          <th class="total" style="text-align: end; font-weight: 600 !important;">TOTAL</th>
        </tr>
      </thead>
      <tbody class="items_invoice">


      </tbody>
      <tfoot>
      <tr>
          <td colspan="2" ></td>
          <td colspan="2">Escompte</td>
          <td colspan="2">${file.escompte_unity =='DA' ? separator(parseFloat(file.escompte).toFixed(2)) : file.escompte} ${file.escompte_unity}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">Total HT</td>
          <td colspan="2">${file.total.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">TVA ${file.tva}%</td>
          <td>${separator(parseFloat(tva).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}</td>
        </tr>
        <tr>
          <td  colspan="2"></td>
          <td colspan="2" style="border-bottom: 1px solid #1c1c2b">Total TTC</td>
          <td colspan="2" style="border-bottom: 1px solid #1c1c2b">${separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>

        </tr>
      </tfoot>
    </table>
    <div class="containerNumber" ></div>
    <div> ${file.type == 'Facture' ? `Le délai de paiement : ${moment(file.payment_deadline).format('DD/MM/YYYY')}` : ''} </div>
    
    <div id="thanks" style=" margin-top: 15px;">${file.description}</div>
    ${file.type == "Facture_proforma" ? "": `<div style="padiing-top : 20px; height: 120px;  text-align:right !important;"><img src="${GV.url}/img/uploads/${GV.current_company.cachet}" style="padiing-top : 20px; height: 120px; text-align:right !important;"></div>` }

</div>
  `

  $('.modal-dialog_details').html(html_modal)

  $('.items_invoice').html('')
  GV.items = {}
   var number_item = 1
  await load_items( 'items', {id_file : file.id})
   for(let id_item of Object.keys(GV.items)){
    var item = GV.items[id_item]
    if(item.unity_reduce == '%'){
      let amount_reduce = ((parseFloat(item.unit_price.replace(/,/g,'')) * parseFloat(item.quantity))* parseFloat(item.reduce))/100
      console.log(parseFloat(item.unit_price).toFixed(2), item.unit_price, parseFloat((item.unit_price).replace(/,/g,'')))
      var reduce = `<div style="font-size: 10px;color: #4e4e4e;" >${amount_reduce} DA  </div> ${item.reduce}`
    }else{
      var reduce = `${item.reduce}`
    }
    let html = `
    <tr style="font-weight: 600 !important;">
      <td class="desc" style="display: none !important">${number_item++}</td>
      <td class="desc" style="width: auto;"><div style="color: #9e9e9e;font-size: 9px;">${item.reference}</div><br>${item.description} </td>
      <td class="qty" style="max-width: 70px !important;">${item.unit}</td>
      <td class="unit">${item.unit_price.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}DA</td>
      <td class="qty" style="max-width: 70px !important;">${item.quantity}</td>
      <td class="qty" style="max-width: 70px !important;">${item.unity_reduce == 'DA' ? separator(parseFloat(item.reduce).toFixed(2).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})) : reduce } ${item.unity_reduce}</td>
      <td class="total">${separator(parseFloat(item.total_price).toFixed(2))} DA</td>
    </tr>

    `
  $('.items_invoice').append(html)

   }

     if(decimalPart.toFixed(2) == "0.00"){
    convertNumber(prixTTC.toFixed(0))
   }else{
    convertNumber(prixTTC.toFixed(2))
   }



}







//! ///////////////////////////////////////////////////////////
//! //////////////////!    profile     //////////////////////////
//! ///////////////////////////////////////////////////////////


GV.initialize_page.profil= async function(){
  searchBar(".table_items")
  displayPlaceholder()
  await load_items("profil",{})
  displayProfil()
  isManager()
  isAdministater()
  PlaceholderisEmpty('#profile_page')
}

onClick('#edit_profile', function(){
  var id = $(this).data('id')
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  displaySideProfile(id)
})

onClick('#delete_profile', async function () { 
  if(GV.networkStatus==0)return;
  var id = $(this).data('id')
  if(Object.values(GV.profil).length == "1"){
    $('.popup_alert').css('display', 'block')     
    $('.popup_alert .btn-outline-success').css('display', 'block')     
    $('.message_alert').html(`Vous ne pouvez malheureusement pas suprimer cette entreprise.`)      
  
  }else{
      $('.popup_alert').css('display', 'block')     
      $('.popup_alert .btn-outline-success').css('display', 'block')    
      $('.message_alert').html(`Êtes-vous sur de vouloir supprimer définitivement cette entreprise

      <br>
      <div class="text_center grid colmn2">
        <div id="valid_not" class=" btn btn-outline-danger " style="font-size: 30px;"> 
          <i class="far fa-times-circle cursor red  ok"></i>
        </div>
        <div data-id="${id}" class="btn btn-outline-success confim_delete" style="font-size: 30px;"> 
          <i class="far fa-check-circle cursor green"></i>
        </div>
      </div>`) 
      
      $('.popup_alert .popup_footer').css('display', 'none') 
  
  }
  
});

onClick('.confim_delete', async function(){

  let id = $(this).data('id')
  $('.popup_alert').css('display', 'none')     
  $('.popup_alert .btn-outline-success').css('display', 'none')  

  await delete_item(id , "profil", GV.profil);
  displayProfil()
  
  if(id == GV.current_company.id){ 
    window.open("login");  
  }else{
    await loadProfil()
    displayProfilDropDown()
  }
 
})
onClick('#add_new_profil', function(){

  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  displaySideProfile()
})



function displaySideProfile(id){

  var profil = GV.profil[id]
  GV.programme_name = {}
  GV.image_name = {}
  $('#side_menu').html("")

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
            <div class="title">${id==undefined ? "Ajouter une nouvelle entreprise" : "Modifier l'entreprise"}</div>
        </div>

        <div id="form_profil" class="body_side_menu">
          <div class="form_container">
            <div id="form_profil_download">
              <div class="input-container grid colmn2 gap-10">

                <div>
                <div class="label">Statut juridique *</div>
                  <select class="content_editable required"  data-id="raison_social" contenteditable="true">
                    <option value="${id==undefined ? "" : profil.raison_social}">${id==undefined ? "" : profil.raison_social}</option>
                    <option value="EURL">EURL</option>
                    <option value="SARL">SARL</option>
                    <option value="SPA">SPA</option>
                    <option value="SNC">SNC</option>
                    <option value="SCS">SCS</option>
                    <option value="SCA">SCA</option>
                    <option value="GR">GR</option>
                    <option value="">Autre</option>
                  </select> 
                </div>  

                <div>
                  <div class="label">Raison social *</div>
                  <input class="content_editable required" type="text" data-id="name" contenteditable="true" value="${id==undefined ? "" : profil.name}"></input>
                </div>
              </div>

              <div class="input-container">
                <div class="label">Adresse *</div>
                <input class="content_editable required" type="text" data-id="address" contenteditable="true" value="${id==undefined ? "" : profil.address}"></input>
              </div>

              <div class="input-container">
              <div class="label">Willaya *</div>
                <select id="willaya" class="content_editable required"  data-id="wilaya" contenteditable="true">
                  <option value="${id==undefined ? "" : profil.wilaya}">${id==undefined ? "" : profil.wilaya}</option>
                </select> 
              </div>

              <div class="input-container">
                <div class="label">Numéro de téléphone *</div>
                <input class="content_editable required" type="text" data-id="phone" contenteditable="true" value="${id==undefined ? "" : profil.phone}"></input>
              </div>

              <div class="input-container">
                <div class="label">Adresse e-mail *</div>
                <input class="content_editable required" type="text" data-id="email" contenteditable="true" value="${id==undefined ? "" : profil.email}"></input>
              </div>

              <div class="input-container">
                <div class="label">Numéro de compte banquaire *</div>
                <input class="content_editable required" type="text" data-id="compte_banquaire" contenteditable="true" value="${id==undefined ? "" : profil.compte_banquaire}"></input>
              </div>

              <div class="input-container">
                <div class="label">Nom de la banque *</div>
                <input class="content_editable required" type="text" data-id="bank_name" contenteditable="true" value="${id==undefined ? "" : profil.bank_name}"></input>
              </div>

              <div class="input-container">
                <div class="label">Numéro de NIF de l'entreprise *</div>
                <input class="content_editable required" type="text" data-id="nif" contenteditable="true" value="${id==undefined ? "" : profil.nif}"></input>
              </div>

              <div class="input-container">
                <div class="label">Numéro AI de l'entreprise *</div>
                <input class="content_editable required" type="text" data-id="ai" contenteditable="true" value="${id==undefined ? "" : profil.ai}"></input>
              </div>

              <div class="input-container">
                <div class="label">Numéro de registre de commerce (RC) de l'entreprise *</div>
                <input class="content_editable required" type="text" data-id="rc" contenteditable="true" value="${id==undefined ? "" : profil.rc}"></input>
              </div>

              <div class="input-container">
                <div class="label">Numéro NIS de l'entreprise *</div>
                <input class="content_editable required" type="text" data-id="nis" contenteditable="true" value="${id==undefined ? "" : profil.nis}"></input>
              </div>
            </div>

              <div class="input-container m-t-20 validatedImageFile" style="margin-bottom : 10px" >
                <div class="label">Logo *</div>
                <input class="content_editable link_media" type="file" id="validatedImageFile" value="${id==undefined ? "" : profil.logo}"></input>
                <div class="progress" style="position: relative ;  height : 7px ;">
                    <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
                    <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
                </div>
              </div>

              <div class="input-container validatedProgrammeFile" style="margin-bottom : 10px" >
                <div class="label">Cachet et signature scanné*</div>
                <input class="content_editable link_media" type="file" id="validatedProgrammeFile" value="${id==undefined ? "" : profil.cachet}"></input>
              
                <div class="progress" style="position: relative ;  height : 7px ;">
                    <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
                    <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
                </div>
              </div>


          </div>
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="${id==undefined ? "add_profil_valid" : 'edit_profil_valid'}" data-id="${id==undefined ? "" : profil.id}" class="btn button text_color3 cursor text_center  submitBtn" >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
    displayWilayas()
}


onClick('#edit_profil_valid', async function () { 
  if(GV.networkStatus==0)return;
  var id = $(this).data('id')

  await update(id,"profil", "#form_profil",GV.profil) 
  displayProfil()
 
  console.log(id,  GV.current_company.id, id ===  GV.current_company.id)
  if(id ===  GV.current_company.id){
    console.log('ok')
    GV.current_company = GV.profil[id]
    await displayUserDetail()
    displayProfilDropDown()
    console.log('test')
  }else{

  }
  $('#side_menu').css('display','none');
  $('#overlay').css('display','none');
});


onClick('#add_profil_valid', async function () { 
  if(GV.networkStatus==0)return;
  await add("profil", "#form_profil",GV.profil) 
  displayProfil()
  await loadProfil()
  displayProfilDropDown()
  $('#side_menu').css('display','none');
  $('#overlay').css('display','none');
});

function displayProfil(){

  $('#profil_content').html("")
  for(let id of Object.keys(GV.profil)){
    var profil=GV.profil[id]

    html = `
    <div  class="table_items grid colmn4 padding_top15 text_color1  center">
      <img id="profil-logo" src="${GV.url}/img/uploads/${profil.logo}">
      <div class="blod text_color3">${profil.raison_social}</div>       
      <div class="blod text_color10">${profil.name}</div>     
     <div class="admin_access">
        <div class="dropdown">
          <i class="fas fa-ellipsis-v dropbtn dropbtn_folder" data-id="${profil.id}" style="font-size: 20px;padding: 10px;"></i>
          <div id="myDropdown_folder_${profil.id}" class="dropdown-content">
          <div class="action" id="edit_profile"  data-id="${profil.id}"><i class="far fa-edit light_grey padding5"></i>Modifier</div>
          <div class="action" id="edit_price_max"  data-id="${profil.id}"><i class="far fa-edit light_grey padding5"></i>Modifier le plafond</div>
          <div class="action" id="delete_profile"  data-id="${profil.id}"><i class="fas fa-trash-alt light_grey padding5"></i>Supprimer</div>
          <div class="action manager_access" id="download_profile" data-id="${profil.id}"><i class="fa-solid fa-info light_grey padding5"></i> Télécharger PDF</div>
        </div>
      </div>
    </div>   
    `

    $('#profil_content').append(html)
  } 

  }

onClick('#download_profile', async function () { 
  let id = $(this).data('id')
  ExportInfo(id)
});

onClick('#edit_price_max', async function () { 
  let id = $(this).data('id')
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  displaySidePrice(id)
});

onClick('#edit_amount_valid', async function () { 
  let id = $(this).data('id')
  await update(id,"profil", "#form_max_price", GV.profil) 
  GV.current_company = GV.profil[id]
  await displayUserDetail()
  $('#overlay').css('display', 'none')
  $('#side_menu').css('display', 'none')
});

function displaySidePrice(id){

  var profil = GV.profil[id]
  $('#side_menu').html("")

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
            <div class="title">Modifier le plafond des factures</div>
        </div>

        <div id="form_max_price" class="body_side_menu">
          <div class="form_container">

              <div class="input-container">
                <div class="label">Montant maximum*</div>
                <div class="label" style="color: #9E9E9E ;font-size: 10px;"> Demander une validation de la part d'un manager pour un montant supérieur ou égale a la valeur suivante*</div>
                <div class="label" style="color: #067d00;font-size: 10px;"> Veuillez vider la cellule si vous ne désirer pas mettre de plafond*</div>
                <label class="container">Désactivé
                  <input id="check_box_number" type="checkbox" ${profil.max_amount == 'null' ? 'checked' : '' }  >
                  <span class="checkmark"></span>
                </label>
                <input id="amount_input" class="content_editable" ${profil.max_amount == 'null' ? 'disabled="true" type="text"' : 'type="number"' } data-id="max_amount" contenteditable="true" value="${profil.max_amount == 'null' ? '' : profil.max_amount }"></input>
              </div>

          </div>
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="edit_amount_valid" data-id="${profil.id}" class="btn button text_color3 cursor text_center submitBtn" >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
}
onClick('#check_box_number', function(){
  toggleFunction()
})
function toggleFunction() {
  var x = document.getElementById("amount_input");
  if (x.type === "number") {
    x.type = "text";   
    $('#amount_input').val('')
    $('#amount_input').prop( "disabled", true )

  } else {
    
      x.type = "number"; 
      $('#amount_input').prop( "disabled", false )
  }
}

function ExportInfo(id){
  displaySideProfile(id)
  var element = document.getElementById('form_profil_download');

  html2pdf(element, {
  margin:   10,
  filename:  'Informations_entreprise.pdf',
  jsPDF:    { unit: 'mm', format: 'a4', orientation: 'portrait' }
});

}




//! ///////////////////////////////////////////////////////////
//! //////////////////!    payment     //////////////////////////
//! ///////////////////////////////////////////////////////////


GV.initialize_page.payment= async function(){
  searchBar(".table_items")
  displayPlaceholder()
  GV.payment = {}
  GV.accounts = {}
  GV.start_date = ""
  GV.end_date = ""
  GV.value_banc= ""
  displayListPaymentFilter()
  if(GV.ObjCurrentUser.manager == "0"){
    await search_items ("accounts", 'id_profil', {admin : "0",  id : GV.current_user}, `"${GV.current_company.id}"` )
    await load_items("payment",{id_profil: GV.current_company.id, id_account : GV.current_user})
    await load_items("folders",{id_profil: GV.current_company.id, id_account : GV.current_user})
    await load_items("files",{validation: '1', id_profil : GV.current_company.id, id_account : GV.current_user})

  }else{
    await search_items ("accounts", 'id_profil', {admin : "0"}, `"${GV.current_company.id}"` )
    await load_items("accounts", {admin : "1"})
    await load_items("payment",{id_profil: GV.current_company.id})
    await load_items("folders",{id_profil: GV.current_company.id})
    await load_items("files",{validation: '1', id_profil : GV.current_company.id})

  }
    await dislayListPayment({category: ""})
  
    PlaceholderisEmpty('#payment_page')
}

function displayListPaymentFilter(){
  $('#list_payment_filters').html('')
  let html = `
                            <div>
                                <div class="input-group">
                                  <input required="" type="text" name="text" autocomplete="off" class="input search_bar">
                                  <label class="user-label">Recherche</label>
                                </div>
                            </div>
                            <div class="selected_filter box"> 
                                <select id="filter_banc" class="filter" type=text value="" placeholder="Toutes les entreprises"> 
                                    <option value="">Toutes les banques</option>
                                    <option value="Arab Bank PLC Algeria">Arab Bank PLC Algeria</option>
                                    <option value="BEA">BEA</option>
                                    <option value="BNA">BNA</option>
                                    <option value="AGB">AGB</option>
                                    <option value="BNP">BNP</option>
                                    <option value="BDL">BDL</option>
                                    <option value="CPA">CPA</option>
                                    <option value="BDL">BDL</option>
                                    <option value="BADR">BADR</option>
                                    <option value="Cnep Banque">Cnep Banque</option>
                                    <option value="AL BARAKA">AL BARAKA</option>
                                    <option value="CITIBANK">CITIBANK</option>
                                    <option value="Société Générale Algérie">Société Générale Algérie</option>
                                    <option value="TRUST BANK Algeria">TRUST BANK Algeria</option>
                                    <option value="Housing Bank">Housing Bank</option>
                                    <option value="Fransabank Al-Djazair">Fransabank Al-Djazair</option>
                                    <option value="Crédit Agricole Corporate Et Investissement Bank Algérie">Crédit Agricole Corporate Et Investissement Bank Algérie</option>
                                    <option value="HSBC Algeria">HSBC Algeria</option>
                                    <option value="Al salam Bank Algeria">Al salam Bank Algeria</option>
                                    <option value="Autre">Autre</option>
                                    
                                </select>
                                
                            </div>
                            <div class="selected_filter grid" style="grid-template-columns: 20px 1fr ;"> 
                                <div class="blod text_color10  margin-auto"> Du</div>
                                <input id="start_date" class="box_input" value="" type="date"  autocomplete="off">
                            </div>
                            <div class="selected_filter grid" style="grid-template-columns: 20px 1fr ;"> 
                                <div class="blod text_color10  margin-auto"> Au</div>
                                <input id="end_date" class="box_input " value="" type="date"  autocomplete="off">
                            </div>
  `
  $('#list_payment_filters').html(html)
}


$(document).on('change','#filter_banc', async function(){
  GV.value_banc  =$(this).val()
  dislayListPayment({category: GV.value_banc})
})

$(document).on('change','#start_date', async function(){
  GV.start_date =$(this).val()
  console.log(GV.start_date)
  if(GV.page_name == 'list'){
    displayAllInvoice({category: GV.value_searched} , {category: GV.value_searched_cancled})
  }else{
    dislayListPayment({category: GV.value_banc})
  }
})
$(document).on('change','#end_date', async function(){
  GV.end_date =$(this).val()
  if(GV.page_name == 'list'){
    displayAllInvoice({category: GV.value_searched} , {category: GV.value_searched_cancled})
  }else{
    dislayListPayment({category: GV.value_banc})
  }
})

function dislayListPayment(filters){

  $('#payment_content').html("")
  for(let id of Object.keys(GV.payment)){
    var payment=GV.payment[id]
    let obj = payment.banc
    if (!check_obj_filters(obj, filters))continue;
    console.log(moment(payment.creation_date).format('YYYY-MM-DD') ,new Date(GV.start_date) )
    if ( moment(payment.creation_date).format('YYYY-MM-DD') < GV.start_date && GV.start_date != "")continue;
    if ( moment(payment.creation_date).format('YYYY-MM-DD') > GV.end_date && GV.end_date != "")continue;

    var price = (GV.files[payment.id_file].total).replace(/,/g,'')
    var prixHT = parseFloat(price)
    var sum = 1+(parseFloat(GV.files[payment.id_file].tva)/100)
    var prixTTC = prixHT*sum
    var rest_price = payment.payment_price

    let total_rest =  parseFloat(prixTTC)-parseFloat(rest_price)
    console.log(prixTTC, total_rest, rest_price)

   
    html = `
    <div class="more_detail_about_payment">
    <div id="" class=" table_items grid colmn7 padding_top15 text_color1  center relative">
    
      <div class="blod text_color7">${GV.folders[GV.files[payment.id_file].id_folder].name}</div> 
      <div class="blod text_color3">${GV.files[payment.id_file].file_number}</div>   
      <div class="blod text_color10">${separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</div>    
      <div class="blod text_color10">${separator(parseFloat(payment.total_payment).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</div>     
      <div class="blod text_color10">${separator(parseFloat(total_rest).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA DA</div>     
      <div class="blod text_color3">${payment.status}</div>     
      <div class="bold text_color3">${moment(payment.creation_date).format('DD/MM/YYYY')}</div>     
    </div>    
    <div class="detail_payment_hover">
        <div class="" style="margin: 10px 0px;">
        <div class="bold" style="color: #25385ee3;font-size: 10px;">Enregistré par</div> <div class="bold " style="font-size: 17px; padding: 3px 0px;color: #25385e; text-shadow: 0 0 3px #00000018;">${GV.accounts[payment.id_account].first_name} ${GV.accounts[payment.id_account].last_name}</div>    
        </div>
        <div class="" style="margin: 10px 0px;">
          <div class="bold" style="color: #25385ee3;font-size: 10px;">Moyen de paiement  </div><div class="bold " style="font-size: 15px; padding: 3px 0px;color: #5953fd; text-shadow: 0 0 3px #00000018;"> ${payment.type_paiment}</div>    
        </div>
        <div class="" style="margin: 10px 0px;">
          <div class="bold" style="color: #25385ee3;font-size: 10px;">Numéro de paiement  </div> <div class="bold " style="font-size: 15px; padding: 3px 0px;color: #5953fd; text-shadow: 0 0 3px #00000018;">${payment.number_paiment}</div>    
        </div>
        <div class="" style="margin: 10px 0px;">
          <div class=" bold" style="color: #25385ee3 ;font-size: 10px;">banque  </div><div class="bold " style="font-size: 15px; padding: 3px 0px;color: #5953fd;  text-shadow: 0 0 3px #00000018;">${payment.banc}</div>    
        </div>
    </div>
    </div>
    `

    $('#payment_content').prepend(html)
  } 

  }

//! ///////////////////////////////////////////////////////////
//! //////////////////!    list_staff     //////////////////////////
//! ///////////////////////////////////////////////////////////


GV.initialize_page.list_staff= async function(){
  searchBar(".table_items")
  displayPlaceholder()
  GV.accounts = {}
  GV.folders = {}
  GV.stat_between = ""
  GV.stat_end = ""
  if(GV.ObjCurrentUser.manager == "0"){
    await search_items ("accounts", 'id_profil', {admin : "0",  id : GV.current_user}, `"${GV.current_company.id}"` )
    await load_items("folders",{id_profil: GV.current_company.id, id_account : GV.current_user})
  }else{
    await search_items ("accounts", 'id_profil', {admin : "0"}, `"${GV.current_company.id}"` )
    await load_items("accounts", {admin : "1"})
    await load_items("folders",{id_profil: GV.current_company.id})
  }
    await dislayListStaffResume("")
    
    PlaceholderisEmpty('#list_staff_page')

}


$(document).on('change','.filter_wilaya', async function(){
  let value =$(this).val()
  await dislayListStaffResume(value)
})




async function dislayListStaffResume(filters){
  $('#list_commerciaux').html('')

  for(let id of Object.keys(GV.accounts)){ 
    let account = GV.accounts[id]
    var obj = account.wilaya
    if(obj == null)continue
    if (!obj.includes(filters) && filters != "")continue; 

    GV.files = {}
    var data = []
    var data_avoir = []
    await load_items("files",{id_account: account.id , validation: '1', cancel_status: "0", id_profil: GV.current_company.id})

    // await load_items("files", {id_account: id_account, validation: 1, id_profil: GV.current_company.id })

    for(let id of Object.keys(GV.files)){
      var file = GV.files[id]
      if( file.cancel_status != '0')continue;
      if(file.type == "Facture"){
        var price = (file.total).replace(/,/g,'')
        var totalHt = parseFloat(price)
        data.push(totalHt);
      }if(file.type == "Facture_d_avoir"){
        let price = (file.total).replace(/,/g,'')
        let totalHt = parseFloat(price)
        data_avoir.push(totalHt);
      }else{
      }
    }
    const sumInvoice = data.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    const sumAvoir = data_avoir.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    const accurancy = sumInvoice-sumAvoir
    let html = `
    <div  class="table_items grid colmn5 padding_top15 text_color1 row_account center cursor" data-id='${account.id}'>

      <div class="header-admin-image">
        <img src="${account.picture == null || account.picture == "" ? `${GV.url}/img/default-user.jpg` : `${GV.url}/img/uploads/${account.picture}`} "/>                           
      </div>       
      <div class="blod ${account.disable == '1'? "gray_color" : "text_color10" }"  >${account.first_name} ${account.last_name} ${account.disable == '1' ? "(Compte désactivé)" : account.admin == '1' ? "( Administrateur )" : `${account.manager == '1' ? "( Manager )" : ""} `}</div> 
      <div class="blod text_color10">${account.wilaya}</div>  
      <div class="blod text_color10">${data.length}</div>
      <div class="blod text_color10">${separator((accurancy).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</div>     

    </div>   
    `
    $('#list_commerciaux').append(html)
  
  } 
}


onClick('.row_account', async function(){
  let id = $(this).data('id')
  let account = GV.accounts[id].id
  GV.files= {}
  console.log(account)
  await displayDetailStatAccount(account)
})

onClick('.exit_popup', async function(){
  $('.popup_detail_account').css('display','none')
})



function groupDates(dates) {
  const groupedDates = {};
  dates.forEach(d => {
      const dt = new Date(d);
      const date = dt.getDate();
      const year = dt.getFullYear();
      const month = dt.getMonth() + 1;
      
      const key = `${year}-${month}`;
      if (key in groupedDates) {
          groupedDates[key].dates = [...groupedDates[key].dates, date];
      } else {
          groupedDates[key] = {
              year,
              month,
              dates: [date],
          };
      }

  });

  return Object.values(groupedDates);
}

$(document).on('change','#stat_date', async function(){
  let id_account =$(this).data('id')
  chartfunction(id_account)
})


function chartfunction(id_account){
 
  var clientRes = []
 for(let id_client of Object.keys(GV.folders)){
  let folder = GV.folders[id_client]
  // console.log(folder)
  if(folder.category != 'Client')continue;
  clientRes.push(folder)
  console.log(clientRes)
 }
 let folders = clientRes
 let res = groupElementBy(folders, "id_account")
 
 index_items(res)
 console.log(res)
  let array = []
  let data = res[id_account] 
console.log(res[id_account] )

  if(data != undefined){ for (let i = 0; i < data.length; i++) {
    let response = data[i]
    let date = response.creation_date
    array.push(date);
    
  } 

  let data_array = groupDates(array)
  console.log(data_array)
  let year = $('#stat_date').val()
  for(let i = 0; i < data_array.length; i++){
    if(data_array[i].year != year)continue;
    console.log(data_array, data_array[i].year)
    if(data_array[i].month == "1"){
      var janvier = data_array[i].dates.length
    }if(data_array[i].month == "2"){
      var fevrier = data_array[i].dates.length
    }if(data_array[i].month == "3"){
      var mars = data_array[i].dates.length
    }if(data_array[i].month == "4"){
      var avril = data_array[i].dates.length
    }if(data_array[i].month == "5"){
      var mai = data_array[i].dates.length
    }if(data_array[i].month == "6"){
      var juin = data_array[i].dates.length
    }if(data_array[i].month == "7"){
      var juillet = data_array[i].dates.length
    }if(data_array[i].month == "8"){
      var aout = data_array[i].dates.length
    }if(data_array[i].month == "9"){
      var septembre = data_array[i].dates.length
    }if(data_array[i].month == "10"){
      var octobre = data_array[i].dates.length
    }if(data_array[i].month == "11"){
      var novembre = data_array[i].dates.length
    }if(data_array[i].month == "12"){
      var decembre = data_array[i].dates.length
    }if(janvier == undefined ){
      var janvier = "0"
    }if(fevrier == undefined ){
      var fevrier = "0"
    }if(mars == undefined ){
      var mars = "0"
    }if(avril == undefined ){
      var avril = "0"
    }if(mai == undefined ){
      var mai = "0"
    }if(juin == undefined ){
      var juin = "0"
    }if(juillet == undefined ){
      var juillet = "0"
    }if(aout == undefined ){
      var aout = "0"
    }if(septembre == undefined ){
      var septembre = "0"
    }if(octobre == undefined ){
      var octobre = "0"
    }if(novembre == undefined ){
      var novembre = "0"
    }if(decembre == undefined ){
      var decembre = "0"
    }
  }
  var detail_date = [janvier, fevrier, mars, avril, mai, juin, juillet, aout, septembre, octobre, novembre, decembre]
  }else{
    var detail_date = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  }

  const chartData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    datasets: [{
      label: 'Valeurs',
      data: detail_date,
      backgroundColor: [
        'rgb(184 218 255 / 33%)',
    ],
    borderColor: [
        '	rgba(25,46,78,1.000)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)'
    ],
      borderWidth: 1
    }]
  };
  
  const ctx = document.getElementById('myChart').getContext('2d');
  
  const myChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}


onClick('#more_detail_commercial', async function(){
  displayDetailAccounts()
})



async function displayDetailAccounts(){
  $('.popup_detail_account').css('display','block')
  $('.popup_detail_content').css( 'display', 'block')
  $('.popup_detail_content').html('')
  GV.end_commercil = ''
  GV.between_commercil =''
  let html = `
  <div class="cursor exit_popup" style="position: fixed; left: 215px; top: 0px; text-align: left;font-weight: 600; color: #0056ad; font-size: 25px;"><i class="fas fa-chevron-right exit" style="    padding: 20px;  background: #f4f6f8;border-radius: 50%;"></i></div>
  <div class="as-h6 tw-shorter-1-line padding5 d-flex gap-10 center p-b-8"><div class="padding15" style=" background-color:#162b4b; color: white; border-radius: 8px;     padding: 10px 15px;" >${GV.current_company.name.charAt(0)}</div> ${GV.current_company.name}</div>

  <div class="header_box_content d-flex ">
    <div class="selected_filter grid" style="grid-template-columns: 20px 1fr ;"> 
        <div class="blod text_color10  margin-auto"> Du</div>
        <input id="statistics_commercial_start" class="box_input" value="" type="date"  autocomplete="off">
    </div>
    <div class="selected_filter grid" style="grid-template-columns: 20px 1fr ;"> 
        <div class="blod text_color10  margin-auto"> Au</div>
        <input id="statistics_commercial_end" class="box_input " value="" type="date"  autocomplete="off">
    </div>   
  </div>
  <div class="as-label-3 tw-text-grey-base mb-1" style="text-align: left; padding: 35px 0px;">
    <span> Chiffre d'affaire par commercial</span>
  </div>
  <canvas id="myDiagrammeBox" class="" style="background: white;height: 510px !important;"></canvas>
  <div class="table grid padding_top15 scroll">
    <div class="as-label-3 tw-text-grey-base mb-1" style="text-align: left; padding: 35px 0px;">
      <span>Liste des commerciaux avec la prime appliquée sur le chiffre d'affaires qui ont réalisé </span>
    </div>
    <div id="table_header" class="line blod text_color1 grid colmn4 secondary_color1 ">
                      
      <div>Nom</div>
      <div>Chiffre d'affaires réalisé</div>
      <div>Pourcentage de prime</div>
      <div>Prime</div>
                                       
    </div>
    <div id="liste_accounts_bonues" class="secondary_color1 text_color1 scroll relative loading-placeholder shadow" style="max-height: 55vh;">
      
    </div>
  </div>

  `

  $('.popup_detail_content').html(html)

  CommercialDiagram()
  
  }
  $(document).on('change','#statistics_commercial_start', async function(){
    GV.between_commercil =$(this).val()
    CommercialDiagram()

  })
  
  $(document).on('change','#statistics_commercial_end', async function(){
    GV.end_commercil =$(this).val()
    CommercialDiagram()
  })

  function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}



  async function CommercialDiagram(){
    let arrayName = []
    let ArrayAccurancy = []
    let backgroundcolor =[]
    let borderClor = []
    $('#liste_accounts_bonues').html('')
    for(let id of Object.keys(GV.accounts)){ 
      let account = GV.accounts[id]
      var obj = account.wilaya
      GV.files = {}
      var data = []
      await load_items("files",{id_account: account.id , validation: '1' ,cancel_status: "0", id_profil: GV.current_company.id})
      for(let id of Object.keys(GV.files)){
        
        var file = GV.files[id]
        if( file.cancel_status != '0')continue;
        if ( moment(file.creation_date).format('YYYY-MM-DD') < GV.between_commercil && GV.between_commercil != "")continue;
        if ( moment(file.creation_date).format('YYYY-MM-DD') > GV.end_commercil && GV.end_commercil != "")continue;
  
        if(file.type == "Facture" ){
          var price = (file.total).replace(/,/g,'')
          var totalHt = parseFloat(price)
          data.push(totalHt);
        }if(file.type == "Facture_d_avoir"){
          let price = (file.total).replace(/,/g,'')
          let totalHt = parseFloat(price)
          data_avoir.push(totalHt);
        }else{
        }
      }
      const sumInvoice = data.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);  
      arrayName.push(`${account.first_name} ${account.last_name}`)
      ArrayAccurancy.push(sumInvoice)
      backgroundcolor.push('rgba(215, 230, 247, 1)')
      borderClor.push('rgba(0, 86, 173, 1)')
      let equation = (parseFloat(sumInvoice)*parseFloat(account.percentage_bonus))/100
      console.log(account.first_name, account.last_name,  account.percentage_bonus,sumInvoice )
      let html = `
      <div  class="grid colmn4 padding_top15 text_color1 cursor">
       
        <div class="bold text_color1">${account.first_name} ${account.last_name}</div>     
        <div class="bold text_color10">${separator(sumInvoice.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</div>  
        <div class="text_color10">${account.percentage_bonus} %</div>
        <div class="bold" style="  background: -webkit-linear-gradient(83.84deg, #0088FF -6.87%, #A033FF 26.54%, #FF5C87 58.58%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;">${separator(equation.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</div>
  
      </div> 
      `
      $('#liste_accounts_bonues').append(html)
  
    } 
    console.log(ArrayAccurancy, arrayName)
  const chartData = {
    labels: arrayName,
    datasets: [{
      label: 'Valeurs',
      data: ArrayAccurancy,
      backgroundColor: backgroundcolor,
      borderColor: borderClor,
      borderWidth: 1
    }]
  };


  const ctx = document.getElementById('myDiagrammeBox').getContext('2d');
  
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  }


// $(document).on('change','#stat_between', async function(){
//   GV.stat_between =$(this).val()
//   let id_account = $(this).data('id')
//   displayDetailStatAccount(id_account)

// })
// $(document).on('change','#stat_end', async function(){
//   GV.stat_end =$(this).val()
//   let id_account = $(this).data('id')
//   displayDetailStatAccount(id_account)

// })
 async function displayDetailStatAccount(id_account){

  await load_items("files", {id_account: id_account, validation: '1', cancel_status: "0", id_profil: GV.current_company.id })
  $('.popup_detail_account').css('display','block')
  
  $('.popup_detail_content').css( 'grid-template-rows', '1fr 1fr 1fr;')
  $('.popup_detail_content').html('')

  var data= []
  var data_devis= []
  var data_avoir= []
  for(let id of Object.keys(GV.files)){
      var file = GV.files[id]
      if ( moment(file.creation_date).format('YYYY-MM-DD') < GV.between && GV.between != "")continue;
      if ( moment(file.creation_date).format('YYYY-MM-DD') > GV.end && GV.end != "")continue;
   
    if(file.type == "Facture" && file.cancel_status == '0'){
      let price = (file.total).replace(/,/g,'')
      let totalHt = parseFloat(price)
      data.push(totalHt);
    }if(file.type == "Facture_proforma"){
      let price = (file.total).replace(/,/g,'')
      let totalHt = parseFloat(price)
      data_devis.push(totalHt);
    }if(file.type == "Facture_d_avoir"){
      let price = (file.total).replace(/,/g,'')
      let totalHt = parseFloat(price)
      data_avoir.push(totalHt);
    }else{
    }
  }
  const sumInvoice = data.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  const sumDavis = data_devis.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  const sumAvoir = data_avoir.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  let montant = (data.length / data_devis.length)*100
 let date = new Date()
  let html = `


              <div class="cursor exit_popup" style="position: fixed; left: 215px; top: 0px; text-align: left;font-weight: 600; color: #0056ad; font-size: 25px;"><i class="fas fa-chevron-right exit" style="    padding: 20px;  background: #f4f6f8;border-radius: 50%;"></i></div>
                        <div class="as-h6 tw-shorter-1-line padding5 d-flex gap-10 center p-b-8"><div class="padding15" style=" background-color:#162b4b; color: white; border-radius: 8px;     padding: 10px 15px;" >${GV.accounts[id_account].first_name.charAt(0)}</div> ${GV.accounts[id_account].first_name} ${GV.accounts[id_account].last_name}</div>

                <div class="grid colmn4 gap-10 " style="padding:20px;" >

                    <div class="grid colmn2 secondary_color1 box-info-account  gap-10" style="background-color: #0b1d30;">
                        <div class="d-flex" style="margin: auto; flex-direction: column;">
                            <div style="color: rgb(255, 255, 255);font-size: 10px;font-weight: 600;margin: 10% 0px; text-align: left;">Factures HT</div>
                            <div style="color: #ffffff;font-size: 30px;text-align: left;font-weight: 600;display: grid;margin: auto 0px;">${separator(sumInvoice.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} </div>
                            <div style="color: #159784; font-size: 13px; text-align: left; font-weight: 600;" >${data.length}</div>
                        </div>
                        <img src="/img/Capture4.JPG">
                    </div>
                    <div class="grid colmn2 secondary_color1 box-info-account  gap-10">
                        <div class="d-flex" style="margin: auto; flex-direction: column;">
                            <div style="color: rgb(165, 165, 165);font-size: 10px;font-weight: 600;margin: 10% 0px; text-align: left;">Factures profoma</div>
                            <div style="color: #3a4a5b;font-size: 30px;text-align: left;font-weight: 600;display: grid;margin: auto 0px;">${separator(sumDavis.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}</div>
                            <div style="color: rgb(95 187 6 / 83%); font-size: 13px; text-align: left; font-weight: 600;" >${data_devis.length}</div>
                        </div>
                        <img src="/img/Capture.JPG">
                    </div>
                    <div class="grid colmn2 secondary_color1 box-info-account  gap-10">
                        <div class="d-flex" style="margin: auto; flex-direction: column;">
                            <div style="color: rgb(165, 165, 165);font-size: 10px;font-weight: 600;margin: 10% 0px; text-align: left;">Taux de conversion</div>
                            <div style="color: #3a4a5b;font-size: 30px;text-align: left;font-weight: 600;display: grid;margin: auto 0px;">${montant.toFixed(2) == Infinity || montant.toFixed(2) == 'NaN' ? "0" : montant.toFixed(2) } %</div>
                            <div style="color: rgb(95 187 6 / 83%); font-size: 13px; text-align: left; font-weight: 600;" ></div>
                        </div>
                        <img src="/img/Capture2.JPG">
                    </div>
                    <div class="grid colmn2 secondary_color1 box-info-account  gap-10">
                        <div class="d-flex" style="margin: auto; flex-direction: column;">
                            <div style="color: rgb(165, 165, 165);font-size: 10px;font-weight: 600;margin: 10% 0px; text-align: left;">Factures d'avoir</div>
                            <div style="color: #3a4a5b;font-size: 30px;text-align: left;font-weight: 600;display: grid;margin: auto 0px;">${separator(sumAvoir.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} </div>
                            <div style="color: rgb(95 187 6 / 83%); font-size: 13px; text-align: left; font-weight: 600;" >${data_avoir.length}</div>
                        </div>
                        <img src="/img/Capture3.JPG">
                    </div>
                </div>
                <div class="grid" style="grid-template-columns: 1fr 0.5fr;">
                    <div id="myChartContainer">
                        <div class="tw-ml-2 text_left" style="color: rgb(37 56 94);font-family: Inter,sans-serif,Roboto,Helvetica,Arial,color-emoji;"> 
                            Nombre de clients par mois de <input id="stat_date" data-id="${id_account}" class="date_input" type="number" style="height: 15px;"  autocomplete="off" value="${date.getFullYear()}">
                        </div><br>
                        <canvas id="myChart"></canvas>
                    </div>
                      <div class="padding15">
                        <div id="titleCirclestat" class="as-label-3 tw-text-grey-base mb-1"><span></span></div><br>
                        <canvas id="circularChart"></canvas>
                      </div>  
                  
                </div>             
             
                <div style="padding: 20px;">
                    <div class="tw-ml-2 text_left box" style="color: rgb(37 56 94);font-family: Inter,sans-serif,Roboto,Helvetica,Arial,color-emoji; margin-top: 10px;"> 
                       Liste des factures et factures proforma générées  
                        <select id="filter_document" class="filter" type=text value="" placeholder="Toutes les entreprises" style="    padding: 5px;"> 
                          <option value="">Toutes les documents</option>
                          <option value="Facture">Facture</option>
                          <option value="Facture_proforma">Facture proforma</option>               
                        </select>
                    </div><br>
                    <div  class="line text_color1 grid colmn5 secondary_color1 text_left" style="padding: 20px 10px; font-size: 13px; font-weight: 600; border-top-left-radius: 5px; border-top-right-radius: 5px;">
                        
                        <div>Client</div>
                        <div>Document</div>
                        <div>N°</div>
                        <div>Montant HT</div>
                        <div>Montant TTC</div>
                                                         
                    </div>

                    <div id="Invoices_liste_accounte" class="secondary_color1 text_color1 scroll relative " style="max-height: 370px;" border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">
                        
                    </div>
                </div>
                <div style="display: grid; grid-template-rows:55px 1fr; border-radius: 5px ; padding:20px;">
                    <div class="tw-ml-2 text_left box" style="color: rgb(37 56 94);font-family: Inter,sans-serif,Roboto,Helvetica,Arial,color-emoji; margin-top: 10px;"> 
                        Nombre des factures et factures proforma générées pour chaque client
                    </div><br>
                    <div  class="line text_color1 grid secondary_color1 text_left" style="padding: 20px 10px; font-size: 13px; font-weight: 600; border-top-left-radius: 5px; border-top-right-radius: 5px; grid-template-columns: 1fr 0.5fr 0.5fr;">
                        <div>Client</div>
                        <div>NB factures</div>
                        <div>NB devis</div>                                                        
                    </div>
                    <div id="liste_client_commercial" class="secondary_color1 text_color1 scroll relative " style="max-height: 300px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">
                    
                    </div>
                </div>
  `
  $('.popup_detail_content').html(html)
  chartfunction(id_account)
  displayListeDocumentCommercial("")

  $('#liste_client_commercial').html('')
  
  const files = Object.values(GV.files)
  let res = groupElementBy(files, "id_folder")
  var clientArr = []
  var prospectArr = []
  for(let id of Object.keys(res)){
    let file = res[id]

    let resType = groupElementBy(file, "type")
    if(resType.Facture == undefined && resType.Facture_proforma == undefined )continue;
    let html = `
    <div  class=" grid padding_top15 text_color1 text_left cursor" style="padding: 10px;  font-weight: 600; grid-template-columns: 1fr 0.5fr 0.5fr;" >
     
      <div class=" text_color1">${GV.folders[id].name} </div>     
      <div class="text_color10">${resType.Facture == undefined ? "0" : resType.Facture.length}</div>  
      <div class=" text_color10">${resType.Facture_proforma == undefined ? "0" : resType.Facture_proforma.length}</div>

    </div> 
    
    `
    $('#liste_client_commercial').append(html)

    
  }
  for(let folder_id of Object.keys(GV.folders)){
    let folder = GV.folders[folder_id]
    if(folder.id_account != id_account)continue;
    console.log(folder)

    if(folder.category == "Prospect"){
      prospectArr.push(folder.name)
    }if(folder.category == "Client"){
      clientArr.push(folder.name)
    }else{
    }
  }
  displayCirculardata(clientArr, prospectArr)
}


function displayCirculardata(clientArr, prospectArr){
  // Récupérer les données dynamiques ici (par exemple à partir d'une API)
  let totalCircul = parseInt(prospectArr.length)+parseInt(clientArr.length)
  let prospect = (parseInt(prospectArr.length)*100)/parseInt(totalCircul)
  let client = (parseInt(clientArr.length)*100)/parseInt(totalCircul)
  let taux = (parseInt(clientArr.length)/parseInt(prospectArr.length))*100
  $('#titleCirclestat span').html(`Taux de conversion de prospect en client ${taux.toFixed(2) == Infinity ? "100": taux.toFixed(2) } %`)
  // console.log(arr, arrPaid, arrVersement)
  var data1 = prospect;
  var data2 = client;

  var ctx = document.getElementById('circularChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: [`Prospects ${prospectArr.length}` , `Clients ${clientArr.length}` ],
          datasets: [{
              data: [data1,data2],
              backgroundColor: [
                 'rgba(255, 99, 132, 0.2)',
                 'rgba(54, 162, 235, 0.2)',
             ],
             borderColor: [
                 'rgba(255, 99, 132, 1)',
                 'rgba(54, 162, 235, 1)',
             ],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false
      }
  });
}



$(document).on('change','#filter_clients', async function(){
  GV.category_company =$(this).val()
  displayFolders({category: GV.category_company}, '#crm_page')
})

$(document).on('change','#filter_document', async function(){
  let value =$(this).val()
  displayListeDocumentCommercial(value)
})

function displayListeDocumentCommercial(value){
  $('#Invoices_liste_accounte').html("")
  for(let id of Object.keys(GV.files)){
    let files_invoice = GV.files[id]
    if( files_invoice.validation != "1")continue; 
    if( files_invoice.cancel_status !="0")continue; 
    
    if(value == ""){
      var compare = ((files_invoice.type == "Facture") || (files_invoice.type == "Facture_proforma"))
    }else{
      var compare = files_invoice.type == value 
    }
    if(compare){
    
      console.log(files_invoice.type)
      var price = (files_invoice.total).replace(/,/g,'')
      var prixHT = parseFloat(price)
      var sum = 1+(parseFloat(files_invoice.tva)/100)
      var prixTTC = prixHT*sum

    let invoiceTable= `
    <div  class=" grid colmn5 padding_top15 text_color1 text_left cursor" style="padding: 10px;  font-weight: 600; " >
   
          <div class=" text_color1">${GV.folders[files_invoice.id_folder].name}</div>     
          <div class=" text_color10">${files_invoice.type.split('_').join(' ')}</div>  
          <div class=" text_color10">${files_invoice.file_number}</div>  
          <div class=" text_color10">${files_invoice.total.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</div>
          <div style="color:#73abab">${separator(prixTTC.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA </div>
                        
    </div> 
    `
    $('#Invoices_liste_accounte').append(invoiceTable)
    }
    
  }
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

//! ///////////////////////////////////////////////////////////
//! //////////////////!    fournisseur     //////////////////////////
//! ///////////////////////////////////////////////////////////


GV.initialize_page.fournisseur= async function(){
  searchBar(".table_items")
  displayPlaceholder()
  GV.folders = {}
  if(GV.ObjCurrentUser.manager == "0"){
    await load_items("folders",{id_profil: GV.current_company.id, id_account : GV.current_user, category : 'Fournisseur'})
  }else{
  await load_items("folders",{id_profil: GV.current_company.id,  category : 'Fournisseur'})}
  displayFolders({category: ""}, '#fournisseur_page')
  isManager()
  isAdministater()
  PlaceholderisEmpty('#fournisseur_page')
}
//! ///////////////////////////////////////////////////////////
//! //////////////////!    crm     //////////////////////////
//! ///////////////////////////////////////////////////////////


GV.initialize_page.crm= async function(){
  searchBar(".table_items")
  displayPlaceholder()
  GV.folders = {}
  if(GV.ObjCurrentUser.manager == "0"){
    await load_items("folders",{id_profil: GV.current_company.id, id_account : GV.current_user})
  }else{
  await load_items("folders",{id_profil: GV.current_company.id})}
  displayFolders({category: ""}, '#crm_page')
  isManager()
  isAdministater()
  PlaceholderisEmpty('#crm_page')
}

function displayFolders(filters, selector){

  $( `${selector} .list_folders`).html("")
  

  for(let id of Object.keys(GV.folders)){
    var folder=GV.folders[id]
    
    if(selector == '#crm_page' && folder.category == 'Fournisseur')continue
    var obj = folder.category
    if(!check_obj_filters(obj, filters))continue; 
    html = `
    <div class=" table_items padding_top15 text_color1  center">
    <div id="cercle" class="detail_folder" style="top: 10px !important; color:  #1780ea ;margin-left: 0px !important; font-size: larger;"  data-id="${folder.id}"><i class="fa-sharp fa-solid fa-angles-right"></i></div>
    <div class="grid colmn5" >

      <div class="blod text_color3 details" >${folder.name}</div>       
      <div class="blod text_color10 details" >${folder.activity_sector}</div>     
      <div class="blod text_color10 details" >${folder.category}</div>  
      <a src="${GV.url}/img/uploads/${folder.coordonnees_fiscal}#toolbar=0" href="${GV.url}/img/uploads/${folder.coordonnees_fiscal}#toolbar=0" target="_blank"><div class="blod text_color10">Ouvrir le PDF</div></a>
      <div >
        <div class="dropdown">
          <i class="fas fa-ellipsis-v dropbtn dropbtn_folder" data-id="${folder.id}" style="font-size: 20px;padding: 10px;"></i>
          <div id="myDropdown_folder_${folder.id}" class="dropdown-content">
          <div class="action" id="popup_list_operation"  data-id="${folder.id}"><i class="fa-solid fa-info light_grey padding5"></i>Liste des opérations</div>
          <div class="action manager_access" id="btn_edit_side_folder" data-id="${folder.id}"><i class="far fa-edit light_grey padding5" ></i>Modifier</div>
        </div>
      </div>
    </div>   
    </div>
    
    `

    $( `${selector} .list_folders`).prepend(html)
  } 

}

$(document).on('change','#filter_clients', async function(){
  GV.category_company =$(this).val()
  displayFolders({category: GV.category_company}, '#crm_page')
})



onClick('.search_box', async function () { 
  GV.type_file = ""
  GV.to_date = ""
  GV.in_date  = ""
  GV.word = ""
  if(GV.ObjCurrentUser.manager == "0"){
    await load_items("files",{validation: '1', id_profil : GV.current_company.id, id_account : GV.current_user})
  }else{
    await load_items("files",{validation: '1', id_profil : GV.current_company.id})
  }
  $('#overlay').css('display', 'block')
  $('#search_content').css('display', 'grid')
});

onClick('#overlay', async function () { 
  $('#search_content').css('display', 'none')

});




$(document).on('change','#filter_fils', function(){
  GV.type_file =$(this).val()
  displayResultFileSearching({category: GV.type_file})
})
$(document).on('change','#to_date', function(){
  GV.to_date =$(this).val()
  console.log(GV.to_date)
  displayResultFileSearching({category: GV.type_file})
})
$(document).on('change','#in_date', function(){
  GV.in_date =$(this).val()
  console.log(GV.in_date)
  displayResultFileSearching({category: GV.type_file})
})

$( "#search_file" ).keyup(function() {
  GV.word =$(this).val()
  displayResultFileSearching({category: GV.type_file})
});
GV.word_name_company =""
$( "#search_name" ).keyup(function() {
  GV.word_name_company =$(this).val()
  displayResultFileSearching({category: GV.type_file})
});


async function displayResultFileSearching(filters){
  $('#search_results').html(" ")
  let html = " "
  for(let id of Object.keys(GV.files)){
    
    var file=GV.files[id]
    
    if(file.validation != '1')continue;
    console.log(file.validation, )
    var obj = file.type
    var number = file.file_number
    console.log(file.id_folder, GV.folders)
    var company = GV.folders[file.id_folder].name.toLowerCase()
   
    if (!check_obj_filters(obj, filters))continue;
    if ((moment(file.creation_date).format('YYYY-MM-DD') < GV.in_date) && GV.in_date != "")continue;
    if ((moment(file.creation_date).format('YYYY-MM-DD') > GV.to_date) && GV.to_date != "")continue;
    if (number.toString().indexOf(GV.word) )continue; 
    if (!company.includes(GV.word_name_company.toLowerCase()))continue; 

    var date = moment(file.creation_date).format('DD MMMM YYYY h:mm:ss')
    html = `

      <div id="cercle" style="background-color: ${file.status == "Payée" && file.type == "Facture" ?'#4caf50' : ''} ${file.status == "Non payée" && file.type == "Facture" ?'#ff0000d1' : ''} ${file.status == "Versement" && file.type == "Facture" ?'gray' : ''}; top: 40px !important; margin-left: 35px !important; ${file.cancel_status == '1' ? 'background-color: #ffffff00 !important;' : ""}"></div>
        <div  class="table_items grid colmn6 padding_top15 text_color1 center" style=" background-color: #f8f7f7 ; margin-top: -10px">
        <div class="${file.cancel_status == '1' ? 'font-weight: 500 !important;' : "bold"} text_color3" >${file.cancel_status == '1' ? 'Facture annulée' : file.type.split('_').join(' ')}  :</div>     
        <div class="blod text_color10" style="${file.cancel_status == '1' ? 'text-decoration: line-through;' : ""}"> N° ${file.file_number}</div>
        <div class=" text_color10">Le ${date}</div>
        <div class="blod text_color10">Par : ${file.created_by}</div>
        <div class="blod text_color10">${file.total} DA</div>
        <div>
        <div class="dropdown">
          <i class="fas fa-ellipsis-v dropbtn dropbtn_operation" data-id="${file.id}" style="font-size: 20px;padding: 10px;    z-index: 500!important;"></i>
          <div id="myDropdown_operation_${file.id}" class="dropdown-content">
          <div class="action" id="print_crm_file" data-id="${file.id}"><i class="fa-solid fa-print light_grey padding5"></i>Imprimer</div>
          <div class="action" id="download_crm_file" data-id="${file.id}"><i class="fa-solid fa-download light_grey padding5"></i>Télécharger</div>
          <div class="action" id="send_mail_document" style="display: ${file.cancel_status == '1' || file.imported == '1'? 'none !important' : ""}" data-id="${file.id}"><i class="fas fa-sign-out-alt  light_grey padding5"></i>Envoyer mail</div>
        </div>
      </div>

      </div>


    `
    $('#search_results').append(html)


  }
}


onClick('#popup_list_operation', async function () { 

  $('#overlay').css('display', 'block')
  $('.modal-dialog_details').css('display', 'block')
  $('.modal_details').css('display', 'block')
  var id = $(this).data('id')
  GV.id_folder_detail= id
  displayListeOperation(id)
});
onClick('#back_operation', async function () { 

  var id = $(this).data('id')
  displayListeOperation(id)
});

onClick('#detail_operation', async function () { 
  var id =  $(this).data('id')
  var id_client =  $(this).data('client')
  displayListFiles(id, id_client)
});


async function displayListFiles(id, id_client){
  GV.files = {}
  GV.payment = {}
  var id_operation = id
   await load_items("files",{id_operation: id_operation})  


   $('.modal-dialog_details').html("")
   $('.modal-body_details_content').html("")
   html=
    `
       <div class="modal-content_details exposant_page">
           <div class="modal-header_details">
           <div id="back_operation" data-id="${id_client}"><i class="fa-solid fa-angle-left " style='color: rgb(165 165 165) !important;'></i></div>
           <div id="importe_bon_de_commade" data-id="${id_client}" data-operation="${id}" class="button text_center cursor bold " style=" font-size: 15px;color: #0075eb; border: 1px solid #0075eb; padding: 15px 35px;">Importer un bon de commande</div>
           <div id="" class="exit"><i class="fa fa-times exit" style='color: rgb(165 165 165) !important;'></i></div>
           </div>
 
           <div class="modal-body_details">
 
              <div class="modal-body_details_content">
 
               </div>
 
           </div>
       </div>`
   $('.modal-dialog_details').html(html)
   html_header = `
   <div id="table_header" class="line blod text_color1 grid colmn7" style="padding-bottom: 20px;">
     <div>Document </div>
     <div>Numéro du document</div>                                                        
     <div>Date de création</div>                       
     <div>Nom du créateur</div>                       
     <div>Prix TTC / DA</div>                       
     <div>Reste / DA</div>                       
     <div></div>                       
   </div>
 `
   for(let id_file of Object.keys(GV.files)){   
    
      GV.payment = {}
     var file = GV.files[id_file]
  
     await load_items("payment", {id_file : file.id})
     $('#side_menu').html("")
     let values = totalFildeValue(file.id)

     var date = moment(file.creation_date).format('DD MMMM YYYY h:mm:ss')
     var price = (file.total).replace(/,/g,'')
     var prixHT = parseFloat(price)
     var sum = 1+(parseFloat(file.tva)/100)
     var prixTTC = prixHT*sum
      html_content = `
    
     <div id="cercle" style="background-color: ${file.status == "Payée" && file.type == "Facture" ?'#4caf50' : ''} ${file.status == "Non payée" && file.type == "Facture" ?'#ff0000d1' : ''} ${file.status == "Versement" && file.type == "Facture" ?'gray' : ''}; top: 40px !important; margin-left: 35px !important; ${file.cancel_status == '1' ? 'background-color: #ffffff00 !important;' : ""}"></div>
     <div  class="table_items grid colmn7 padding_top15 text_color1 center">
      <div class="${file.cancel_status == '1' ? 'font-weight: 500 !important;' : "bold"} text_color3" >${file.cancel_status == '1' ? 'Facture annulée' : file.type.split('_').join(' ')}  :</div>     
      <div class="blod text_color10" style="${file.cancel_status == '1' ? 'text-decoration: line-through;' : ""}"> ${file.validation == '1' ? `N° ${file.file_number}`: 'En attente de confirmation' } </div>
      <div class=" text_color10">Le ${date}</div>
      <div class="blod text_color10">Par : ${file.created_by}</div>
      <div class="blod text_color10">${separator(prixTTC.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} </div>
      <div class="blod text_color10">${file.type == "Facture" ? separator(values.rest_price).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';}) : '/'}</div>
      <div>
      <div class="dropdown" >
          <i class="fas fa-ellipsis-v dropbtn dropbtn_file" data-id="${file.id}" style="font-size: 20px;padding: 10px;    z-index: 500!important;  ${file.validation == '1' ? "": 'color: #80808052 !important' }"></i>
          <div id="myDropdown_file_${file.id}" class="dropdown-content" style=" ${file.validation == '1' ? "": 'display: none !important' }" >
          <div class="action" id="print_crm_file" data-id="${file.id}"><i class="fa-solid fa-print light_grey padding5"></i>Imprimer</div>
          <div class="action" id="download_crm_file" data-id="${file.id}"><i class="fa-solid fa-download light_grey padding5"></i>Télécharger</div>
          <div class="action" id="update_invoice_document" data-client=${id_client} data-idparam=${id}  style="display: ${ file.type != "Facture_proforma" || file.invoice == '1' ? 'none !important' : ""}" data-id="${file.id}"><i class="fas fa-edit light_grey padding5"></i>Transformer facture</div>
          <div class="action " id="edit_facture_status" data-operateur="${id_operation}" data-client="${id_client}" data-id="${file.id}" style="display:${file.type == "Facture" && file.status != 'Payée' ? `${file.cancel_status == '1'  ? 'none !important' : "block"}`: "none !important" }"><i class="far fa-edit light_grey  light_grey padding5"></i>Modifier le paiement</div>
          <div class="action " id="liste_payment"style="display: ${file.cancel_status == '1' ||  file.type != "Facture" ? 'none !important' : ""}"   data-id="${file.id}" style="display:${file.type == "Facture" ? "block" : "none !important" }"><i class="fa-sharp fa-solid fa-list light_grey  light_grey padding5"></i>Liste des paiements</div>
          <div class="action" id="send_mail_document" style="display: ${file.cancel_status == '1' || file.imported == '1'? 'none !important' : ""}" data-id="${file.id}"><i class="fas fa-sign-out-alt  light_grey padding5"></i>Envoyer mail</div>
          <div class="action admin_access " id="cancel_file" style="display: ${file.cancel_status == '1'||  file.type != "Facture"  ? 'none !important' : ""}" data-client=${id_client} data-idparam=${id}  data-id="${file.id}"><i class="fas fa-edit light_grey padding5"></i>Annuler</div>
      </div>
    </div>
 
     </div>
 
 
     `
 
   $('.modal-body_details_content').prepend(html_content)
   }
 
 
   $('.modal-body_details_content').prepend(html_header)
 }
 
 onClick('.dropbtn_file', function () {
  let id= $(this).data("id")
  $('.dropdown-content').removeClass('show')
  document.getElementById(`myDropdown_file_${id}`).classList.toggle("show"); 
});

onClick('#importe_bon_de_commade', function(){
  $('#overlay').css('display', 'grid')
  $('#overlayTop').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  var id_folder = $(this).data('id')
  var id_operation = $(this).data('operation')
  displaySideBonDeCommande(id_folder, id_operation)
})


function displaySideBonDeCommande(id_folder, id_operation){

  
  $('#side_menu').html("")

 
  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit_side"><i class="fas fa-chevron-left exit_side"></i></div>
            <div class="title">Importer un bon de commmande</div>
        </div>

        <div id="form_bon_de_commande" class="body_side_menu">
          <div class="form_container">

             
              <div class="input-container">
                <div class="label">Numéro du bon de commande*</div>
                <input class="content_editable required" type="text" data-id="file_number" contenteditable="true" value=""></input>
              </div>
              <div class="input-container">
                <div class="label">Total HT*</div>
                <input id="total_file_bon" class="content_editable required" type="number" data-id="total" contenteditable="true" value=""></input>
              </div>  
              <div class="input-container m-t-20 validatedImageFile" style="margin-bottom : 10px" >
                <div class="label">Bon de commande format (PDF) * </div>
                <input class="content_editable link_media" type="file" id="validatedImageFile" value=""></input>

                <div class="progress" style="position: relative ;  height : 7px ;">
                    <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
                    <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
                </div>
              
              </div>

              <div class="input-container">
                <input type="hidden" data-id="type" contenteditable="true" value="Bon_de_commande"></input>
              </div>
             
              <div class="input-container">
                <input type="hidden" data-id="id_folder" contenteditable="true" value="${id_folder}"></input>
              </div>
              <div class="input-container">
                <input type="hidden" data-id="id_operation" contenteditable="true" value="${id_operation}"></input>
              </div>

          </div>
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="add_bon_de_commande" data-operation="${id_operation}" data-folder="${id_folder}" class="btn button text_color3 cursor text_center submitBtn" >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
}


onClick('#add_bon_de_commande', async function () { 
  if(GV.networkStatus==0)return;
  if (!check_form("#form_bon_de_commande")) {
    return;
  }
  let id_operation = $(this).data('operation')
  let id_client = $(this).data('folder')
  await add("files", "#form_bon_de_commande", GV.files)
  $('#overlayTop').css('display', 'none')
  $('#side_menu').css('display', 'none')
  $('.popup').css('display', 'none')
  displayListFiles(id_operation, id_client)

});


onClick('#update_invoice_document', async function () {

  
  let id= $(this).data("id")
  var client = $(this).data('client')
  var idparam = $(this).data('idparam')
  
  if((GV.folders[client].nif == null || GV.folders[client].nif == '') || (GV.folders[client].rc == null || GV.folders[client].rc == '') || (GV.folders[client].nis == null || GV.folders[client].nis == '') || (GV.folders[client].ai ==null || GV.folders[client].ai == '' ) || (GV.folders[client].email == null || GV.folders[client].email == '') ){
    $('.popup_alert').css('display', 'block')        
    $('.popup_alert .btn-outline-success').css('display', 'none')        
    $('.message_alert').html(`Avant de convertir cette facture profoma en facture (prospect en cient) veuiller insérer toutes les informations du client <br> <div class="btn btn-outline-success cursor margin_top10 brder" style="border-top: 1px solid #afb6be; border-radius: 5px;font-weight: 600; color: #1b2045;" id="btn_edit_side_folder" data-id="${client}"> Rensegner les informations </div>'`)        
   
  }else{
    if(GV.folders[client].category == "Prospect"){
      await update(client,"folders", "update_folder", GV.folders) 
    }else{

    }
    $('#overlayTop').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
  
    displaySideDetailInvoice(id, client , idparam)
    // $('.waiting-popup').css('display', 'grid')
    // await GenerateInvoiceFile(id, client, idparam)
    // $('.popup').css('display','none');  
  }

});
onClick('#btn_validate_invoice_info', async function () {

  
  
    $('#overlayTop').css('display', 'none')
    $('#side_menu').css('display', 'none')
    let data_issue = $('#date_issue_invoice').val()
    let description = $('#form_invoice_information .ql-editor').html()
    let payment_deadline_invoice = $('#payment_deadline_invoice').val()
    let number_bon = $('#number_bon').val()
    let obj = {
      data_issue: data_issue,
      description: description,
      payment_deadline : payment_deadline_invoice, 
      number_bon : number_bon
    }
    let id= $(this).data("id")
    var client = $(this).data('client')
    var idparam = $(this).data('idparam')

    $('.waiting-popup').css('display', 'grid')
    await GenerateInvoiceFile(id, client, idparam, obj)
    $('.popup').css('display','none');  

});



function displaySideDetailInvoice(id, id_client , id_param){

  var file = GV.files[id]
  $('#side_menu').html("")
  let date_issue = new Date();
  let payment_deadline = addMonths(1, new Date()) 
  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit_side"><i class="fas fa-chevron-left exit_side"></i></div>
            <div class="title">Ajuster les informations pour la facture</div>
        </div>

        <div id="form_invoice_information" class="body_side_menu">
          <div class="form_container">

          
              
              <div class="input-container">
                <div class="label">Date d'émission </div>
                <input id="date_issue_invoice" class="content_editable required" type="date" data-id="date_issue" contenteditable="true" value="${date_issue}"></input>
              </div>
              
              <div class="input-container">
                <div class="label">Numéro de bon de commande </div>
                <input id="number_bon" class="content_editable required" type="text" data-id="number_bon" contenteditable="true" ></input>
              </div>
              <div>
                <div class="facturation_label">
                  <div class="label">Notes complémentaires</div>
                  <div id="description" class="description_file content_editable" style="margin: 0px !important;">
                      ${file.description}
                  </div>
                </div>
              </div>
             
              <div class="input-container">
                <div class="label">Délai de paiement </div>
                <div class="grid colmn2" style=" gap: 10px">

                  <div class="input-container">
                    <input id="payment_deadline_invoice" class="content_editable required payment_deadline" type="date" data-id="payment_deadline" contenteditable="true" value="${payment_deadline}"></input>
                  </div>
                  <div class="input-container">
                    <select id="deadline_time_invoice" type="text" class="content_editable" > 
                        <option value="1">Un mois</option>
                        <option value="2">Deux mois</option>                        
                        <option value="3">Trois mois</option>                        
                        <option value="4">Quatre mois</option>                        
                        <option value="5">Cinq mois</option>                        
                        <option value="6">Six mois</option>                        
                        <option value="7">Sept mois</option>                        
                        <option value="8">Huit mois</option>                        
                        <option value="9">Neuf mois</option>                        
                        <option value="10">dix mois</option>                        
                        <option value="11">Onze mois</option>                        
                        <option value="12">Douze mois</option>                        
                        <option value="0">Spécifier le délai de la date</option>                        
                    </select>
                  </div>   

                </div>
              </div>
            
          </div>
          <div id="error"></div>
        </div>
        </div>

        <div>
          <div class="footer_side_menu">
              <div class="buttons_container cursor ">
                <div id="btn_validate_invoice_info" data-id="${id}" data-client=${id_client} data-idparam=${id_param} class="btn button text_color3 cursor text_center submitBtn" >Valider</div>
              </div>
          </div>
        </div>
      

          `
    $('#side_menu').html(html)
    document.getElementById('date_issue_invoice').valueAsDate = new Date();
    document.getElementById('payment_deadline_invoice').valueAsDate = addMonths(1, new Date()) 
    $('#payment_deadline_invoice').prop( "disabled", true );
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],    
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],  
      [{ 'align': [] }],
      ['clean']                             
      ];
      var quill = new Quill('#description', {
      modules: {
          toolbar: toolbarOptions
      },
      theme: 'snow'
      });
}

$(document).on('change','#deadline_time_invoice', async function(){
  let val = $(this).val()
  if(val == '0'){
    $('#payment_deadline_invoice').prop( "disabled", false );
  }else{
    $('#payment_deadline_invoice').prop( "disabled", true );
    document.getElementById('payment_deadline_invoice').valueAsDate = addMonths(val, new Date()) 
  }
})



async function GenerateInvoiceFile(id, client, idparam, obj){ 

  var options = {
    type: "POST",
    url: `/GenerateInvoiceFile`,
    cache: false,
    data:{id, obj},
  };
  var received_data = await $.ajax(options);

  if (received_data.ok) {

      var data_id =  received_data.data     
      var type = "Facture"

      await displayFinalFile(data_id,`http`, "mail")    
      await displayListFiles(idparam, client)

      $('.waiting-popup').css('display', 'none')
      await generatFile(data_id, type)

      // $('.popup').css('display','block');
      // $('.message').html('Facture envoyée avec succès')

  }else{
    $('.popup').css('display','block');
      $('.message').html('Facture non envoyée un problème est survenu')
  }
  
  }

 onClick('#cancel_file', async function () { 
  if(GV.networkStatus==0)return;
  var client = $(this).data('client')
  var idparam = $(this).data('idparam')
  var id = $(this).data('id')

  await update(id,"files", "", GV.files) 
  $('.popup').css('display','none');
  await displayListFiles(idparam, client)


});




onClick('#edit_facture_status', async function () { 
    var id = $(this).data('id')
    $('#overlayTop').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
  
    var operateur= $(this).data('operateur')
    var client= $(this).data('client')

    displaySideFacturation(id, operateur, client)
});

onClick('#liste_payment', async function () { 
    var id = $(this).data('id')
    $('#overlayTop').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
  
    GV.payment = {}
    await load_items('payment', {id_file : id})
    displaySideListPayment(id)
});


function displaySideListPayment(id_file){

  $('#side_menu').html("")

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit_side"><i class="fas fa-chevron-left exit_side"></i></div>
            <div class="title">Liste des paiements</div>
        </div>

        <div id="form_files" class="body_side_menu">
          <div class="as-h6 tw-shorter-1-line padding5 d-flex gap-10 center p-b-8"><div class="padding15" style=" background-color:#162b4b; color: white; border-radius: 8px;     padding: 10px 15px;" >${GV.folders[GV.files[id_file].id_folder].name.charAt(0)}</div> ${GV.folders[GV.files[id_file].id_folder].name}</div>

          <div class="form_container">
            <div id="table_header" class="line blod text_color1 " style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 30px 0px">
                <div>Moyen de paiement</div>
                <div>Numéro</div>
                <div>Banque</div>                        
                <div>Montant versé</div>                     
            </div>
            <div id="list_payment">

            </div>
          </div>          
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="close_payment_side" class="btn button text_color3 cursor text_center submitBtn " >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
    for(let id of Object.keys(GV.payment)){
      var payment = GV.payment[id]
      htmlList = `
      <div class="table_items padding_top15 text_color1  center relative"  style="  color: #5c6a7a; font-weight: 600; display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 10px 0px">
        <div> ${payment.type_paiment}</div>     
        <div>${payment.number_paiment == "" ? '/' : payment.number_paiment}</div>     
        <div>${payment.banc == "" ? '/' : payment.banc}</div>   
        <div>${separator(parseFloat(payment.total_payment).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}   DA</div>   
        <div> 
      </div> 
      `
      $('#list_payment').append(htmlList)

    }

}

onClick('#close_payment_side', async function () { 

  $('#overlayTop').css('display','none');
  $('.popup').css('display','none');
  $('#side_menu').css('display', 'none')

});


async function displaySideFacturation(id, operateur, client){

  var file = GV.files[id]

  GV.payment = {}
  await load_items("payment", {id_file : id})
  $('#side_menu').html("")
  let totalValue = totalFildeValue(file.id)
  let html=`
        
  <div class="header_side_menu">
  <div id="skip_btn" class="exit_side"><i class="fas fa-chevron-left exit_side"></i></div>
  <div class="title">Modifier l'état de paiement</div>
  </div>

  <div class="body_side_menu">
  <div class="form_container">            

    <div id="info_paiement" >
        <div id="form_files" >
        <div class="as-h6 tw-shorter-1-line padding5 d-flex gap-10 center p-b-8"><div class="padding15" style=" background-color:#162b4b; color: white; border-radius: 8px;     padding: 10px 15px;" >${GV.folders[file.id_folder].name.charAt(0)}</div> ${GV.folders[file.id_folder].name}</div>

            <div class="input-container">
              <div class="label">Etat du paiement de la facture*</div>
              <select class="content_editable required status_facture"  data-id="status" contenteditable="true">
                <option value="${file.status}">${file.status}</option>
                ${Object.keys(GV.payment).length == 0 ? '<option value="Non payée">Non payée</option>' : ''}
                ${file.status == 'Payée' ? '' :'<option value="Versement">Versement</option>' }
                <option value="Payée">Payée</option>
              </select> 
            </div>

              <div class="input-container info_paiement form_end" style="display: ${file.status == "Payée" || file.status == "Versement" ? "grid":"none"}" >
                <div class="label">Moyen de paiement de la facture*</div>
                <select class="content_editable required type_paiement"  data-id="type_paiment" contenteditable="true">
                  <option value="${file.type_paiment == null || file.type_paiment == 'null' ? "" : file.type_paiment}">${file.type_paiment == null || file.type_paiment == 'null' ? " " : `${file.type_paiment}` }</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Virement banquère">Virement banquère</option>
                </select> 
              </div>

              <div class="input-container banc_paiement form_end info_paiement" style="display: ${file.status == "Payée" || file.status == "Versement" ? "grid":"none"}" >
                <div class="label">Banque*</div>
                <select class="content_editable required "  data-id="banc" contenteditable="true">
                  <option value="${file.banc == null || file.banc == 'null' ? "" : file.banc }">${file.banc == null || file.banc == 'null' ? "" : file.banc }</option>
                  <option value="Arab Bank PLC Algeria">Arab Bank PLC Algeria</option>
                  <option value="BEA">BEA</option>
                  <option value="BNA">BNA</option>
                  <option value="AGB">AGB</option>
                  <option value="BNP">BNP</option>
                  <option value="BDL">BDL</option>
                  <option value="CPA">CPA</option>
                  <option value="BDL">BDL</option>
                  <option value="BADR">BADR</option>
                  <option value="Cnep Banque">Cnep Banque</option>
                  <option value="AL BARAKA">AL BARAKA</option>
                  <option value="CITIBANK">CITIBANK</option>
                  <option value="Société Générale Algérie">Société Générale Algérie</option>
                  <option value="TRUST BANK Algeria">TRUST BANK Algeria</option>
                  <option value="Housing Bank">Housing Bank</option>
                  <option value="Fransabank Al-Djazair">Fransabank Al-Djazair</option>
                  <option value="Crédit Agricole Corporate Et Investissement Bank Algérie">Crédit Agricole Corporate Et Investissement Bank Algérie</option>
                  <option value="HSBC Algeria">HSBC Algeria</option>
                  <option value="Al salam Bank Algeria">Al salam Bank Algeria</option>
                  <option value="Autre">Autre</option>
                </select> 
              </div>

                <div class="input-container form_end info_paiement number_paiement " style="display: ${file.status == "Payée" || file.status == "Versement" ? `${file.type_paiment != "Espèces" ? "grid":"none"}` :"none"}">
                <div class="label">Numéro *</div>
                 <input class="content_editable required" type="text" data-id="number_paiment" contenteditable="true" value="${file.number_paiment == null || file.number_paiment == 'null'? "" : file.number_paiment }"></input>
                 </div>
                </div>
                
                <div class="input-container form_end prix_versement " style="display: ${file.status == "Payée" || file.status == "Versement" ? "grid":"none"}">
                <div class="label">Montant *</div>
                <input id="total_payment"  class="content_editable required" type="number" data-id="total_payment" contenteditable="true" value="${file.status == 'Payée'? totalValue.rest_price : (file.status == 'Versement'? totalValue.rest_price : (file.status == 'Non payée'? totalValue.rest_price : '')) }"></input>
                </div>
                
                <input class="content_editable required" type="hidden" data-id="id_file" contenteditable="true" value="${id}"></input>


                

    </div>

  <div id="error"></div>
</div>
</div>

<div class="footer_side_menu">
<div class="buttons_container cursor ">
  <div id="edit_status_facturation" data-id="${id}" data-rest="${totalValue.rest_price}" data-sum="${totalValue.sum_versement}" data-operateur="${operateur}" data-client="${client}" class="btn button text_color3 cursor text_center submitBtn " >Valider</div>
</div>
</div>

          `
    $('#side_menu').html(html)

    $(document).on('change','.status_facture', async function(){
      $('#info_paiement #total_payment').val('')
      $('#info_paiement #total_payment').val(totalValue.rest_price)
     
  })
}
 function totalFildeValue(id){
  let file = GV.files[id]

  var price = (file.total).replace(/,/g,'')
  var prixHT = parseFloat(price)
  var sum = 1+(parseFloat(file.tva)/100)
  var prixTTC = prixHT*sum

  let array = []
  for(let id_payment of Object.keys(GV.payment)){
    let total = parseFloat(GV.payment[id_payment].total_payment)
    array.push(total) 
  }
  if(array.length != '0'){
    var sum_versement = array.reduce(function(a, b){
      return a + b;
   })}else{
    var sum_versement = 0
  } 
 
  
  let rest_price = parseFloat(prixTTC).toFixed(2) - (sum_versement).toFixed(2); 
  let obj= {
    sum_versement : sum_versement.toFixed(2) ,
    rest_price: rest_price.toFixed(2)
  }
  console.log(obj , parseFloat(prixTTC).toFixed(2),  separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';}), prixTTC)
  return obj

}


$(document).on('change','.status_facture', async function(){
  var status = $(".status_facture").val()
  console.log(status)
  if(status == "Payée" || status == "Versement"){
    
    $(".info_paiement").addClass('show').removeClass('hide').css('display', 'grid')
    $(".prix_versement").addClass('show').removeClass('hide').css('display', 'grid')
    console.log('ok cest un versemnet ou payée')
  }else{
    $(".info_paiement").addClass('hide').removeClass('show').css('display', 'none')
    $(".prix_versement").addClass('hide').removeClass('show').css('display', 'none')

  }if($('.type_paiement').val()== 'Espèces'){
    
    $(".number_paiement").addClass("hide").removeClass("show")  
    $(".banc_paiement").addClass("hide").removeClass("show")  
    $(".banc_paiement select").removeClass("required")
    $(".number_paiement input").removeClass("required")
  }

})

$(document).on('change','.type_paiement', async function(){
  var type = $(this).val()
  if(type == "Espèces"){
    $(".number_paiement").addClass("hide").removeClass("show")  
    $(".banc_paiement").addClass("hide").removeClass("show")  
    $(".banc_paiement select").removeClass("required")
    $(".number_paiement input").removeClass("required")

  }else{
    $(".number_paiement").removeClass("hide") 
    $(".banc_paiement").removeClass("hide")
    $(".banc_paiement select").addClass("required")
    $(".number_paiement input").addClass("required")
  }
})

onClick('#edit_status_facturation', async function () { 
  if(GV.networkStatus==0)return;

  var id = $(this).data('id')  
  var operateur= $(this).data('operateur')
  var client= $(this).data('client')
  var sum = $(this).data('sum')
  var rest = parseFloat($(this).data('rest'))
  var status = $('.status_facture').val()
  var price = parseFloat($('#total_payment').val())

  console.log(price , sum, rest)

  if(price > rest){
    $('#error').html('Le montant inséré est plus grand que le total de cette facture')
    return
  }else{
    if(status== 'Payée' && rest != price){
      $('#error').html("Veuillez changer l'état de paiement et mettre versement car le montant de la facture n'a pas était payé totalement")
      return
    }if(status== 'Versement' && rest == price){
      $('#error').html("Veuillez changer l'état de paiement et mettre payée car le montant de la facture a était payé totalement")
      return
    }else{

    }
  }

  if($('.status_facture').val() != "Non payée" ){
   if (!check_form("#info_paiement")) {
    return;
  } 
    GV.payment = {}
    await add("payment", "#info_paiement", GV.payment)
  }else{}

  await update(id,"files", "#form_files", GV.files) 

  displayListFiles(operateur, client)
  $('#overlayTop').css('display','none');
  $('.popup').css('display','none');
  $('#side_menu').css('display', 'none')

});

onClick('#send_mail_document',async function () {
  let id= $(this).data("id")
  var file = GV.files[id] 
  var email = GV.folders[file.id_folder].email
  var user = GV.ObjCurrentUser.email
  var type =file.type.split('_').join(' ')
  console.log(pdf, email, type)
  
  if(file.type == 'Facture_proforma'){
    var pdf = file.pdf_version_devis
  }else{
    var pdf = file.pdf_version
  }

 
  await sendMailDocument(email, type, pdf, user)
  
  $('.popup2').css('display','block');
  $('.message').html('Envoyé(e) avec succès')
  
 
});
onClick('#send_file_mail',async function () {
  let id= $(this).data("id")
  await load_items( 'files', {id : id})
  
  var file = GV.files[id] 
  var email = GV.folders[file.id_folder].email
  let user = GV.ObjCurrentUser.email
     if(file.type == "Facture_proforma"){
        var pdf = file.pdf_version_devis
      }else{    
      var pdf = file.pdf_version
      }
  console.log(pdf)
  var type =file.type.split('_').join(' ')
  
  await sendMailDocument(email, type, pdf, user)
  
  $('.popup2').css('display','block');
  $('#overlayTop').css('display','block');
  $('.message').html('Evnoyé avec succès')
  $('#side_menu_add_container').css('display','none');
 
});



async function sendMailDocument(email, type, pdf, user){
console.log('test')
  var options = {
    type: "POST",
    url: `/sendmydocument`,
    cache: false,
    data:{email, type, pdf, user},
  };   
  
     console.log('shit')
  var received_data = await $.ajax(options);
      console.log('test')
  if (received_data.ok) {
      console.log('ok')
   
      
  }

  
  }


onClick('#download_crm_file',async function () {
  let id= $(this).data("id")

  if(GV.files[id].imported == "1" ){
    window.open(`${GV.url}/img/uploads/${GV.files[id].pdf_version}`);
  }else{
  await displayFinalFile(id,`https`, "download") 
  await ExportPdf(GV.files[id].type)
  }
});

onClick('#print_crm_file', async function () { 
  let id= $(this).data("id")
  if(GV.files[id].imported == "1" ){
    window.open(`${GV.url}/img/uploads/${GV.files[id].pdf_version}`);
  }else{
    
  // await displayFinalFile(id,`https`)
  await displayFinalFile(id,`http`, 'print')
  await printJS({ printable: 'pdf', type: 'html',  css: 'css/admin.css',  css: 'css/general_style.css', targetStyles:['*'],
  style: `

.pdfnone{display: none;}
.clearfix:after { content: ""; display: table;clear: both;}
a {color: #0087C3; text-decoration: none;}
.header_pdf {padding: 10px 0; margin-bottom: 20px;} 
#logo { float: right;margin-top: 8px;} 
#logo img { height: 85px;}
#company {float: left; text-align: left;   border-left: 2px solid #c0c0c0;  padding-left: 10px; font-size: 9px;
} 
#details {margin-bottom: 20px;} 
#client { padding-left: 6px; float: right; font-size: 9px;
} 
#client .to { color: #777777;} 
h2.name {font-size: 1.4em; font-weight: normal;margin: 0;} 
#invoice { float: left;text-align: left;  }
#invoice h1 {color: #0087C3;font-size: 2.4em; line-height: 1em;font-weight: normal; margin: 0  0 10px 0;} 
#invoice .date {font-size: 1.1em;color: #777777;}
.table-pdf { width: 100%;border-collapse: collapse;border-spacing: 0; margin-bottom: 20px;} 
.table-pdf th, .table-pdf td {padding: 5px;border-bottom: 1px solid #cecece;; }
.table-pdf th { white-space: nowrap;font-weight: normal; }

.table-pdf td {  text-align: left; } 
.table-pdf td h3{color: #1c1c2b;font-size: 1.2em;font-weight: normal;margin: 0 0 0.2em 0;} 
.table-pdf .no {color: #FFFFFF;font-size: 1.6em;  background: #1c1c2b;}
.table-pdf .desc { text-align: left; }
.table-pdf .unit { }
th, td {
  border-style: solid 1px #DDD;
}
.table-pdf .total { color: #272727;font-weight: 600 }

.table-pdf td.unit,
.table-pdf td.qty,
.table-pdf td.total { font-size: 12.5px; }

.table-pdf tbody tr:last-child td { }

.table-pdf tfoot td { padding: 10px; background: #FFFFFF; border-bottom: none;font-size: 10px; white-space: nowrap; border-top: 1px solid #AAAAAA; }
.table-pdf tfoot tr:first-child td {border-top: none; }

.table-pdf tfoot tr:last-child td {color: #1c1c2b;font-size: 12px;font-weight: 600;border-top: 1px solid #1c1c2b;    width: 100% !important;
}

.table-pdf tfoot tr td:first-child {border: none;}

#thanks{ }


#notices{padding-left: 6px;border-left: 6px solid #0087C3;}

#notices .notice {font-size: 1.2em;}

.footer_pdf { color: #777777;width: 100%;height: 30px; position: absolute; bottom: 0; border-top: 1px solid #AAAAAA; padding: 8px 0; text-align: center; }

.invoice-head td { padding: 0 8px;}
.invoice_container {padding:20px;
font-size: 15px !important
}
.label_container { padding:10px;border:5px solid black;border-radius: 5px; height: 15cm; width: 10cm;display: grid; grid-template-rows: 130px 1fr;  margin-top:20px
}
.invoice-body{  background-color:transparent;}
.invoice-thank{ margin-top: 60px; padding: 5px;}
th, td {
  border-style: solid;
}
.address{ margin-top:15px;}`})
  }

})

async function displayFinalFile(id,protocol, selector){

  await load_items('folders', {})
  await load_items('files', {id : id})

  var file = GV.files[id]
  $('.pdf').html('')
  var price = (file.total).replace(/,/g,'')

  var prixHT = parseFloat(price)
  var sum = 1+(parseFloat(file.tva)/100)
  var prixTTC = prixHT*sum
  var decimalPart = prixTTC - parseInt(prixTTC);
  var tva = prixHT*(parseFloat(file.tva)/100)
  html1 = `

    <div class="invoice_container" style="font-size: 15px !important">
      <div class="clearfix header_pdf" style=" -webkit-print-color-adjust: exact;     font-size: 10px;">

      <div id="invoice">
          
      <h2>${file.type.split('_').join(' ')}  </h2>
      ${file.type== "Facture" && file.cancel_status== "1" ? `<h2 style="color: red"> Facture annulée </h2>`: ""}
      <div class="date">Date : ${moment(file.date_issue).format('DD/MM/YYYY')}</div>

        <div class="date">${file.type =='Facture' ? 'N° bon de commande : '+file.number_bon : ''} ${file.type =="Facture_d'avoir" ? "N° bon de l'ancienne facture : "+file.number_facture : ''}</div>


      </div>
      <div id="logo" style=" -webkit-print-color-adjust: exact;">
      <img src="${GV.url}/img/uploads/${GV.current_company.logo}" style=" -webkit-print-color-adjust: exact;">
      </div>
    </div>
    <div id="details" class="clearfix" style=" font-size: 10px;">
      <div id="client" style="max-width: 275px !important" >
      
        <h2 class="name"><div>${file.id_folder == '' || file.id_folder == undefined ? " " : GV.folders[file.id_folder].raison_social} ${file.id_folder == '' || file.id_folder == undefined ? " " : GV.folders[file.id_folder].name}</div></h2>
        <div class="address">${file.id_folder == '' || file.id_folder == undefined  ? " " : GV.folders[file.id_folder].address} ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].wilaya}</div>
        <div class="email">${file.id_folder == '' || file.id_folder == undefined  ? " " :GV.folders[file.id_folder].phone}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIF :  ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].nif}` }</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `RC : ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].rc}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `AI : ${file.id_folder == '' || file.id_folder == undefined  ? " " :GV.folders[file.id_folder].ai}`}</div>
        <div class="email">${file.type == "Facture_proforma" ? "" : `NIS: ${file.id_folder == '' || file.id_folder == undefined ? " " :GV.folders[file.id_folder].nis}`}</div>
      </div>
      <div id="company" style=" -webkit-print-color-adjust: exact;">
        <h2 class="name" style=" -webkit-print-color-adjust: exact;">${GV.current_company.raison_social} ${GV.current_company.name}</h2>

        <div>(+213) ${GV.current_company.phone}</div>
        <div style=" -webkit-print-color-adjust: exact;"><a href="mailto:contact@bgicc.com">${GV.current_company.email}</a></div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">NIF :  ${GV.current_company.nif}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">RC : ${GV.current_company.rc}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">NIS: ${GV.current_company.nis}</div>
        <div class="email" style=" -webkit-print-color-adjust: exact;">AI: ${GV.current_company.ai}</div>
      </div>
    
    </div>
    <table class="table-pdf" border="0" cellspacing="0" cellpadding="0">
      <thead>
        <tr style="font-weight: 600 !important;">
          <th scope="col" style="display: none !important">N°</th>
          <th scope="col" style="width: 35%; height: auto; font-weight: 600 !important">Désignation</th>
          <th scope="col" style="width: 10%; height: auto; font-weight: 600 !important">Unité</th>
          <th scope="col" style="width: 20%;font-weight: 600 !important;">Prix unitaire </th>
          <th scope="col" style="width: 10%; font-weight: 600 !important">Qtn</th>
          
          <th scope="col" style="width: 10%; font-weight: 600 !important;">Réduction</th>
          <th class="total" style="text-align: end; font-weight: 600 !important">TOTAL</th>
        </tr>
      </thead>
      <tbody class="items_invoice">


      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">Escompte</td>
          <td colspan="2">${file.escompte.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} ${file.escompte_unity}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">Total HT</td>
          <td colspan="2">${file.total.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>
        </tr>
        <tr>
        <td colspan="2"></td>
        <td colspan="2">TVA ${file.tva} %</td>
        <td colspan="2">${separator(tva.toFixed(2))}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
        <td colspan="2" style="border-bottom: 1px solid #1c1c2b">Total TTC</td>
        <td colspan="2" style="border-bottom: 1px solid #1c1c2b">${separator(prixTTC.toFixed(2))} DA</td>

      </tr>
      </tfoot>
    </table>
    <div class="containerNumber" ></div>
    <div> ${file.type == 'Facture' ? `Le délai de paiement : ${moment(file.payment_deadline).format('DD/MM/YYYY')}` : ''} </div>
    
    <div id="thanks" style=" margin-top: 15px;">${file.description}</div>

    ${selector == undefined || file.type == 'Facture_proforma' ? "": `<div style="padiing-top : 20px; height: 120px;  text-align:right !important;"><img src="${protocol}://${GV.domain_name}/img/uploads/${GV.current_company.cachet}" style="padiing-top : 20px; height: 120px; text-align:right !important;"></div>` }


</div>

<style>

.pdfnone{display: none;}
.clearfix:after { content: ""; display: table;clear: both;}
a {color: #0087C3; text-decoration: none;}
.header_pdf {padding: 10px 0; margin-bottom: 20px;} 
#logo { float: right;margin-top: 8px;} 
#logo img { height: 85px;}
#company {float: left; text-align: left;  border-left: 2px solid #c0c0c0;  padding-left: 10px; font-size: 9px;
} 

#client { padding-left: 6px; float: right; font-size: 9px;
} 
#client .to { color: #777777;} 
h2.name {font-size: 1.4em; font-weight: normal;margin: 0;} 
#invoice { float: left;text-align: left;  }
#invoice h1 {color: #0087C3;font-size: 2.4em; line-height: 1em;font-weight: normal; margin: 0  0 10px 0;} 
#invoice .date {font-size: 1.1em;color: #777777;}
.table-pdf { width: 100%;border-collapse: collapse;border-spacing: 0; margin-bottom: 20px;} 
.table-pdf th, .table-pdf td {padding: 5px; border-bottom: 1px solid #cecece;; }
.table-pdf th { white-space: nowrap;font-weight: normal; }

.table-pdf td {  text-align: left; } 
.table-pdf td h3{color: #1c1c2b;font-size: 1.2em;font-weight: normal;margin: 0 0 0.2em 0;} 
.table-pdf .no {color: #FFFFFF;font-size: 1.6em;  background: #1c1c2b;}
.table-pdf .desc { text-align: left; }
.table-pdf .unit {  }
th, td {
  border-style: solid 1px #DDD;
}
.table-pdf .total {font-weight: 600
  color: #272727;}
  th, td {
    border-style: solid 1px #DDD;
  }
.table-pdf td.unit,
.table-pdf td.qty,
.table-pdf td.total {  font-size: 12.5px; }

.table-pdf tbody tr:last-child td { }

.table-pdf tfoot td { padding: 10px ; background: #FFFFFF; border-bottom: none;font-size: 10px; white-space: nowrap; border-top: 1px solid #AAAAAA;font-weight: 600 !important; }
.table-pdf tfoot tr:first-child td {border-top: none; }

.table-pdf tfoot tr:last-child td {color: #1c1c2b;font-size: 12px;font-weight: 600;border-top: 1px solid #1c1c2b;     width: 100% !important;
}

.table-pdf tfoot tr td:first-child {border: none;}

#thanks{ }

#notices{padding-left: 6px;border-left: 6px solid #0087C3;}

#notices .notice {font-size: 1.2em;}

.footer_pdf { color: #777777;width: 100%;height: 30px; position: absolute; bottom: 0; border-top: 1px solid #AAAAAA; padding: 8px 0; text-align: center; }

.invoice-head td { padding: 0 8px;}
.invoice_container {padding:20px;
font-size: 15px !important
}
.label_container { padding:10px;border:5px solid black;border-radius: 5px; height: 15cm; width: 10cm;display: grid; grid-template-rows: 130px 1fr;  margin-top:20px
}
.invoice-body{  background-color:transparent;}
.invoice-thank{ margin-top: 60px; padding: 5px;}
.address{ margin-top:15px;}
th, td {
  border-style: solid;
}

</style>
  `

  $('.pdf').html(html1)

  $('.items_invoice').html('')
  GV.items = {}
  var number_item = 1
  await load_items( 'items', {id_file : file.id})
   for(let id_item of Object.keys(GV.items)){
    var item = GV.items[id_item]
    if(item.unity_reduce == '%'){
      let amount_reduce = ((parseFloat(item.unit_price.replace(/,/g,'')) * parseFloat(item.quantity))* parseFloat(item.reduce))/100
      var reduce = `<div style="font-size: 10px;color: #4e4e4e;" >${amount_reduce} DA </div> ${item.reduce} `
    }else{
      var reduce = `${item.reduce}`
    }
    let html = `
    <tr style="font-weight: 600 !important;">
      <td class="desc" style="display: none !important">${number_item++}</td>
      <td class="desc" style="width: auto;"><div style="color: #9e9e9e;font-size: 9px;">${item.reference}</div><br>${item.description} </td>
      <td class="qty" style="max-width: 70px !important;">${item.unit}</td>
      <td class="unit">${item.unit_price.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}DA</td>
      <td class="qty"  style="max-width: 70px !important;">${item.quantity}</td>
      <td class="qty" style="max-width: 70px !important;">${item.unity_reduce == 'DA' ? separator(parseFloat(item.reduce).toFixed(2).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})) : reduce } ${item.unity_reduce}</td>
      <td class="total">${item.total_price.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA</td>
    </tr>

    `

  $('.items_invoice').append(html)

   }

      if(decimalPart.toFixed(2) == "0.00"){
    convertNumber(prixTTC.toFixed(0))
   }else{
    convertNumber(prixTTC.toFixed(2))
   }


}




async function displayListeOperation(id){
  GV.operations = {}
  GV.id =id
  await load_items("operations",{id_folder: id})
  $('.modal-dialog_details').html("")
  $('.modal-body_details_content').html("")
  html=
   `  <div class="modal-content_details exposant_page">
          <div class="modal-header_details">
          <div id="add_new_operation" data-id="${GV.id}" class="button text_color2 text_center cursor bold " style=" font-size: 15px; padding: 10px;  
          border: 1px solid; color: #0075eb; "> Ajouter </div>
          <div class="blod text_color3" style="padding: 2px;font-size: 20px; ">${GV.folders[GV.id].name}</div>
          <div id="details_skip" class="exit"><i class="fa fa-times exit" style='color: rgb(165 165 165) !important;'></i></div>
          </div>

          <div class="modal-body_details">

             <div class="modal-body_details_content">

              </div>

          </div>
  </div>`


  $('.modal-dialog_details').html(html)
   
  html_header = `
    <div id="table_header" class="line blod text_color1 grid colmn3" style="padding-bottom: 20px;">
      <div>Nom de l'opération</div>
      <div>Date de création</div>                                                        
      <div></div>                       
    </div>
`
  for(let id of Object.keys(GV.operations)){   
    var operation = GV.operations[id]
     html_content = `

    <div  class="table_items grid colmn3 padding_top15 text_color1  center">
     <div class="blod text_color3">${operation.name}</div>     
     <div class=" text_color10">${moment(operation.date_created).format('DD MMMMM YYYY h:mm:ss')}</div>
     <div>
     <div class="dropdown">
       <i class="fas fa-ellipsis-v dropbtn dropbtn_operation" data-id="${operation.id}" style="font-size: 20px;padding: 10px;     z-index: 500!important;"></i>
       <div id="myDropdown_operation_${operation.id}" class="dropdown-content">
       <div class="action" id="edit_side_operation"  data-folder="${GV.id}" data-id="${operation.id}"><i class="far fa-edit light_grey padding5"></i>Modifier</div>
       <div class="action" id="detail_operation"  data-client="${GV.id}" data-id="${operation.id}"><i class="fa-solid fa-info light_grey padding5"></i>détails</div>
     </div>
   </div>

    </div>


    `

  $('.modal-body_details_content').append(html_content)
  }
  
  $('.modal-body_details_content').prepend(html_header)


}

onClick('.dropbtn_operation', function () {
  let id= $(this).data("id")
  $('.dropdown-content').removeClass('show')
  document.getElementById(`myDropdown_operation_${id}`).classList.toggle("show"); 
});



onClick('.dropbtn_folder', function () {
  let id= $(this).data("id")
  $('.dropdown-content').removeClass('show')
  document.getElementById(`myDropdown_folder_${id}`).classList.toggle("show"); 
});




onClick('#btn_edit_side_folder', function(){
  var id = $(this).data('id')
  $('.modal-dialog_details').css('display', 'none')
  $('.popup_alert').css('display', 'none')
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  
  displaySideFolder(id)
})
onClick('.detail_folder', async function(){
  var id = $(this).data('id')
  $('#overlay').css('display', 'grid')
  $('#side_menu_container').css('display', 'grid')
  
  await displaySideDetailFolder(id)
})


function getDarkColor() {
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
  }
  return color;
}

async function displaySideDetailFolder(id){

  GV.files = {}
  await load_items('files', {id_folder: id, cancel_status: '0', imported: '0'})
  var folder = GV.folders[id]
  var name =folder.name 
  
  const files = Object.values(GV.files)
  let resType = groupElementBy(files, "type")
  // let paiement = groupElementBy(files, "status")
  var data = []
  var dataAvoir = []
  var arr = []
  var arrPaid = []
  var arrVersement = []


  for(let id of Object.keys(GV.files)){
    var file = GV.files[id]
    if( file.cancel_status != '0')continue;
    if(file.type == "Facture"){
      var price = (file.total).replace(/,/g,'')
      var totalHt = parseFloat(price)
      data.push(totalHt);
      console.log(data)
    }if(file.type == "Facture_d_avoir"){
      var priceAvoir = (file.total).replace(/,/g,'')
      var totalAvoir = parseFloat(priceAvoir)
      dataAvoir.push(totalAvoir);

    }if(file.type == "Facture" && file.status == "Payée"){
      arrPaid.push('1');

    }if(file.type == "Facture" && file.status == "Non payée"){
      arr.push('1');

    }if(file.type == "Facture" && file.status == "Versement"){
      arrVersement.push('1');

    }else{
      
    }
  }
  
  const sumInvoice = data.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  const sumAvoir = dataAvoir.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

const accurany = sumInvoice - sumAvoir

  $('#side_menu_container').html("").css('grid-template-rows', '10% 1fr')

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
            <div class="title">Détails</div>
        </div>

        <div id="form_folder" class="body_side_menu">
          <div class="form_container">
            <div class="as-h6 tw-shorter-1-line padding5 d-flex gap-10 center p-b-8"><div class="padding15" style=" background-color:#162b4b; color: white; border-radius: 8px;     padding: 10px 15px;" >${name.charAt(0)}</div> ${name}</div>
            <div class="grid colmn3 gap-10" >
              <div class="col-12">
                <div class="tw-p-3 tw-rounded tw-h-full tw-bg-background-base">
                  <div class="d-flex tw-flex-col tw-h-full tw-justify-between">
                    <div class="as-label-3 tw-text-grey-base mb-1"><span>Factures</span></div>
                    <div>
                      <div class="as-h6">${resType.Facture == undefined ? "0" : resType.Facture.length}</div>
                      <div class="as-caption tw-text-grey-base tw-first-letter-uppercase"> Total de ce ${folder.category}  </div>
                    </div>
                  </div>        
                </div>
              </div>
              <div class="col-12">
              <div class="tw-p-3 tw-rounded tw-h-full tw-bg-background-base">
                <div class="d-flex tw-flex-col tw-h-full tw-justify-between">
                  <div class="as-label-3 tw-text-grey-base mb-1"><span>Devis</span></div>
                  <div>
                    <div class="as-h6">${resType.Facture_proforma == undefined ? "0" : resType.Facture_proforma.length}</div>
                    <div class="as-caption tw-text-grey-base tw-first-letter-uppercase"> Total de ce ${folder.category}   </div>
                  </div>
                </div>        
              </div>
            </div>
            <div class="col-12">
            <div class="tw-p-3 tw-rounded tw-h-full tw-bg-background-base">
              <div class="d-flex tw-flex-col tw-h-full tw-justify-between">
                <div class="as-label-3 tw-text-grey-base mb-1"><span>Bon de commande émis</span></div>
                <div>
                  <div class="as-h6">${resType.Bon_de_commande == undefined ? "0" : resType.Bon_de_commande.length}</div>
                  <div class="as-caption tw-text-grey-base tw-first-letter-uppercase"> Total de ce ${folder.category}   </div>
                </div>
              </div>        
            </div>
          </div>
          </div>
          <div class="tw-rounded tw-h-full tw-bg-background-base margin_top15">
            <div class="d-flex tw-flex-col tw-h-full tw-justify-between">
              <div class="padding15">
                <div class="as-label-3 tw-text-grey-base mb-1">Total du chiffre d'affaire</div> <div class="as-h6">${separator(parseFloat(accurany).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} Da</div>
              </div>
            </div>        
          </div> 
            <div class="padding15" style="margin-top: 45px;">
              <div class="as-label-3 tw-text-grey-base mb-1"><span>Etat de paiement des factures</span></div><br>
              <canvas id="mycircularChart"></canvas>
            </div>   
                 
          </div>
          <div id="error"></div>
        </div>
        </div>
        <div style="height: 0px ;" ></div>

          `
    $('#side_menu_container').html(html)
    
    displayWilayas()
    displayChartCircular(arr, arrPaid, arrVersement)
}

function displayChartCircular(arr, arrPaid, arrVersement){
     // Récupérer les données dynamiques ici (par exemple à partir d'une API)
     let totalCircul = parseInt(arr.length)+parseInt(arrPaid.length)+parseInt(arrVersement.length)
     let paid = (parseInt(arrPaid.length)*100)/parseInt(totalCircul)
     let unpaid = (parseInt(arr.length)*100)/parseInt(totalCircul)
     let versement = (parseInt(arrVersement.length)*100)/parseInt(totalCircul)

     console.log(arr, arrPaid, arrVersement)
     var data1 = paid;
     var data2 = unpaid;
     var data3= versement
   
     var ctx = document.getElementById('mycircularChart').getContext('2d');
     var myChart = new Chart(ctx, {
         type: 'pie',
         data: {
             labels: [`Factures payées ${arrPaid.length} ou ${paid == NaN ? '0' : paid.toFixed(2) } %` , `Factures non payées ${arrPaid.length} ou ${unpaid == NaN ? '0' : unpaid.toFixed(2)} %`,  `Factures avec versement ${arrVersement.length} ou ${versement == NaN ? '0' : versement.toFixed(2)} %` ],
             datasets: [{
                 data: [data1,data2, data3],
                 backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(248,218,174,1.000)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255,152,0,1.000)'
                ],
                 borderWidth: 1
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false
         }
     });
}


onClick('#btn_side_to_send_document', function(){
  var id = $(this).data('id')
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  displaySideSendDocument(id)
})


onClick('#add_new_folder', function(){
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  displaySideFolder()
})




onClick('#edit_side_operation', function(){
  var id = $(this).data('id')
  let id_folder = $(this).data('folder')
  $('#overlayTop').css('display', 'grid')
  $('#side_menu').css('display', 'grid')

  displaySideOperation(id, id_folder)
})


onClick('#add_new_operation', function(){
  $('#overlay').css('display', 'grid')
  $('#overlayTop').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  var id = $(this).data('id')
  let id_folder = id
  displaySideOperation(undefined, id_folder)
})

onClick('#add_new_operation_facturation', function(){
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  var id =  $('.filter_clients').val()
  let id_folder = id
  displaySideOperation(undefined, id_folder, 'facturation')
})




function displaySideOperation(id, id_folder, side){

  var operation = GV.operations[id]
  $('#side_menu').html("")

 
  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="${side == undefined ? 'exit_side': 'exit'}"><i class="fas fa-chevron-left ${side == undefined ? 'exit_side': 'exit'}"></i></div>
            <div class="title">${id==undefined ? "Créer une nouvelle opération " : "Modifier l'opération"}</div>
        </div>

        <div id="form_operation" class="body_side_menu">
          <div class="form_container">

              <div class="input-container">
                <div class="label">Nom de l'opération *</div>
                <input class="content_editable required" type="text" data-id="name" contenteditable="true" value="${id==undefined ? "" : operation.name}"></input>
              </div>
              <div class="input-container">
                <input class="content_editable required id_folder_facturation" type="hidden" data-id="id_folder" contenteditable="true" value="${id_folder}"></input>
              </div>


          </div>
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="${id==undefined ? "add_operation_valid" : "edit_operation_valid"}" data-id="${id==undefined ? "" : operation.id}" class="btn button text_color3 cursor text_center submitBtn" >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
}

onClick('#add_operation_valid', async function () { 
  if(GV.networkStatus==0)return;
  if (!check_form("#form_operation")) {
    return;
    }
  
  if(GV.page_name == "facturation"){
    $('.popup').css('display','block');
    for(var i = 0 ; i < Object.values(GV.folders).length; i++){
      if(Object.values(GV.folders)[i].hasOwnProperty("name") && Object.values(GV.folders)[i].name === $('.filter_clients').val()) {
        var id_folder = Object.values(GV.folders)[i].id    
      }
    } 
    $('.id_folder_facturation').val(id_folder)
    await add("operations", "#form_operation",GV.operations) 
    $('#side_menu').css('display','none');
    $('#overlay').css('display','none');
    GV.operations = {}
    await load_items('operations',{id_folder: id_folder})
    displayDropdownOperation()
  }else{
    await add("operations", "#form_operation",GV.operations)  
    $('#side_menu').css('display','none');
    displayListeOperation(GV.id_folder_detail)
    $('#overlayTop').css('display','none');
    $('.popup').css('display','none');
  }
  

});
onClick('#edit_operation_valid', async function () { 
  if(GV.networkStatus==0)return;
  var id = $(this).data('id')
  await update(id,"operations", "#form_operation",GV.operations) 
  displayListeOperation(GV.id_folder_detail)
  $('#side_menu').css('display','none');
  $('#overlayTop').css('display','none');
  $('.popup').css('display','none');

});



function displaySideSendDocument(id){

  $('#side_menu').html("")

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
            <div class="title">Envoyer un document</div>
        </div>

        <div class="body_side_menu">
          <div  id="form_document" class="form_container">


              <div class="input-container">
                <div class="label">Type du document *</div>
                <select class="content_editable required"  data-id="type" contenteditable="true">
                  <option value="Facture proforma">Facture proforma</option>
                  <option value="Facture">Facture</option>
                  <option value="Bon de commande">Bon de commande</option>
                </select> 
              </div>

              <div class="input-container">
                <input class="content_editable required" type="hidden" data-id="id_folder" contenteditable="true" value="${id}"></input>
              </div>
          </div>
          <div  id="form_items" class="form_container">

              <div class="input-container">
              <div class="label">Description *</div>
                <input class="content_editable required" type="text" data-id="description" contenteditable="true" value=""></input>
              </div>

              <div class="input-container">
              <div class="label">Quantité *</div>
                <input class="content_editable required" type="number" data-id="quantity" contenteditable="true" value=""></input>
              </div>

              <div class="input-container">
              <div class="label">Unité *</div>
                <input class="content_editable required" type="number" data-id="unit" contenteditable="true" value=""></input>
              </div>

              <div class="input-container">             
                <div class="label">Prix unitaire *</div>
                <input class="content_editable required" type="number" data-id="unit_price" contenteditable="true" value=""></input>
              </div>

          </div>


          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor">
              <div id="send_document" data-id="${id}" class="btn button text_color3 cursor text_center " >Envoyé</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)

}
function displaySideFolder(id){

  GV.image_name = {}
  var folder = GV.folders[id]
  $('#side_menu').html("")

  let html=`
        <div class="header_side_menu">
            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
            <div class="title">${id==undefined ? "Créer un nouveau dossier client" : "Modifier le dossier client"}</div>
        </div>

        <div id="form_folder" class="body_side_menu">
          <div class="form_container">

              <div class="input-container grid colmn2 gap-10">
                <div>
                  <div class="label">Statut juridique *</div>
                    <select class="content_editable required"  data-id="raison_social" contenteditable="true">
                      <option value="${id==undefined ? "" : folder.raison_social}">${id==undefined ? "" : folder.raison_social}</option>
                      <option value="EURL">EURL</option>
                      <option value="SARL">SARL</option>
                      <option value="SPA">SPA</option>
                      <option value="SNC">SNC</option>
                      <option value="SCS">SCS</option>
                      <option value="SCA">SCA</option>
                      <option value="GR">GR</option>
                      <option value="">Autre</option>
                    </select> 
                  </div>
                <div>  
                  <div class="label">Raison sociale *</div>
                  <input class="content_editable required" type="text" data-id="name" contenteditable="true" value="${id==undefined ? "" : folder.name}"></input>
                </div>
               </div>

              <div class="input-container">
             </div>

              <div class="input-container">
                <div class="label">Adresse de l'entreprise *</div>
                <input class="content_editable required" type="text" data-id="address" contenteditable="true" value="${id==undefined ? "" : folder.address}"></input>
              </div>

              <div class="input-container">
              <div class="label">Willaya *</div>
                <select id="willaya" class="content_editable required"  data-id="wilaya" contenteditable="true">
                  <option value="${id==undefined ? "" : folder.wilaya}">${id==undefined ? "" : folder.wilaya}</option>
                </select> 
              </div>

              <div class="input-container">
                <div class="label">Numéro de téléphone de l'entreprise *</div>
                <input class="content_editable required" type="text" data-id="phone" contenteditable="true" value="${id==undefined ? "" : folder.phone}"></input>
              </div>

              <div class="input-container">
                <div class="label">Adresse e-mail *</div>
                <input class="content_editable required" type="text" data-id="email" contenteditable="true" value="${id==undefined ? "" : folder.email}"></input>
              </div>

              <div class="input-container">
                <div class="label">Secteur d'activité de l'entreprise *</div>
                <input class="content_editable required" type="text" data-id="activity_sector" contenteditable="true" value="${id==undefined ? "" : folder.activity_sector}"></input>
              </div>

              <div class="input-container">
                <div class="label">Catégorie *</div>
                <select class="category_user content_editable required"  data-id="category" contenteditable="true">
                  <option value="${id==undefined ? "" : folder.category}">${id==undefined ? "" : folder.category}</option>
                  ${GV.page_name != 'fournisseur' ? `
                  <option value="Prospect">Prospect</option>
                  <option value="Client">Client</option>`: ''
                  }
                  ${GV.page_name == 'fournisseur' ? '<option value="Fournisseur">Fournisseur</option>' : ''}
                  
                </select> 
              </div>

              <div class="input-container">
                <div class="label">Numéro de NIF de l'entreprise *</div>
                <input class="content_editable extra_client required" type="text" data-id="nif" contenteditable="true" value="${id==undefined ? "" : folder.nif}"></input>
              </div>

              <div class="input-container">
                <div class="label">Numéro de registre de commerce (RC) de l'entreprise *</div>
                <input class="content_editable extra_client required" type="text" data-id="rc" contenteditable="true" value="${id==undefined ? "" : folder.rc}"></input>
              </div>
              
              <div class="input-container">
                <div class="label">Numéro de AI de l'entreprise *</div>
                <input class="content_editable extra_client required" type="text" data-id="ai" contenteditable="true" value="${id==undefined ? "" : folder.ai}"></input>
              </div>

              <div class="input-container">
                <div class="label">Numéro de NIS de l'entreprise *</div>
                <input class="content_editable extra_client required" type="text" data-id="nis" contenteditable="true" value="${id==undefined ? "" : folder.nis}"></input>
              </div>

              <div class="input-container m-t-20 validatedImageFile" style="margin-bottom : 10px" >
                <div class="label">Coordonnées fiscales (PDF) </div>
                <input class="content_editable link_media" type="file" id="validatedImageFile" value="${id==undefined ? "" : GV.image_name}"></input>

                <div class="progress" style="position: relative ;  height : 7px ;">
                    <div class="progressBar" style=" background-color: #49ac4d; height: 3px;width: 0%;"></div>
                    <div class="progressText" style="text-align: center ; color: black; font-size: 15px; font-weight: 600;"></div>
                </div>
              
              </div>


          </div>
          <div id="error"></div>
        </div>
        </div>

        <div class="footer_side_menu">
            <div class="buttons_container cursor ">
              <div id="${id==undefined ? "add_folder_valid" : "edit_folder_valid"}" data-id="${id==undefined ? "" : folder.id}" class="btn button text_color3 cursor text_center submitBtn " >Valider</div>
            </div>
        </div>

          `
    $('#side_menu').html(html)
    
    displayWilayas()
}
onClick('#add_folder_valid', async function () { 
  if(GV.networkStatus==0)return;
  let element = $('.category_user').val()
  if(element == "Prospect"){
    $('.extra_client').removeClass('required')
  }else{
    $('.extra_client').addClass('required')
  }
  if (!check_form("#form_folder")) {
    return;
  } 
  await add("folders", "#form_folder",GV.folders) 
  if(GV.page_name == 'crm'){
    displayFolders({category: ""}, '#crm_page')
  }if(GV.page_name == 'fournisseur'){
    displayFolders({category: ""}, '#fournisseur_page')
  }if($('.btn_type_selected').data('type') == "Bon_de_commande"){
    displayDropdownClient('fournisseur')
  }else{
    displayDropdownClient('crm')
  }


  $('#side_menu').css('display','none');
  $('#overlay').css('display','none');  
});

onClick('#edit_folder_valid', async function () { 
  if(GV.networkStatus==0)return;
  var id = $(this).data('id')
  let element = $('.category_user').val()
  if(element == "Prospect"){
    $('.extra_client').removeClass('required')
  }else{
    $('.extra_client').addClass('required')
  }
  if (!check_form("#form_folder")) {
    return;
  } 
  await update(id,"folders", "#form_folder",GV.folders) 
  if(GV.page_name == 'crm'){
    displayFolders({category: ""}, '#crm_page')

  }else{
    displayFolders({category: ""}, '#fournisseur_page')
  }

  $('#side_menu').css('display','none');
  $('#overlay').css('display','none');
});



//! ///////////////////////////////////////////////////////////
//! //////////////////!    statistique     //////////////////////////
//! ///////////////////////////////////////////////////////////


GV.initialize_page.statistique= async function(){
  displayPlaceholder()
  searchBar(".table_items")
  GV.files = {}
  GV.folders = {}
  GV.to_date = ""
  GV.in_date = ""
  if(GV.ObjCurrentUser.manager == "0"){
    await load_items("files",{validation: '1', id_profil : GV.current_company.id, id_account : GV.current_user})
    await load_items("folders",{id_profil : GV.current_company.id, id_account : GV.current_user})
  }else{
    await load_items("files",{validation: '1', id_profil : GV.current_company.id})
    await load_items("folders",{id_profil : GV.current_company.id})
  }
  displayCountStat()
  displayFactureNonPaye()
  isManager()
  isAdministater()
  $('.count').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).text()
    }, {
        duration: 700,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
  });
  $('.countPoint').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).text()
    }, {
        duration: 600,
        easing: 'swing',
        step: function (now) {
            $(this).text(now);
        }
    });
  });
  PlaceholderisEmpty('#statistique_page')
  }

  $(document).on('change','#in-date', async function(){
    GV.in_date =$(this).val()
    console.log(GV.start_date)
    displayCountStat()
    displayFactureNonPaye()
    $('.count').each(function () {
      $(this).prop('Counter',0).animate({
          Counter: $(this).text()
      }, {
          duration: 700,
          easing: 'swing',
          step: function (now) {
              $(this).text(Math.ceil(now));
          }
      });
    });
    $('.countPoint').each(function () {
      $(this).prop('Counter',0).animate({
          Counter: $(this).text()
      }, {
          duration: 600,
          easing: 'swing',
          step: function (now) {
              $(this).text(now);
          }
      });
    });
  })
  $(document).on('change','#to-date', async function(){
    GV.to_date =$(this).val()
    displayCountStat()
    displayFactureNonPaye()
    $('.count').each(function () {
      $(this).prop('Counter',0).animate({
          Counter: $(this).text()
      }, {
          duration: 700,
          easing: 'swing',
          step: function (now) {
              $(this).text(Math.ceil(now));
          }
      });
    });
    $('.countPoint').each(function () {
      $(this).prop('Counter',0).animate({
          Counter: $(this).text()
      }, {
          duration: 600,
          easing: 'swing',
          step: function (now) {
              $(this).text(now);
          }
      });
    });
  })


  function displayFactureNonPaye(){
    $('#facture_list').html('')
    for(let id of Object.keys(GV.files)){
      var file = GV.files[id]
      if( file.validation != "1")continue; 
      if( file.cancel_status != "0")continue; 
      if( file.type != "Facture")continue; 
      if( file.status!="Non payée")continue; 
      
      if ( moment(file.creation_date).format('YYYY-MM-DD') < GV.in_date && GV.in_date != "")continue;
      if ( moment(file.creation_date).format('YYYY-MM-DD') > GV.to_date && GV.to_date != "")continue;
      var price = (file.total).replace(/,/g,'')

      var prixHT = parseFloat(price)
      var sum = 1+(parseFloat(file.tva)/100)
      var prixTTC = prixHT*sum
      var decimalPart = prixTTC - parseInt(prixTTC);
      html=`
      <div  class="table_items grid colmn6 padding_top15 text_color1  center">
        <div class="blod text_color3">Facture : N° ${file.file_number}</div>
        <div class="blod" style="color:#0075eb ">${GV.folders[file.id_folder].raison_social} ${GV.folders[file.id_folder].name}</div>   
        <div class=" text_color10">${moment(file.creation_date).format('DD MMMM YYYY h:mm:ss')}</div>       
        <div class="blod text_color10">${separator(parseFloat(price).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} DA </div>
        <div class="blod text_color10">${file.tva} % </div>
        <div class="blod text_color10">${separator(parseFloat(prixTTC).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}</div>
      
      </div> 
      
      `
      $('#facture_list').append(html)
    }
  }

  function displayCountStat(){

    var users= []
    for(let id of Object.keys(GV.files)){
      var file = GV.files[id]
      if( file.cancel_status != '0')continue;
      if ( moment(file.creation_date).format('YYYY-MM-DD') < GV.in_date && GV.in_date != "")continue;
      if ( moment(file.creation_date).format('YYYY-MM-DD') > GV.to_date && GV.to_date != "")continue;
      users.push(file);
    
    }

    // const users = Object.values(GV.files)

    
    const groupBy = (arr, key) => {
      const initialValue = {};
      return arr.reduce((acc, cval) => {
        const myAttribute = cval[key];
        acc[myAttribute] = [...(acc[myAttribute] || []), cval]
        return acc;
      }, initialValue);
    };
    
    const res = groupBy(users, "type");
    console.log("group by:", res);
    
    $('#stat_invoice').html('')
    $('#stat_boxs').html('')
    html = `
    
    <div class="grid colmn2 shadow padding15  raduis box-info-dash" style="background: Linear-gradient(rgb(222 172 45 / 73%),rgb(246 188 37 / 86%));background-size: cover;">
      <div class=" grid cover row " style=" margin: 0px; color:white;">
        <div class="title_small ">Factures </div>
        <div  class="bold title_bg d-flex"> <div>${res.Facture == undefined ? 0 : res.Facture.length}</div></div>
      </div>
      <div class=" content_box center boxs text_center" style=" color: #FFC107;background: #fff8e273; ">
        <span style="font-size: 35px;  margin: 25px;" class="material-symbols-outlined">bookmark_added</span> 
      </div>
    </div>

    <div class="grid colmn2 shadow padding15 raduis box-info-dash" style="background: Linear-gradient(#4caf50f2,rgb(76 175 80 / 73%));background-size: cover;" >
      <div class=" grid cover row " style=" margin: 0px; color: white">
        <div class="title_small ">Bons de commades </div>
        <div  class="bold title_bg d-flex"> <div>${res.Bon_de_commande == undefined ? 0 : res.Bon_de_commande.length}</div> </div> 
     </div>
      <div class=" content_box center boxs text_center" style=" color: #34a853;background:#a8dab547; " >
      <span style="font-size: 35px;  margin: 25px;" class="material-symbols-outlined">bookmark_added</span> 
      </div>
    </div>
  
  
    <div class="grid colmn2 shadow padding15 raduis box-info-dash" style="background: Linear-gradient(#ff6f00a8,#ff6f00d1); background-size: cover;" >
    <div class=" grid  cover row " style=" margin: 0px; color: white;">
      <div class="title_small ">Devis </div>
      <div  class="bold title_bg d-flex"> <div>${res.Facture_proforma == undefined ? 0 : res.Facture_proforma.length}</div>  </div>
      </div>
      <div class=" content_box center boxs text_center" style=" color: #ff5722;background: #f1cbae6b; ">
      <span style="font-size: 35px;  margin: 25px;" class="material-symbols-outlined">bookmark_added</span> 
      </div>
    </div>

    <div class="grid colmn2 shadow padding15 raduis box-info-dash" style="background: Linear-gradient(rgb(179 42 203 / 66%),rgb(141 57 155 / 81%)); background-size: cover;">
    <div class=" grid  cover row " style=" margin: 0px; color: white;">
      <div class="title_small ">Factures d'avoir </div>
      <div  class="bold title_bg d-flex"> <div>${res.Facture_d_avoir == undefined ? 0 : res.Facture_d_avoir.length}</div> </div>
      </div>
      <div class=" content_box center boxs text_center" style=" color:  #9c27b0;background: #f4b4ff5e; ">
      <span style="font-size: 35px;  margin: 25px;" class="material-symbols-outlined">bookmark_added</span> 
      </div>
    </div>
    
    `
    $('#stat_boxs').html(html)

    var data = []
    var dataSpend = []
    var dataAvoir = []

    for(let id of Object.keys(GV.files)){
      var file = GV.files[id]
      if( file.cancel_status != '0')continue;
      if ( moment(file.creation_date).format('YYYY-MM-DD') < GV.in_date && GV.in_date != "")continue;
      if ( moment(file.creation_date).format('YYYY-MM-DD') > GV.to_date && GV.to_date != "")continue;
      if(file.type == "Facture"){
        var price = (file.total).replace(/,/g,'')
        var totalHt = parseFloat(price)
        data.push(totalHt);

      }if(file.type == "Bon_de_commande"){

        var priceSpend = (file.total).replace(/,/g,'')
        var totalSpend = parseFloat(priceSpend)
        dataSpend.push(totalSpend);

      }if(file.type == "Facture_d_avoir"){
        
        var priceAvoir = (file.total).replace(/,/g,'')
        var totalAvoir = parseFloat(priceAvoir)
        dataAvoir.push(totalAvoir);
        
      }else{

      }
    }
    console.log(dataSpend, data)
    const sumInvoice = data.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    const sumSpend = dataSpend.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    
    const sumAvoir = dataAvoir.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

  const accurany = sumInvoice - sumAvoir
    html1 = `
    <div>
          <div class="box-info-stat raduis grid colmn2  shadow " style=" background: Linear-gradient(#1262e5d4,#1ea2f0cc), url(img/Untitled-1.jpg); color: white; background-size: cover; padding: 5px 15px;">
              <div class="title_small">Chiffre d'affaires <div class="grid gap10" style="grid-template-columns: 0.5fr 100px"><div  class="bold title_bg "> ${separator(parseFloat(accurany).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} </div> <div  class="bold title_bg">DA</div></div></div>
              <div class="center boxs text_right"> <img src="img/correct.png" style="height:50px;"/>  </div>
          </div>
      </div>
      <div>
      <div class="box-info-stat raduis  grid colmn2  shadow " style=" background:  Linear-gradient(#1262e5d4,#1ea2f0cc), url(img/Untitled-1.jpg); color: white; background-size: cover; padding: 5px 15px;">
              <div class="title_small">Charges  <div class="grid gap10"  style="grid-template-columns: 0.5fr 100px"> <div  class="bold title_bg "> ${separator(parseFloat(sumSpend).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}</div> <div  class="bold title_bg">DA</div></div></div>
              <div class="center boxs text_right"> <img src="img/dollar.png" style="height:50px;"/>  </div>
          </div>
    </div>
    
    `
    $('#stat_invoice').html(html1)




    }
    
 
function dropdown(){
 var dropdown = document.getElementsByClassName("dropdown-btn");
 var i;

 for (i = 0; i < dropdown.length; i++) {
   dropdown[i].addEventListener("click", function() {
     this.classList.toggle("active");
     var dropdownContent = this.nextElementSibling;
     if (dropdownContent.style.display === "block") {
       dropdownContent.style.display = "none";
     } else {
       dropdownContent.style.display = "block";
     }
   });
 }
}










//! ///////////////////////////////////////////////////////////
//! /////////////////!    IMAGE UPLOAD    /////////////////////
//! ///////////////////////////////////////////////////////////





$(document).on('change','#validatedImageFile', function(){
  let file = this.files[0];
  upload_image(file, '.validatedImageFile', (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.image_name = e.file_name;
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
});
$(document).on('change','#validatedProgrammeFile', function(){
  let file = this.files[0];
  upload_image(file,'.validatedProgrammeFile' , (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.programme_name = e.file_name;
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
});
$(document).on('change','#validatedformfr', function(){
  let file = this.files[0];
  upload_image(file,'.validatedformfr' , (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.form_fr = e.file_name;
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
});
$(document).on('change','#validatedformar', function(){
  let file = this.files[0];
  upload_image(file,'.validatedformar' , (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.form_ar = e.file_name;
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
});

$(document).on('change','#validatedLogoFile', function(){
  let file = this.files[0];
  upload_image(file,'.validatedLogoFile' , (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.logo_name = e.file_name;
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
});



//! ///////////////////////////////////////////////////////////
//! /////////////////!   ANOTHER FUNCTION  /////////////////////
//! ///////////////////////////////////////////////////////////




window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


onClick('#overlay, .exit, #valid_not', function(){
  $('#overlay').css('display', 'none')
  $('#overlayTop').css('display', 'none')
  $('#side_menu').css('display', 'none') 
  $('#side_menu_container').css('display', 'none') 
  $('.modal-dialog_details').css('display', 'none')
  $('.modal_add').css('display', 'none')
})
onClick('.ok', async function () {
  $('.popup').css('display', 'none')
  $('.popup_alert').css('display', 'none')
  $('#overlay').css('display', 'none')
});
onClick('.closed', async function () {
  $('.popup2').css('display', 'none')
  $('#overlayTop').css('display', 'none')
});

onClick('.exit_side', function(){
  // $('#overlay').css('display', 'none')
  $('#overlayTop').css('display', 'none') 
  $('.modal-dialog_details').css('display', 'block')
  $('#side_menu').css('display', 'none') 
  $('.modal_add').css('display', 'none')
})

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
onClick('#logOut', async function(){
  var logOut = {stat:'true'}

  var options = {
    type: "POST",
    url: `/logOut`,
    cache: false,
    data: logOut,
  };
  var received_data = await $.ajax(options);
  if(received_data.success){
    window.location.href='/login'
  }

});



function ExpendImg(img) {
  var expandImg = document.getElementById("expandedImg");
  expandImg.src = img.src;
  expandImg.parentElement.style.display = "block";
}
onClick('.box_details', function (){
  $('#overlay').css('display', 'block')
  $(this).css('display', 'none');
  $('#expandedImg').css('display', 'block');
})

onClick('.closebtn, .container_expended', function () {
  $('.container_expended').css('display','none' )

});

async function displayWilayas(){

  await load_items("wilayas",{}) 
  $('#willaya').html("")
   for(var unique_id of Object.keys(GV.wilayas)){
    
    var wilaya=GV.wilayas[unique_id]
    html = `<option value="${wilaya.name}">${wilaya.name}</option>`
    $('#willaya').append(html)
   }

}

// check connexion

window.addEventListener('offline', () => offline());
window.addEventListener('online', () =>  online())

function offline(){
  GV.networkStatus = 0
  $('#connection_status').css('display','block')
}
function online(){
  GV.networkStatus = 1
  $('#connection_status').css('display','none')
}




