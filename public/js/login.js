onClick('#login',async function() {
  if (!check_form("#form_login")) {
    error="Veuillez renseigner tous les champs.";
    html = `<div class="alert">${error}</div>`
    $('.massage').html(html)
    return;
    }
  login()
});

async function login(){
   
    var email= $("#email").val()
    var password= $("#password").val()
    var type= "admin"
    var data={email,password,type}
    var option = {
        type: "POST",
        url: `/auth`,
        cache: false,
        data: data,
      };
      console.log(data)
    var receved_data = await $.ajax(option);
    console.log(receved_data)
    if(receved_data=='ok'){

      window.location.href = '/app'

    }if(receved_data=='mistak in password'){
      $('.massage').html(" ")
      error="Le mot de passe que vous avez inséré est incorrect.";
      html = `<div class="alert">${error}</div>`
      $('.massage').html(html)

    }if(receved_data=='/'){
        $('.massage').html(" ")
        error="Ce nom d'utilisateur n'éxiste pas ou le compte a était désactivé.";
        html = `<div class="alert">${error}</div>`
        $('.massage').html(html)
        
    }else{
      
    }
    console.log(data)
    
} 

onClick('#logout', async function(){

    var logOut = {stat:'true'}
  
    var options = {
      type: "POST",
      url: `/logOut`,
      cache: false,
      data: logOut,
    };
    var received_data = await $.ajax(options);
    if(received_data.success){
      window.location.href='/admin'
    } 
  });


$('#password, body').bind('keypress', function(e) {
  if(e.keyCode==13){
    event.preventDefault();
    $('#login').click();
  }
});
