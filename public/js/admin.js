
GV={initialize_page:{}}

GV.url = "http://localhost"
GV.domain_name = 'localhost'
$(document).ready(  async function () {

  GV.networkStatus = 1
  setTimeout(showPage, 3000);
  moment.locale();
  await get_session_name()
  displayCurrentUser()



});

function displayCurrentUser(){
  let user = Object.values(GV.current_obj_user)[0]
  let group = Object.values(GV.current_group)[0]
  $('#current_profil').html('')
  $('#top-header-text').html('')
  let html = `
  <div class=" top_banner subtitle_small text_right cursor bold d-flex center">
    <div class="my_profile d-flex center gap-10 " data-id="dropdown_info">                        
        <div class="header-admin-image">
          <img src="/img/${user.picture == null ? 'default-user.jpg' : `${user.picture}`}"/>                           
        </div>  
        <div class="text_left">
            <div class="bold" style="font-size: 15px;">${user.first_name} ${user.last_name}</div>
            <div class="subtitle_small" style="font-size: 12px;">${user.type}</div>
        </div>
    </div>
  </div>
  `
  $('#current_profil').html(html)
  let html_company = `
  <div class="bold" style="font-size: 25px;">${group.name}, ${group.country}</div>
  <div class="subtitle_small">Administrateur</div>
  ` 
  $('#top-header-text').html(html_company)
}

function showPage() {
  document.getElementById("loading_page").style.display = "none";
}

function get_first_page() {
  let path = window.location.pathname;
  console.log(path)
  if (path == "/dashboard") return "dashboard";
  if (path == "/document") return "document";
  if (path == "/companies") return "companies";
  if (path == "/licences") return "licences";
  return "dashboard";
}

function get_next_page_url(page_name){
  return `/${page_name}`;
  }



  //! ///////////////////////////////////////////////////////////
//! //////////////////!    DASHBOAR   //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.dashboard = async function(){
  displayPlaceholder()

  }

 

  //! ///////////////////////////////////////////////////////////
//! //////////////////!    document   //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.document = async function(){

  GV.documents = {}
  searchBar(".btn_edit_document")
  await load_items('#document', "/loaddocument")
  displayDocuments()

}

  function displayDocuments (){
    for(let id of Object.keys(GV.documents)){
      let document = GV.documents[id]
      if(document.is_deleted == "1")continue;
      let html = `
      <div class="btn_edit_document padding5 text_center center grid cursor" style="height: 300px;">
          <img src="/img/uploads/${document.picture}" style="height: 200px; margin: auto" data-id="${document.id}">
          <div class="title_small" style="max-width: 170px; font-size: 15px; margin:auto;" data-id="${document.id}">${document.title}</div>
          <div class="subtitle_small" data-id="${document.id}">${moment(document.created_date).format('DD/MM/YYYY')}</div>
          <a href="/img/uploads/${document.src}" target="_blank">Ouvrir le document</a>
      </div>
      `
      $('#list_documents').append(html)
    }
  }

  onClick('#add_new_document', function(){
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideDocument()
  })

  onClick('.btn_edit_document div, .btn_edit_document img', function(e){
    e.preventDefault()
    let id = $(this).data('id')
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideDocument(id, GV.documents, 'delete_document')
  })

  function displaySideDocument(id, obj, remove){
    var side = {id : "form_document", title_add: "Ajouter Un document" , title_update: "Modifier Le Document",  btn_add: "add_document" , btn_update: "update_document", data_id : id }
    var arr = [
      {data_id : 'title', class : 'required' , selector : 'input', type : 'text', label : "Titre du document", id : '', placeholder :"Titre" }
      ,{data_id : 'src', class : 'required' , selector : 'input', type : 'file', label : "Document en PDF", id: 'validatedDocumentFile'},   
      {data_id : 'picture', class : 'required' , selector : 'input', type : 'file', label : "Première image du document", id : 'validatedImageFile'}
    ]
    if(id == undefined){
      displaySide(arr, side,'side')
    }else{
      displaySide(arr, side,'side', obj[id], id, remove)
    }
    
  }
  onClick('#add_document', async function(){
    if (!check_form("#form_document")) {
      return;
    }
    await addFromForm('/addnewdocument', '#form_document',GV.documents)
    $('#list_documents').html('')
    displayDocuments ()
    PlaceholderisEmpty('#document')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
  })

  onClick('#update_document', async function(){
    let id = $(this).data('id')
    await updateFromForm(id,'/updatedocument', '#form_document',GV.documents)
    $('#list_documents').html('')
    displayDocuments ()
    PlaceholderisEmpty('#document')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
  })

  onClick('#valide_delete_document', async function(){
    let id = $(this).data('id')
    await updateFromValues(id,'/deletedocument',GV.documents, "remove")
    
    $('#list_documents').html('')
    displayDocuments ()
    PlaceholderisEmpty('#document')
    $('.popup_problem').css('display','none');
  })

  onClick('#delete_document', async function(){
    let id = $(this).data('id')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
    $('.popup_problem').css('display','block');
    $('.popup_problem .message').html("Êtes-vous sûr de vouloir supprimer ce document")
    $('.popup_problem .popup_footer').html(`<div class="btn btn-outline-success ok" style="font-weight: 600;"> Non </div> <div id="valide_delete_document" data-id=${id} class="btn" style="font-weight: 600;"> Oui </div>`)
  })


//! ///////////////////////////////////////////////////////////
//! //////////////////!    licences   //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.licences = async function(){
  searchBar(".table_items")
  displayPlaceholder()
  await load_items('#licences', "/loadGroupes")
  await load_items('current', "/loadDesignationsLicence")
  displayListGroupLicence()
  GV.index_licence = 1
}


  onClick('#add_new_group', function(){
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideGroups()
  })
  onClick('#edit_group', function(e){
    e.stopPropagation()
    let id = $(this).data('id')
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideGroups(id, GV.groups)
  })
  
  function displaySideGroups(id, obj, remove){
    var side = {id : "form_group", title_add: "Ajouter Un dossier de Licence" , title_update: "Modifier le dossier de Licence",  btn_add: "add_group" , btn_update: "update_group", data_id : id }
    var arr = [
      {data_id : 'name', class : 'required' , selector : 'input', type : 'text', label : "Nom du dossier de licence", id : '', placeholder :"Nom" }
      ,{data_id : 'email', class : 'required' , selector : 'input', type : 'email', label : "Adresse e-mail du dossier", id : ''},
      {data_id : 'password', class : 'required' , selector : 'input', type : 'password', label : "Mot de passe ", id: 'group_password'},   
    ]
    if(id == undefined){
      displaySide(arr, side,'side')
    }else{
      displaySide(arr, side,'side', obj[id], id, remove)
    }
  }

  onClick('#add_group', async function(){
    if (!check_form("#form_group")) {
      return;
    }
    await addFromForm('/addnewgroup', '#form_group', GV.groups, 'Cette adresse e-mail existe déjà')
    displayListGroupLicence()
  })
  onClick('#update_group', async function(){
    if (!check_form("#form_group")) {
      return;
    }
    let id = $(this).data('id')
    await updateFromForm(id, '/editgroup', '#form_group', GV.groups,'Cette adresse e-mail existe déjà')
    displayListGroupLicence()
    
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
  })

  function displayListGroupLicence(){
    $('#list_compnay_licences').html('')
    for(let id of Object.keys(GV.groups)){
      let group = GV.groups[id]
      let html = `
      <div  class="group_licence table_items grid colmn3 padding_top15 text_color1 center" data-id="${group.id}">
          <div class="blod text_color10 padding15">${group.name}</div>     
          <div class="blod text_color10 padding15">${group.email}</div>     
          <div>
              <div class="dropdown">
                <i class="fas fa-ellipsis-v dropbtn dropbtn_group" data-id='${group.id}'  style="font-size: 20px;padding: 10px;"></i>
                <div id="myDropdown_group_${group.id}" class="dropdown-content">
                  <div id="assign_companies" class="action" data-id="${group.id}"><i class="fa-solid fa-info light_grey padding5"></i>Assigner des enreprises</div>
                  <div id="edit_group" class="action" data-id="${group.id}"><i class="far fa-edit light_grey padding5"></i>Modifier le groupe</div>

                </div>
              </div>
          </div>  
      </div>`

      $('#list_compnay_licences').append(html)
    }
  }
  onClick('.dropbtn_group', function (e) {
    e.stopPropagation()
    let id= $(this).data("id")
    $('.dropdown-content').removeClass('show')
    document.getElementById(`myDropdown_group_${id}`).classList.toggle("show"); 
  });

  onClick('#assign_companies',async function (e) {
    
    e.stopPropagation()
    let id = $(this).data('id')
    await load_items('current', "/loadCompaniesDontAssign")
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideCompaniesSuggestion(id)

  });
  function displaySideCompaniesSuggestion(dataId){
    GV.companiesIdSelected = []
    $('#side_menu').html('')

    let html = `  
        <div class="header_side_menu">
          <div id="skip_btn" class="exit"><i class="fas fa-chevron-left "></i></div>
          <div class="title">${dataId== undefined ? "Liste des entreprises assignées à ce groupe" : 'Liste des entreprise à assigner'}</div>
        </div>
        <div class="body_side_menu">
          <div id="form_companies_assign" class="form_container">
          </div>        
          <div id="error"></div>
        </div>
        <div class="footer_side_menu ${dataId== undefined ? "none" : ""}">
          <div class="buttons_container cursor " style="" >
            <div id="${dataId== undefined ? "" : 'valid-update-companies-assign'}" data-element="" data-id="${dataId== undefined ? "" : dataId}" class="btn button text_color3 cursor text_center primary_color_btn" >Valider</div>
          </div>
        </div>
        `
    $('#side_menu').html(html) 
      if(jQuery.isEmptyObject(GV.companies)){
        let html= `
        <div class="empty-content">
          <p>Aucune entreprise</p>
        </div>
        
        `
        $('#form_companies_assign').html(html)
      }else{
        for(let id of Object.keys(GV.companies)){
          let company = GV.companies[id]
          let html= `
                <div class="cursor ${dataId== undefined ? "add_new_licence" : 'companies_box'} tw-rounded tw-h-full tw-bg-background-base margin_top15" data-id='${company.id}'>
                    <div class=" padding15 d-flex tw-flex-col tw-h-full tw-justify-between"> 
                      <div class="as-label-3 tw-text-grey-base mb-1">
                      ${company.country}, ${company.region} 
                      </div>
                      <div class="as-h6">${company.name} </div>
                    </div>
                    <div>
                     
                    </div>
                </div>
          `
          $('#form_companies_assign').append(html)
        } 
      }
  }

  onClick('.companies_box',async function (e) {

   let id = $(this).data('id')
   if($(this).hasClass('selected_company_assing')){
      $(this).removeClass('selected_company_assing') 
      GV.companiesIdSelected = GV.companiesIdSelected.filter(item => item !== id);
   }else{
    $(this).addClass('selected_company_assing') 
    GV.companiesIdSelected.push(id)
   }

  });
  onClick('#valid-update-companies-assign',async function (e) {
    let element = GV.companiesIdSelected
    let id = $(this).data('id')
    await updateFromValues(id,'/edit_assign_companies',GV.companies,"add", element )
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
  });

  onClick('.group_licence',async function (e) {
    
    e.stopPropagation()
    let id = $(this).data('id')
    GV.companies = {}
    await load_items('current', "/loadCompaniesAssignToGroup", id)
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideCompaniesSuggestion()
  });

  onClick('.add_new_licence',async function (e) {
    e.stopPropagation()
    let id = $(this).data('id')
    $('.add_new_licence').removeClass('selected-color')
    $(this).addClass('selected-color')
    $('#side_menu').addClass('left20vw')
    $('#right_side_menu').css('display', 'flex')
    displayLicenceCompany(id)
    
  });
  onClick('#add_licence',async function (e) {
    e.stopPropagation()
    let index = GV.index_licence++
    let id = $(this).data('id')
    let html= `
    <div class="input-container item_content form_container box_licence_${index}" style="margin: 15px auto;border-radius: 5px;padding: 10px; color: #25505e;border: 1px solid #8080804f;">
    <div  style=" text-align: end; color: #25505e"><i data-id="${index}" class="fa-solid fa-trash remove_form_licence cursor"></i> </div>
   
      <div class="grid colmn2 gap-10">
        <div>
          <div class="label">Date de début *</div>
          <input data-id="start-date" type="date" id="start-date${index}" class="content_editable required"></input>
        </div>
        <div>
          <div class="label">Date de fin *</div>
          <input data-id="end-date" type="date" id="end-date${index}" class="content_editable required"></input>
        </div>
      </div>
      <div class="label">Désignation *</div>
      <select id="liste_designation${index}" type="text"  class="section-options content_editable required"  data-id="id_designation" contenteditable="true" > 
             
      </select>

      <div style=" font-size: 20px ; text-align: end; color: #1aae93; padding: 10px; margin: auto;font-weight: 600; ">  <i id="insert_new_licence" data-id="${id}" data-index="${index}"  class="fa fa-check cursor"></i>  </div>
    </div>
    
    `
    $('.box_add_licence').append(html)
    
    $(`#liste_designation${index}`).html('')
    $(`#liste_designation${index}`).prepend(`<option value="" selected="true" disabled="disabled">Sélectionner une valeur</option>`)
    for(element of Object.values(GV.designations)){
      let html = `<option value="${element.id}">${element.name} , ${element.unit_price}</option> `
      $(`#liste_designation${index}`).append(html)
    }   
    
    
  });

  onClick('.remove_form_licence', function (e) {
    e.stopPropagation()
    let data =$(this).data('id')
    $(`.box_licence_${data}`).remove();
  });

  onClick('.desable_licence', async function (e) {
    e.stopPropagation()
    let id =$(this).data('id')
    await updateFromValues(id,'/desableLicence',GV.licences, "")
    loopingLincences()

  });

  onClick('.enable_licence', async function (e) {
    e.stopPropagation()
    let id =$(this).data('id')
    await updateFromValues(id,'/enableLicence',GV.licences, "")
    loopingLincences()

  });

  onClick('#insert_new_licence', async function (e) {
    e.stopPropagation()
    let data =$(this).data('id')
    let index =$(this).data('index')

    let obj = { 
      start_date: $(`#start-date${index}`).val(),
      end_date : $(`#end-date${index}`).val(),
      id_designation: $(`#liste_designation${index}`).val(),
      id_company: data ,
     }
    await addFromObj('/addnewLicence',  {obj}, GV.licences, '')
    $(`.box_licence_${index}`).remove();
    loopingLincences()
  });

  function loopingLincences(){
    $('#licences_boxs').html('')
    for(let element of Object.values(GV.licences)){
 
      let today=  moment(new Date()).format('YYYY-MM-DD')
      let start =moment(element.start_date).format('YYYY-MM-DD')
      let end =moment(element.end_date).format('YYYY-MM-DD')
      console.log(checkDate(today, start, end).status)
      let html = `
      <div class=" box_licence_content cursor tw-rounded margin_top15 d-flex justify-between" style="${element.is_valid == "1" ? `background-color: ${checkDate(today, start, end).light}` : " border: 1px solid #e8e8e8"} ; height: fit-content;" >
           ${checkDate(today, start, end).status == "during" ? `<div class="${element.is_valid == '1' ? 'desable_licence' : 'enable_licence'} shadow" data-id="${element.id}">${element.is_valid == "1" ? "Désactiver" : 'Réactiver'}</div>`: ''}
  
          <div class=" padding15 d-flex tw-flex-col tw-justify-between"> 
            <div class="as-h6 ">
            ${GV.designations[element.id_designation].name}
            </div>
            <div class="as-label-3 tw-text-grey-base mb-1 bold">${moment(element.start_date).format('DD/MM/YYYY')} à ${moment(element.end_date).format('DD/MM/YYYY')}  </div>
          </div>
          <div style="margin: auto; color:  ${checkDate(today, start, end).dark}; font-weight: 700;">
          ${checkDate(today, start, end).time}
          </div>
      </div>
      `
       $('#licences_boxs').prepend(html)
    }
  }
 
  async function displayLicenceCompany(id){
    GV.licences = {}
    await load_items('current', "/loadLicenceCompany", id)
    $('#right_side_menu').html('')
    $('#right_side_menu').prepend('<div id="licences_boxs"></div>')
    
    loopingLincences()
    let header = `
    <div class="box_add_licence"></div>
    <div id="add_licence" class="cursor bold" style="color: #0075eb ;margin: 15px 0px;" data-id='${id}'>+ Ajouter une nouvelle licence</div>
    `
    $('#right_side_menu').append(header)

  }

  function getDaysBetweenDates(startDate, endDate) {
    var start = new Date(startDate);
    var end = new Date(endDate);
    var oneDay = 24 * 60 * 60 * 1000; // number of milliseconds in one day
    var diffDays = Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
    return diffDays;
  }

  function checkDate(today, start, end) {
    var todayDate = new Date(today);
    var startDate = new Date(start);
    var endDate = new Date(end);
  
    if (todayDate < startDate) {

      let timeDiff = startDate.getTime() - todayDate.getTime();
      let dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // convert milliseconds to days
      return { dark : "#1a60eb" , light :"#edf5fd", time : `${dayDiff}`, status: 'comming'};

    } else if (todayDate > endDate) {
      return { dark : "#d78e47", light : "#fff0e1", time : "Expirer" , status : 'finished'};

    } else {
      let timeDiff =  endDate.getTime() - todayDate.getTime() ;
      let dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // convert milliseconds to days
      return  {dark :  "#1aae55",  	light:  "#e7fce9",time : `${dayDiff}`, status : "during"};
    }
  }

  

  //! ///////////////////////////////////////////////////////////
//! //////////////////!    companies   //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.companies = async function(){
  searchBar(".table_items")
  displayPlaceholder()
  await load_items('#companies', "/loadCompanies" )
  displayCompanies()
  }



  function displayCompanies(){
    for(let id of Object.keys(GV.companies)){
      let company = GV.companies[id]
      let html = `
      <div  class="popup_list_operation table_items grid colmn4 padding_top15 text_color1 center" data-element="entreprise" data-id="${company.id}">
          <div class="first_latter padding15" >${company.name.charAt(0).toUpperCase()}</div>       
          <div class="blod text_color10 padding15">${company.name}</div>     
          <div class="blod text_color10 padding15">${company.region}, ${company.country}</div>     
          <div class="blod text_color10 padding15">${company.code_postal}</div>  
          <div>
              <div class="dropdown">
                <i class="fas fa-ellipsis-v dropbtn dropbtn_company" data-id='${company.id}'  style="font-size: 20px;padding: 10px;"></i>
                <div id="myDropdown_company_${company.id}" class="dropdown-content">
                <div class="action detail_edit_company" data-element="entreprise" data-id="${company.id}"><i class="fa-solid fa-info light_grey padding5"></i>Modifier</div>
                <div class="action stat_company" data-id='${company.id}' data-element="entreprise"><i class="fa-solid fa-info light_grey padding5"></i>Voir les statistiques</div>
              </div>
            </div>
          </div>  
      </div>
      `
      $('#list_companies').append(html)
    }
  }
  onClick('.dropbtn_company', function (e) {
    e.stopPropagation()
    let id= $(this).data("id")
    $('.dropdown-content').removeClass('show')
    document.getElementById(`myDropdown_company_${id}`).classList.toggle("show"); 
  });

  onClick('#add_new_company', function(){
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideCompany()
  })
 
  onClick('.stat_company', async function(e){
    e.stopPropagation()
    var id = $(this).data('id')
    $('#overlay').css('display', 'grid')
    $('#side_menu_container').css('display', 'grid')
    
    await displaySideDetailFolder(id)
  })

  async function displaySideDetailFolder(id){
    
    GV.files = {}
    // await load_items('#side_menu_container', "/loadfiles" ,{id_company: id, cancel_status: '0', imported: '0'})
    await load_items('#side_menu_container', "/loadfiles" ,id)

    var name =GV.companies[id].name 
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
                        <div class="as-caption tw-text-grey-base tw-first-letter-uppercase">  </div>
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
                      <div class="as-caption tw-text-grey-base tw-first-letter-uppercase">   </div>
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
                    <div class="as-caption tw-text-grey-base tw-first-letter-uppercase">  </div>
                  </div>
                </div>        
              </div>
            </div>
            </div>
            <div class="tw-rounded tw-h-full tw-bg-background-base margin_top15">
              <div class="d-flex tw-flex-col tw-h-full tw-justify-between">
                <div class="padding15">
                  <div class="as-label-3 tw-text-grey-base mb-1">Total du chiffre d'affaire</div> <div class="as-h6">${separator(parseFloat(accurany).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} €</div>
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
      
      // displayWilayas()
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

  onClick('.detail_edit_company', function(e){
    e.stopPropagation()
    let id = $(this).data('id')

    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideCompany(id, GV.companies, 'delete_document')
    
  })


  function displaySideCompany(id, obj, delete_funtion){
    var side = {id : "form_company", title_add: "Ajouter Une Entreprise" , title_update: "Modifier L'entreprise",  btn_add: "add_company" , btn_update: "update_company", data_id : id }
    var arr = [
      {data_id : 'name',required : 'required' , selector : 'input', type : 'text', label : "Raison sociale", id : '', placeholder: 'Raison sociale'},
      {data_id : 'siret_number', selector : 'input', type : 'text', label : "SIRET", id: '', placeholder: 'SIRET'}, 
      {class: 'grid', data_id : 'country', selector : 'input', type : 'text', label : "Pays", id: '', placeholder: 'Pays' , data_idgrid : 'address', selector1 : 'input', type1 : 'text', label1 : "Adresse", id1: '', placeholder1: 'Adresse'}, 
      {data_id : 'code_postal', selector : 'input', type : 'text', label : "Code postal", id: '', placeholder: 'Code postal'},  
      {class: 'grid', data_id : 'region', selector : 'input', type : 'text', label : "Région", id: '', placeholder: 'Région' ,data_idgrid : 'comune', selector1 : 'input', type1 : 'text', label1 : "Commune", id1: '', placeholder1: 'Commune'},  
      {data_id : 'email' , selector : 'input', type : 'text', label : "E-mail de l'entreprise", id: '', placeholder: "E-mail de l'entreprise"},
      {data_id : 'phone_number' , selector : 'input', type : 'text', label : "Numéro de téléphone", id : '', placeholder: "Numéro de téléphone"},
     
    ]
    if(id == undefined){
      displaySide(arr, side,'side')  
    }else{
      displaySide(arr, side,'side', obj[id], id, delete_funtion)
    }
  }

  onClick('#add_company', async function(){
    if (!check_form("#form_company")) {
      return;
    }
    await addFromForm('/addnewcompany', '#form_company',GV.companies)
    if(GV.page_name == 'companies'){
      $('#list_companies').html('')
      displayCompanies ()  
      PlaceholderisEmpty('#companies')
    }else{
      displayDropdownClient()
    }
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
  })

  onClick('#update_company', async function(){
    let id = $(this).data('id')
    if (!check_form("#form_company")) {
      return;
    }
    await updateFromForm(id,'/updatecompany', '#form_company',GV.companies)
    $('#list_companies').html('')
    displayCompanies ()
    PlaceholderisEmpty('#companies')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
  })

  
onClick('.popup_list_operation', async function () { 

  $('#overlay').css('display', 'block')
  $('.modal-dialog_details').css('display', 'block')
  $('.modal_details').css('display', 'block')
  var id = $(this).data('id')
  GV.id_folder_detail= id
  displayListeOperation(id)
});


async function displayListeOperation(id){
  GV.operations = {}
  await load_items('.modal-body_details', "/loadOperationscompanies" ,id)

  $('.modal-dialog_details').html("")
  html=
   `  <div class="modal-content_details exposant_page">
          <div class="modal-header_details center">
          
          <div class="" > 
            <button id="add_new_operation" data-id="${id}" >
              <span>Ajouter</span>
            </button>                    
          </div>
          <div class="blod text_color3" style="padding: 2px;font-size: 20px; ">${GV.companies[id].name} </div>
          <div id="details_skip" class="exit"><i class="fa fa-times exit" style='color: rgb(165 165 165) !important;'></i></div>
          </div>

          <div class="modal-body_details">

             <div class="modal-body_details_content loading-placeholder">

              </div>

          </div>
  </div>`


  $('.modal-dialog_details').html(html)
  displayContentOperation(id)
}

function displayContentOperation(id){
  
  $('.modal-body_details_content').html("")
  html_header = `
  <div id="table_header" class="line blod text_color1 grid colmn3" style="padding-bottom: 20px;">
    <div>Nom de l'opération</div>
    <div>Date de création</div>                                                        
    <div></div>                       
  </div>
`
var id_company = id
for(let id of Object.keys(GV.operations)){   
  var operation = GV.operations[id]
   html_content = `

  <div  class="table_items grid colmn3 padding_top15 text_color1 cursor center" id="detail_operation"  data-client="${id_company}" data-id="${operation.id}">
   <div class="blod text_color3">${operation.name}</div>     
   <div class=" text_color10">${moment(operation.date_created).format('DD MMMM YYYY h:mm:ss')}</div>
   <div>
   <div class="dropdown">
     <i class="fas fa-ellipsis-v dropbtn dropbtn_operation" data-id="${operation.id}" style="font-size: 20px;padding: 10px;     z-index: 500!important;"></i>
     <div id="myDropdown_operation_${operation.id}" class="dropdown-content">
     <div class="action" id="edit_side_operation"  data-company="${id_company}" data-id="${operation.id}"><i class="far fa-edit light_grey padding5"></i>Modifier</div>
   </div>
 </div>

  </div>


  `
  $('.modal-body_details_content').append(html_content)
}
  $('.modal-body_details_content').prepend(html_header)
}

onClick('.dropbtn_operation', function (e) {
  e.stopPropagation()
  let id= $(this).data("id")
  $('.dropdown-content').removeClass('show')
  document.getElementById(`myDropdown_operation_${id}`).classList.toggle("show"); 
});

onClick('#edit_side_operation', function(e){
  e.stopPropagation()
  var id = $(this).data('id')
  $('#overlayTop').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  var side = {id : "form_operation", title_update: "Modifier L'opération",  btn_add: "add_operation" , btn_update: "update_operation", data_id : id }
  var arr = [{data_id : 'name', class : 'required' , selector : 'input', type : 'text', label : "Nom de l'opération", id : '', placeholder :"Nom" },]
  displaySide(arr, side,'popup', GV.operations[id], id)  
})

onClick('#detail_operation', async function () { 
  var id =  $(this).data('id')
  var id_client =  $(this).data('client')
  displayListFiles(id, id_client)
});
onClick('#back_operation', async function () { 
  var id = $(this).data('id')
  displayListeOperation(id)
});

async function displayListFiles(id, id_client){
  GV.files = {}
  GV.payment = {}
  var id_operation = id
  await load_items('#modal-body_details_content', "/loadfilesOfOperation" ,id_operation)


   $('.modal-dialog_details').html("")
   $('.modal-body_details_content').html("")
   html=
    `
       <div class="modal-content_details exposant_page">
           <div class="modal-header_details">
           <div id="back_operation"  data-id="${id_client}"><i class="fa-solid fa-angle-left " style='color: rgb(165 165 165) !important;'></i></div>
           <div id="importe_bon_de_commade" data-id="${id_client}" data-operation="${id}" class="button text_center cursor bold " style=" font-size: 15px;    color: #1f8a90;  border: 1px solid #1f8990; padding: 15px 35px;">Importer un bon de commande</div>
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
     <div>Prix TTC / €</div>                       
     <div>Reste / €</div>                       
     <div></div>                       
   </div>
 `
   for(let id_file of Object.keys(GV.files)){   
    
     GV.payment = {}
     var file = GV.files[id_file]
     await load_items('#modal-body_details_content', "/loadpayment", file.id)

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
      <div class="blod text_color10" style="${file.cancel_status == '1' ? 'text-decoration: line-through;' : ""}"> ${file.file_number} </div>
      <div class=" text_color10">Le ${date}</div>
      <div class="blod text_color10">Par : ${file.created_by}</div>
      <div class="blod text_color10">${separator(prixTTC.toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} </div>
      <div class="blod text_color10">${file.type == "Facture" ? separator(values.rest_price).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';}) : '/'}</div>
      <div>
      <div class="dropdown" >
          <i class="fas fa-ellipsis-v dropbtn dropbtn_file" data-id="${file.id}" style="font-size: 20px;padding: 10px;    z-index: 500!important; "></i>
          <div id="myDropdown_file_${file.id}" class="dropdown-content"  >
          <div class="action" id="print_crm_file" data-id="${file.id}" data-><i class="fa-solid fa-print light_grey padding5"></i>Imprimer</div>
          <div class="action" id="download_crm_file" data-id="${file.id}"><i class="fa-solid fa-download light_grey padding5"></i>Télécharger</div>
          <div class="action" id="update_invoice_document" data-client=${id_client} data-idparam=${id}  style="display: ${ file.type != "Facture_proforma" || file.invoice == '1' ? 'none !important' : ""}" data-id="${file.id}"><i class="fas fa-edit light_grey padding5"></i>Transformer facture</div>
          <div class="action " id="edit_facture_status"  data-operateur="${id_operation}" data-client="${id_client}" data-id="${file.id}" style="display:${file.type == "Facture" && file.status != 'Payée' ? `${file.cancel_status == '1'  ? 'none !important' : "block"}`: "none !important" }"><i class="far fa-edit light_grey  light_grey padding5"></i>Modifier le paiement</div>
          <div class="action " id="liste_payment" style="display: ${file.cancel_status == '1' ||  file.type != "Facture" ? 'none !important' : ""}"   data-id="${file.id}" style="display:${file.type == "Facture" ? "block" : "none !important" }"><i class="fa-sharp fa-solid fa-list light_grey  light_grey padding5"></i>Liste des paiements</div>
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


 onClick('#print_crm_file', async function (e) { 
  e.stopPropagation()
  let id= $(this).data("id")
  if(GV.files[id].imported == "1" ){
    window.open(`${GV.url}/img/uploads/${GV.files[id].pdf_version}`);
  }else{
    
  // await displayFinalFile(id,`https`)
  // await displayFinalFile(id,`http`, 'print', element)
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



 onClick('.dropbtn_file', function () {
  let id= $(this).data("id")
  $('.dropdown-content').removeClass('show')
  document.getElementById(`myDropdown_file_${id}`).classList.toggle("show"); 
});

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

onClick('#add_new_operation', function(e){
  e.stopPropagation()
  var id = $(this).data('id')
  $('#overlayTop').css('display', 'grid')
  $('#side_menu').css('display', 'grid')
  var side = {id : "form_operation",title_add: "Ajouter Une Nouvelle Opération" , btn_add: "add_operation" ,data_id : id }
  var arr = [{data_id : 'name', class : 'required' , selector : 'input', type : 'text', label : "Nom de l'opération", id : '', placeholder :"Nom" }, {id : 'id_input',  selector : 'div'},]
  displaySide(arr, side,'popup')  
  $('#id_input').html(`<input type="hidden" data-id='id_company' value='${id}'>`)
})


onClick('#add_operation', async function () { 
  if(GV.networkStatus==0)return;
  if (!check_form("#form_operation")) {
    return;
    }
  
  if(GV.page_name == "facturation"){
    $('.popup').css('display','block');
      const inputField = document.querySelector('#input_company');
      const datalistOptions = document.querySelector('#search-company');
      const selectedOption = datalistOptions.querySelector(`[value="${inputField.value}"]`);
      if (selectedOption) {
        var id = selectedOption.getAttribute('data-id');
      }
    await addFromForm('/addnewoperation', '#form_operation',GV.operations)
    $('#side_menu').css('display','none');
    $('#overlay').css('display','none');
    GV.operations = {}
    await load_items('current', "/loadOperationscompanies" , id)
    displayDropdownOperation()
  }else{    
    await addFromForm('/addnewoperation', '#form_operation',GV.operations)
    $('#side_menu').css('display','none');
   displayContentOperation(GV.id_folder_detail)
    $('#overlayTop').css('display','none');
    $('.popup').css('display','none');
  }

});
onClick('#update_operation', async function () { 
  if(GV.networkStatus==0)return;
  var id = $(this).data('id')
  
  await updateFromForm(id,'/updateOperation', '#form_operation',GV.operations)
  displayContentOperation(GV.id_folder_detail)
  $('#side_menu').css('display','none');
  $('#overlayTop').css('display','none');
  $('.popup').css('display','none');

});


  //! ///////////////////////////////////////////////////////////
//! //////////////////!    facturation   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.item_index = 1


GV.initialize_page.facturation = async function(){
  displayPlaceholder()
  searchBar(".table_items") 
  GV.designations = {}
  GV.groups= {}
  GV.companies= {}
  
  await load_items('current', "/loadCompanies" )
  await load_items('current', "/loadDesignations" )

  displaybtnFracture('Facture_proforma')
  displayDropdownClient()
  displayDropdownItems()
  displayEmptyTheInvoice()
  displayInvoiceShow()
  $('.btn_type').removeClass('btn_type_selected')
  $('.btn_nav_devis').addClass('btn_type_selected')
  $(".number_facture").hide()
  $(".number_bon").hide()
  $(".deadline_timeline").hide()
  
  document.getElementById('date_issue').valueAsDate = new Date();
  document.getElementById('payment_deadline').valueAsDate = addMonths(1, new Date())  
  }

  function addMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);
    return date;
  }

$(document).on('change','#facturation_page .deadline_time', async function(){

  let val = $(this).val()
  if(val == '0'){
    $('#payment_deadline').prop( "disabled", false );
  }else{
    $('#payment_deadline').prop( "disabled", true );
    document.getElementById('payment_deadline').valueAsDate = addMonths(parseInt(val), new Date()) 
  }
})
  
  onClick('.btn_type', async function () { 
    $('.btn_type').removeClass('btn_type_selected')
    $(this).addClass('btn_type_selected')
    var file = $(this).data('type')
    displaybtnFracture(file)
    
    if(file == "Facture" ){
      $(".number_bon").show()
      $(".deadline_timeline").show()
      
    }else{
      $(".number_bon").hide()
      $(".deadline_timeline").hide()
    }
    if(file == "Facture_d_avoir"){
      $(".number_facture").show()
    }else{
      $(".number_facture").hide()
    }
    displayInvoiceShow()
    })

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
      <div id="generate_file" data-id="${file}" class="button   text_center cursor bold "  style=" width: 50%; padding: 10px;margin: auto; color: #ffff;    background-image: linear-gradient(98.69deg,#2af5da -32.8%,#3ac3ca 153.9%);"> Générer</div>
    `
      $('.btn_files').html(html)
}

  function displayDropdownClient(){
    $('#facturation_page .filter_clients').html("")
  
    html1 = `<option value="" selected="true" disabled="disabled">Sélectionner un client</option>`
    $('#facturation_page .filter_clients').append(html1)
  
    
     for(let id of Object.keys(GV.companies)){
      var company=GV.companies[id]
      let html = `<option data-value='${company.name}' data-id='${company.id}' data-element='company' value="${company.name}"></option>`
      $('#facturation_page .filter_clients').prepend(html)
     }
  }

  
function displayDropdownItems(){
  $('#facturation_page .filter_items').html("")

  html1 = `<option value="" style="color: #aaaaaa;" selected="true" disabled="disabled">Sélectionnez un article depuis votre bibliothèque </option>`
  $('#facturation_page .filter_items').append(html1)

   for(let id of Object.keys(GV.designations)){
    var designation=GV.designations[id]
    html = `<option value="${designation.id}">${designation.name} ( ${designation.unit_price} € )</option>`
    $('#facturation_page .filter_items').prepend(html)
   }
  
}

$(document).on('change','#facturation_page .filter_clients', async function(){

    const inputField = document.querySelector('#input_company');
    const datalistOptions = document.querySelector('#search-company');

    const selectedOption = datalistOptions.querySelector(`[value="${inputField.value}"]`);
      if (selectedOption) {
        var id = selectedOption.getAttribute('data-id');
        var dataElement = selectedOption.getAttribute('data-element');
       
      }

 console.log(id)
  if($('.filter_clients').val()==''){
    $('#filter_operations').css( "display", 'none' );
    console.log($('.filter_clients').val())
  }else{ 
   
    if(id === undefined || id === null ){
      $('.filter_clients').css('border', '1px solid red')
      $('.message_not_find').css('display', 'block')
      $('#filter_operations').css( "display", 'none' ); 
      GV.operations = {}
    }else{
      $('.filter_clients').css('border', 'solid 1px #364d6c')
      $('.message_not_find').css('display', 'none')
      $('#filter_operations').css( "display", 'block' ); 
      GV.operations = {}  
    
      await load_items('current', "/loadOperationscompanies" , id)
    }
    displayDropdownOperation()  
  }
})


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
                <option value="€">€</option>
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

function displayInvoiceShow(){
  $('#invoice_show').html("")

if( $("#total_file").val()== ''){
  var total_file = '0'
}else {
  var total_file = $("#total_file").val()
}
if($('.filter_clients').val() == ''){
  var id_companies = ''
}else{
  for(var i = 0 ; i < Object.values(GV.companies).length; i++){
    if(Object.values(GV.companies)[i].hasOwnProperty("name") && Object.values(GV.companies)[i].name === $('.filter_clients').val()) {
      var id_companies = Object.values(GV.companies)[i].id    
    }
  } 
}

 var file = {total:  total_file,
             tva:  $("#tva_value").val(), 
             id_folder: id_companies, 
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
      
        <h2 class="name"><div>${file.id_company == null || file.id_company == undefined ? " " : GV.companies[file.id_company].raison_social} ${file.id_company == null || file.id_company == undefined ? " " : GV.companies[file.id_company].name}</div></h2>
        <div class="address">${file.id_company == null || file.id_company == undefined  ? " " : GV.companies[file.id_company].address} ${file.id_company == null || file.id_company == undefined ? " " :GV.companies[file.id_company].wilaya}</div>
        <div class="email">${file.id_company == null || file.id_company == undefined  ? " " :GV.companies[file.id_company].phone}</div>
        
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
          <td colspan="2">${file.escompte_unity =='€' ? separator(parseFloat(file.escompte).toFixed(2)) : file.escompte} ${file.escompte_unity}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td colspan="2">Total HT</td>
          <td colspan="2">${file.total.replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}€</td>
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
        var reduce = `<div style="font-size: 10px;color: #4e4e4e;" >${amount_reduce} €  </div> ${$(`#reduce${i}`).val()}`
      }else{
        var reduce = `${$(`#reduce${i}`).val()}`
      }
      let html = `
      <tr style="font-weight: 600 !important;">
        <td class="desc" style="display: none !important">${number_item++}</td>
        <td class="desc" style="width: auto;padding: 5px;"><div style="color: #9e9e9e;font-size: 9px;">${$(`#reference${i}`).val()} </div>${$(`#description${i}`).val()} </td>
        <td class="qty" style="max-width: 70px !important;">${$(`#unit${i}`).val()}</td>
        <td class="unit">${separator(parseFloat($(`#unit_price${i}`).val()).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})}€</td>
        <td class="qty" style="max-width: 70px !important; padding: 5px;">${$(`#quantity${i}`).val()}</td>
        <td class="qty" style="max-width: 70px !important;padding: 5px;">${$(`#reduce_unity${i}`).val() == '€' ? separator(parseFloat($(`#reduce${i}`).val()).toFixed(2).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})):  reduce } ${$(`#reduce_unity${i}`).val()}</td>
        <td class="total" style="padding: 5px;">${separator(parseFloat($(`#total_price${i}`).val()).toFixed(2)).replace(/[.,]/g, function(x) {  return x == ',' ? '.' : ',';})} €</td>
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

  if(escompte_unity == '€'){
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
  if(reduce_unity == '€'){
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
  if(reduce_unity == '€'){
    var total = (parseFloat(quantity)*parseFloat(unit_price))-(parseFloat(reduce)*parseFloat(quantity))
  }if(reduce_unity == '%'){
    var total = (parseFloat(quantity)*parseFloat(unit_price))-(((parseFloat(reduce)*parseFloat(unit_price))/100)*parseFloat(quantity))
  }else{
  }

  $(`#total_price${id}`).val(total)
  displayTotalInvoice()
  displayInvoiceShow()
})



onClick('#add_new_operation_facturation', function(){
  $('#overlay').css('display', 'grid')
  $('#side_menu').css('display', 'grid')

    const inputField = document.querySelector('#input_company');
    const datalistOptions = document.querySelector('#search-company');

    const selectedOption = datalistOptions.querySelector(`[value="${inputField.value}"]`);
      if (selectedOption) {
        var dataId = selectedOption.getAttribute('data-id');
        console.log(dataId)
      }
  var side = {id : "form_operation",title_add: "Ajouter Une Nouvelle Opération" , btn_add: "add_operation" ,data_id : dataId }
  var arr = [{data_id : 'name', class : 'required' , selector : 'input', type : 'text', label : "Nom de l'opération", id : '', placeholder :"Nom" }, {id : 'id_input',  selector : 'div'},]
  displaySide(arr, side,'popup')  
  $('#id_input').html(`<input type="hidden" data-id='id_company' value='${dataId}'>`)

})




  //! ///////////////////////////////////////////////////////////
//! //////////////////!    article   //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.article = async function(){
  searchBar(".table_items")
  displayPlaceholder()
  await load_items('#article', "/loadDesignations" )
  displayDesignation()

  }

  function displayDesignation(){
    for(let id of Object.keys(GV.designations)){
      let designation = GV.designations[id]
      let html = `
              <div  class="table_items grid colmn4 padding_top15 text_color1 center ">
                    <div class=" text_color3">${designation.name}</div>       
                    <div class=" text_color10">${designation.unit_price} €</div>    
                    <div class=" text_color10">${designation.unity}</div>  
                    <div>
                      <div class="dropdown">
                        <i class="fas fa-ellipsis-v dropbtn dropbtn_designation" data-id='${designation.id}'  style="font-size: 20px;padding: 10px;"></i>
                        <div id="myDropdown_designation_${designation.id}" class="dropdown-content">
                        <div class="action detail_edit_designation" data-id="${designation.id}"><i class="fa-solid fa-info light_grey padding5"></i>Modifier</div>
                        <div class="action delete_designation" data-id='${designation.id}'><i class="fas fa-trash-alt light_grey padding5"></i>Supprimer</div>
                      </div>
                    </div>
              </div>
     
      `
      $('#list_designation').append(html)
    }
  }
  onClick('.dropbtn_designation', function (e) {
    e.stopPropagation()
    let id= $(this).data("id")
    $('.dropdown-content').removeClass('show')
    document.getElementById(`myDropdown_designation_${id}`).classList.toggle("show"); 
  });


  onClick('#add_new_article', function(){
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideArticles()
  })

  function displaySideArticles(id, obj, remove){
    var side = {id : "form_designation", title_add: "Ajouter Un Désignation" , title_update: "Modifier Le Désignation",  btn_add: "add_designation" , btn_update: "update_designation", data_id : id }
    var arr = [
      {class:"grid", data_id : 'name',  selector : 'input', type : 'text', label : "Titre de la désignation", id : '', placeholder :"Titre" ,data_idgrid : 'reference', class1 : 'required' , selector1 : 'input', type1 : 'text', label1 : "Référence de la désignation", id1 : '', placeholder1 :"Référence" } ,
      {data_id : 'description', class : 'required' , selector : 'textarea', type : 'text', label : "Description", id : '', placeholder :"Description" } ,
      {data_id : 'unit_price', class : 'required' , selector : 'input', type : 'number', label : "Prix unitaire", id : '', placeholder :"Prix" } ,
      {data_id : 'unity', required : 'required' , selector : 'select', type : 'text', label : "Unité", id: '', option : [{value : "Unité" , html : 'Unité'}, {value : "Gramme" , html : 'Gramme'}, {value : "Heure" , html : "Heure"}, {value : "Jour" , html : "Jour"}, {value : "Forfait" , html : "Forfait"}, {value : "Année" , html : "Année"}, {value : "Caractère" , html : "Caractère"}, {value : "Ligne" , html : "Ligne"}, {value : "Licence" , html : "Licence"}, {value : "Article" , html : "Article"}, {value : "Mois" , html : "Mois"}, {value : "Kilogramme" , html : "Kilogramme"}, {value : "Kilomètre" , html : "Kilomètre"}, {value : "Litre" , html : "Litre"}, {value : "Lot" , html : "Lot"}, {value : "Mètre" , html : "Mètre"}, {value : "Mètre carré" , html : "Mètre carré"}, {value : "Mètre cube" , html : "Mètre cube"}, {value : "Mètre linéaire" , html : "Mètre linéaire"}, {value : "Personne" , html : "Personne"}, {value : "Tonne" , html : "Tonne"}, {value : "Mot" , html : "Mot"}, {value : "Page" , html : "Page"}, {value : "Feuillet" , html : "Feuillet"}, {value : "Minute" , html : "Minute"},]},   

    ]
    if(id == undefined){
      displaySide(arr, side,'side')
    }else{
      displaySide(arr, side,'side', obj[id], id, remove)
    }
    
  }

  onClick('#add_designation', async function(){
    if (!check_form("#form_designation")) {
      return;
    }
    await addFromForm('/addnewdesignation', '#form_designation',GV.designations)
    
    console.log(GV.designations)
    if(GV.page_name == "facturation"){
      $('#overlay').css('display', 'none')
      $('#side_menu').css('display', 'none')
      displayDropdownItems()
    }else{
      
      $('#list_designation').html('')
      displayDesignation()
      PlaceholderisEmpty('#article')
      $('#overlay').css('display', 'none')
      $('#side_menu').css('display', 'none')
  }
  })
  onClick('.detail_edit_designation', function(e){
    e.stopPropagation()
    let id = $(this).data('id')
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideArticles(id, GV.designations)
   
  })
  onClick('#update_designation', async function(){
    let id = $(this).data('id')
    await updateFromForm(id,'/updatedesignation', '#form_designation',GV.designations)
    $('#list_designation').html('')
    displayDesignation()
    PlaceholderisEmpty('#article')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
  })

  onClick('.delete_designation', async function(){
    let id = $(this).data('id')
    $('.popup_problem').css('display','block');
    $('.popup_problem .message').html("Êtes-vous sûr de vouloir supprimer cette désignation")
    $('.popup_problem .popup_footer').html(`<div class="btn btn-outline-success ok" style="font-weight: 600;"> Non </div> <div id="valide_delete_designation" data-id=${id} class="btn" style="font-weight: 600;"> Oui </div>`)
  })


  onClick('#valide_delete_designation', async function(){
    let id = $(this).data('id')
    await delete_item(id , '/deletedesignation',GV.designations)
    $('#list_designation').html('')
    $('.popup_problem').css('display','none');
    displayDesignation()
    PlaceholderisEmpty('#article')
    $('.popup_problem').css('display','none');
  })

  //! ///////////////////////////////////////////////////////////
//! //////////////////!    users   //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.users = async function(){
  displayPlaceholder()


  }
  //! ///////////////////////////////////////////////////////////
//! //////////////////!    setting   //////////////////////////
//! ///////////////////////////////////////////////////////////



GV.initialize_page.setting = async function(){
  GV.task_item = 1
  searchBar(".table_items")
  await load_items('#general-setting', "/loadListTasks")
  displayListTasks()

  $('#invoice-setting').hide()    
  $('#general-setting').show()
  $('.setting_btn').removeClass('selected_btn')
  $('.general-setting').addClass('selected_btn')
  }

  onClick('.setting_btn', async function () { 
    $('.setting_btn').removeClass('selected_btn')
    $(this).addClass('selected_btn')
    let dataId = $(this).data('id')
    if( dataId == 'general-setting' ){
      $('#general-setting').show()
      $('#invoice-setting').hide()
    }else{
      $('#general-setting').hide()
      $('#invoice-setting').show()
    }
  })
  
    
  function displayListTasks(){
    for(let id of Object.keys(GV.tasklists)){
      let tasklist = GV.tasklists[id]
      
      if(tasklist.is_deleted == "1")continue;
      let html = `
      <div  class="table_items grid colmn4 padding_top15 text_color1 center ">
          <div class="first_latter" style="left: 0px; font-weight: 500; padding: 5px 10px; background-color: #53c5a0;">${tasklist.title.charAt(0).toUpperCase()}</div> 
          <div class=" text_color3">${tasklist.title}</div>       
          <div class=" text_color10">${tasklist.created_by}</div>       
          <div class=" text_color10">${moment(tasklist.created_date).format('DD/MM/YYYY HH:mm')}</div> 
          <div>
            <div class="dropdown">
              <i class="fas fa-ellipsis-v dropbtn dropbtn_tasklist" data-id="${tasklist.id}" style="font-size: 20px;padding: 10px;"></i>
                <div id="myDropdown_tasklist_${tasklist.id}"  class="dropdown-content">
                <div class="action" id="edit_tasklist" data-id="${tasklist.id}"><i class="fa-solid fa-info light_grey padding5"></i>Modifier</div>
                <div class="action" id="delete_tasklist" data-id="${tasklist.id}"><i class="fas fa-trash-alt light_grey padding5"></i>Supprimer</div>
                </div>
            </div>
          </div>  
      </div>      `
      $('#list_tasks').prepend(html)
    }
  }
  onClick('.dropbtn_tasklist', function (e) {
    e.stopPropagation()
    let id= $(this).data("id")
    $('.dropdown-content').removeClass('show')
    document.getElementById(`myDropdown_tasklist_${id}`).classList.toggle("show"); 
  }); 

  
  onClick('#edit_tasklist', async function(e){
    e.stopPropagation()
    let id = $(this).data('id')
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    GV.tasks = {}
    await load_items('current', "/loadTasks", id)
    displaySideListTasks(id, GV.tasklists)
 
  })
  
  onClick('#add_list_tasks', function(){
    $('#overlay').css('display', 'grid')
    $('#side_menu').css('display', 'grid')
    displaySideListTasks()
  })

  function displaySideListTasks(id, obj, remove){
    var side = {id : "form_general_task", title_add: "Ajouter Une liste" , title_update: "Modifier La Liste",  btn_add: "add_listtasks" , btn_update: "update_listtasks", data_id : id }
    var arr = [
      {data_id : 'title',uniqueClass :'form_listtasks' , class : 'required' , selector : 'input', type : 'text', label : "Nom de la liste", id : 'title_list_tasks', placeholder :"Titre" },
      {selector:'div', id:"detail_task_list"}
    ]
    if(id == undefined){
      displaySide(arr, side,'side')
      displayDetailList()
    }else{
      displaySide(arr, side,'side', obj[id], id, remove)
      GV.task_element = 1
      displayDetailList(id)

    }
  }

  function displayDetailList(id){
    
    GV.add_tasks_array = []    
    GV.delete_tasks_array = [] 
    GV.edit_tasks_array = []
    if( id == undefined ){
           
      $('#detail_task_list').html('')
      let html = `
      
      <div class="input-container">
       <div class="d-flex justify-between"> <div class="label">Ajouer une tâche *</div> <div class="insert_new_element cursor" style="color:#60cfff; font-size: 35px; font-weight: 600;padding: 20px 5px; "> + </div></div>
        <div id="details_list">
        
        </div>
      </div>
      
      `

      $('#detail_task_list').html(html)
    }else{
      $('#detail_task_list').html('')
      let html = `
      
      <div class="input-container">
       <div class="d-flex justify-between"> <div class="label">Ajouer une tâche *</div> <div class="insert_new_element cursor" style="color:#60cfff; font-size: 35px; font-weight: 600;padding: 20px 5px; "> + </div></div>
        <div id="details_list">
        </div>
      </div>
      `
      $('#detail_task_list').html(html)
      $('#details_list').html('')
      for(let id of Object.keys(GV.tasks)){
        let item_index = GV.task_element++
        let task = GV.tasks[id]
        let content = `
        <div class="input-container item_content content_task_${item_index} content_${task.id}"  data-id='${task.id}' style="border: 1px solid #8080808a;border-radius: 5px;padding: 10px; margin: 5px;">
          <div style=" text-align: end;"><i class="fa-solid fa-trash delete_task cursor" data-id='${task.id}' data-index="${item_index}"></i> </div>
          <div class="label">Titre de la tâche *</div>
          <input data-id="title" id="title${task.id}" class="content_editable required" placeholder="Ex: Contrôle des affichages plastifiés salle d'attente..." value="${task.title}"></input>
          <div class="label">Description *</div>
          <textarea data-id="comment"   id="comment${task.id}" class="content_editable" placeholder="">${task.comment}</textarea>
        </div>
        `
        $('#details_list').append(content)
        GV.edit_tasks_array.push(task.id)
      }
    }
  }

    
  onClick('.insert_new_element', function(){
    let item_index = GV.task_item++
    GV.add_tasks_array.push(item_index)
    let html = `
    <div class="input-container item_content content_task_${item_index} content_${item_index}" style="border: 1px solid #8080808a;border-radius: 5px;padding: 10px; margin: 5px;">
      <div style=" text-align: end;"><i class="fa-solid fa-trash remove_task cursor" data-id="${item_index}"></i> </div>
      <div class="label">Titre de la tâche *</div>
      <input data-id="title" id="title${item_index}" class="content_editable required" placeholder="Ex: Contrôle des affichages plastifiés salle d'attente..."></input>
      <div class="label">Description *</div>
      <textarea data-id="comment"  id="comment${item_index}" class="content_editable" placeholder=""></textarea>
    </div>
    `
    $('#details_list').prepend(html)

  })

  onClick('.remove_task', async function () { 
    let data = $(this).data('id')
    $(`.content_task_${data}`).remove();
    let index = GV.add_tasks_array.indexOf(data);
    if (index !== -1) { 
      GV.add_tasks_array.splice(index, 1); 
    }
  })

  onClick('.delete_task', async function () { 
    let id = $(this).data('id')
    let index = $(this).data('index')
    GV.delete_tasks_array.push(id)
    let remove = GV.edit_tasks_array.indexOf(id);
    if (index !== -1) { 
      GV.edit_tasks_array.splice(remove, 1); 
    }
    
    $(`.content_task_${index}`).remove();
  })

  onClick('#add_listtasks', async function () { 
    if (!check_form(".form_listtasks")) {
      return;
    }
    var ObjArr = []
    let item = $("#details_list").find(".item_content")
    if(item.length == 0){
      var obj1 = 'empty'
    }else{
      for( i= 1 ; i<= parseInt(GV.task_item) ; i++){
        if($(`.content_${i}`)[0]){
          let obj = {
            title: $(`#title${i}`).val(),
            comment: $(`#comment${i}`).val(),
          }
          ObjArr.push(obj)
        }else{  
        }
      }
      var obj1 = ObjArr.reduce((acc, element, index) => {
        acc[index+1] = element;
        return acc;
      }, {}); 
    }
    let obj = { title: $(`#title_list_tasks`).val(),important : 1 }
    

    await addFromObj('/addnewtask_listTasks',  {obj ,obj1}, GV.tasklists, 'Ajouté(e)')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')    
    $('#list_tasks').html("")
    displayListTasks()
  })
  
  onClick('#update_listtasks', async function () { 
    if (!check_form(".form_listtasks")) {
      return;
    }
    let id = $(this).data('id')
    var ObjArrAdd = []
    var ObjArrEdit = []
    let item = $("#details_list").find(".item_content")
    let obj = { title: $(`#title_list_tasks`).val()}
   
    if(item.length == 0){
      var objectUpdate = 'empty'
    }else{
      for(let i of GV.add_tasks_array){
        if($(`#details_list .content_${i}`)[0]){
          let obj = {
            title: $(`#title${i}`).val(),
            comment: $(`#comment${i}`).val(),
          }
          ObjArrAdd.push(obj)
        }else{  
        }
      }for(let edit of GV.edit_tasks_array){
        if($(`#details_list .content_${edit}`)[0]){
          let objEdit = {
            id : edit,
            title: $(`#title${edit}`).val(),
            comment: $(`#comment${edit}`).val(),
          }
          ObjArrEdit.push(objEdit)
        }else{  
        }
      }
      var objectAdd = ObjArrAdd.reduce((acc, element, index) => {
        acc[index+1] = element;
        return acc;
      }, {}); 

      var objectUpdate = ObjArrEdit.reduce((acc, element, index) => {
        acc[index+1] = element;
        return acc;
      }, {}); 
    }
    let objectDelete = GV.delete_tasks_array
    let data = {obj, objectUpdate, objectDelete, objectAdd, id} 
    await addFromObj('/updatenewtask_listTasks', data, GV.tasklists, 'Modifié(e)')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
    $('#list_tasks').html("")
    displayListTasks()
  })
  

  onClick('#delete_tasklist', async function(){
    let id = $(this).data('id')
    $('#overlay').css('display', 'none')
    $('#side_menu').css('display', 'none')
    $('.popup_problem').css('display','block');
    $('.popup_problem .message').html("Êtes-vous sûr de vouloir supprimer cette liste")
    $('.popup_problem .popup_footer').html(`<div class="btn btn-outline-success ok" style="font-weight: 600;"> Non </div> <div id="valide_delete_liste" data-id=${id} class="btn" style="font-weight: 600;"> Oui </div>`)
  })

  onClick('#valide_delete_liste', async function(){
    let id = $(this).data('id')
    await updateFromValues(id,'/deleteTaskListe', GV.tasklists , "remove")
    $('#list_tasks').html("")
    displayListTasks()
    PlaceholderisEmpty('#list_tasks')
    $('.popup_problem').css('display','none');
  })

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
$(document).on('change','#validatedDocumentFile', function(){
  let file = this.files[0];
  upload_image(file,'.validatedDocumentFile' , (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.document_name = e.file_name;
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


onClick('#overlay, .exit, #valid_not', function(){
  $('#overlay').css('display', 'none')
  $('#overlayTop').css('display', 'none')
  
  $('#side_menu').removeClass('left20vw')
  $('#side_menu, #right_side_menu').css('display', 'none') 
  $('#side_menu_container').css('display', 'none') 
  $('.modal-dialog_details').css('display', 'none')
  $('.modal_add').css('display', 'none')
})
onClick('.ok', async function () {
  $('.popup').css('display', 'none')
  $('.popup_alert').css('display', 'none')
  $('.popup_problem').css('display', 'none')
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


