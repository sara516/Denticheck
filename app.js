
const http = require('http');
const express = require('express');
const fs = require('fs');
const {join} = require('path');
const session = require('express-session');
const body_parser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./db');
const multer=require('multer');
var nodemailer = require('nodemailer');
const html_to_pdf = require('html-pdf-node');
var JsBarcode = require('jsbarcode');
const puppeteer = require('puppeteer');

let app = express();
const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer);

let clients = {users: {},managers:{}}
const update_rooms = (socket, data) => { clients[data.room][data.id] = socket.id; console.log({clients});}

const https = require('https');
const fetch = require("node-fetch");
const { info } = require('console');
const cookieParser= require('cookie-parser')
const base_url = path.join(__dirname,'public/');
const base_url_admin = path.join(__dirname,'/');
url = 'http://localhost'
api = {}
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true}));
app.use(express.static(join(__dirname, 'public')));
app.use(cookieParser());

io.on('connection', function(socket){
  socket.on('join', (data) => {
    console.log('joined', data)
    update_rooms(socket, data);
    socket.join(data.room);
  });
});


app.use(session({
  secret:'mysecret',  
  resave: false, 
  saveUninitialized: true, 
  cookie:{
      secure:false, 
      maxAge: 1000*60*60*24*30 
  }
}));
const upload_dir = join(__dirname,'public/img/uploads/');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/img/uploads/'),
    filename:    (req, file, cb) => cb(null, Date.now()+file.originalname)
});
  
const upload = multer({storage});
  
app.post(`/uploads`, upload.single('file'), (req, res, next) => {
    let file = req.file;
    let result = {};
    result['file_name'] = file.filename;  
    res.send(result);
});




// app.get(, async (req, res,) => { 
//     res.sendFile(base_url+'/login.html');
// });

app.get([`/app`,`/`],  async (req, res,) => { 
    if(req.session.loggedin){
        if(req.session.CurrentUser.type == 'admin'){
          res.sendFile(base_url_admin+'./admin.html');
        }if(req.session.CurrentUser.type == 'assistant'){
          res.sendFile(base_url_admin+'./assistant.html');
        }if(req.session.CurrentUser.type == 'administration'){
          res.sendFile(base_url_admin+'./administration.html');
        }
    }
    else{
        res.redirect("/login")
    }
});


app.get([`/login`], async (req, res,) => { 
    res.sendFile(base_url+'/login.html');
});

  app.get("/inscription_devenement_en_ligne/:id", async (req, res,) => { 
    var id=req.params.id;   
    let file=fs.readFileSync(path.join(base_url +'/site.html')).toString();
    file+=`<script> GV.selected_event_id="${id}";</script>`;
    res.send(file);
  });

//! ///////////////////////////////////////////////////////////
//! /////////////!    authentification     ////////////////////
//! ///////////////////////////////////////////////////////////



app.post('/auth', async (req, res) => {
    
    try{
      var {email, password, type}=req.body;
      if(type == "admin"){
        console.log(email)
        var user = await db.select("*","users",  {email: email , is_disabled: '0'});
        console.log(user);
        // console.log(user[0].hash);
        if(user.length != 0){
          const validPass = await bcrypt.compare(password, user[0].password);
          if (validPass == true) {    
              req.session.email = email;
              req.session.id = user[0].id;
              req.session.loggedin = true;
              req.session.CurrentUser = user[0]
              res.cookie("user_id",user[0].id)
              res.send('ok')             
          }else{
            res.send('mistak in password')  
          }
        }else{
          res.send('/');
        }
            
      }      
   }
   catch(e) {
       console.log(e)
       res.send('/');
   }
});


app.post(`/logOut`, async (req, res,) => { 
    var logOut= req.body
    console.log(logOut)
    if(logOut.stat=='true'){
        req.session.email = 'undefined'
    }
    res.send({"success":true });
});



app.post('/register', async (req, res) =>{
    try{
        const {email, password, username}=req.body;
        const hash = await bcrypt.hash(password, 10);
        console.log(hash)
        await db.insert("accounts", {email: email, hash: hash, username:username});
        res.status(200).json('all good');
    }catch(e) {
        console.log(e)
        res.status(500).send('something broke!');
    }
    
 });


//! ///////////////////////////////////////////////////////////
//! /////////////!    Function     ////////////////////
//! ///////////////////////////////////////////////////////////


 
app.post('/send_session_name', async (req, res,) => {

    res.send( {"userid": req.session.email });
});


app.post('/loadCurentUserCompany', async (req, res,) => {
 
    let array_companies = []
    let user = await db.select('*', 'users', {id: req.session.CurrentUser.id}, "indexed");
    let group = await db.select('*', 'groups', {id: req.session.CurrentUser.id_group}, "indexed");
    var companies = await db.select('*', 'companies', {}, "indexed");

    for(let id of Object.values(req.session.CurrentUser.id_companies)){      
      for(let element of Object.values(companies)){
        if(element.id != id )continue
          array_companies.push(element)
      }    
    }
    res.send({"success":true, "user": user , "companies": array_companies, "group" : group});
});

app.post('/loadListTasks', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'tasklists' 
    result[table_name] = await db.selectOR('*', table_name,where ,"indexed");
    res.send({"reponses": result , "success":true });
});
app.post('/loadLicences', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'licences' 
    result[table_name] = await db.selectOR('*', table_name,where ,"indexed");
    res.send({"reponses": result , "success":true });
});

app.post('/loaddocument', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'documents' 
    result[table_name] = await db.select('*', table_name, where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loadTasks', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'tasks' 
    result[table_name] = await db.select('*', table_name, where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loadfiles', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'files' 
    result[table_name] = await db.select('*', table_name, where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loadfile', async (req, res,) => {
    let result = {};
    let {where} = req.body
    result['files'] = await db.select('*', 'files', where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loadpayment', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'payment' 
    result[table_name] = await db.select('*', table_name, where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loaditems', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'items' 
    result[table_name] = await db.select('*', table_name, where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loadDesignations', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'designations' 
    result[table_name] = await db.select('*', table_name, where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loadOperationscompanies', async (req, res,) => {
    let result = {};
    let {where} = req.body
    let table_name = 'operations' 
    result[table_name] = await db.select('*', table_name, where, "indexed");
    res.send({"reponses": result , "success":true });

});
app.post('/loadCompaniesGroupes', async (req, res,) => {
    let result = {};
    let {where} = req.body
    result['companies'] = await db.select('*', 'companies', where, "indexed");
    result['groups'] = await db.select('*', 'groups', where, "indexed");
    res.send({"reponses": result , "success":true});

});


app.post(`/addnewgroup`, async (req, res,) => {

  let {obj} = req.body; 
  let user_id = req.session.CurrentUser.id 
  obj['id_user'] =  user_id
  console.log(req.session.CurrentUser.id,req.session.CurrentUser.id_companies, obj )
  try {
      var id= await db.insert('groups', obj);
      var result = await db.select('*', 'groups', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})
 
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/addnewdesignation`, async (req, res,) => {

  let {obj} = req.body; 
  let user_id = req.session.CurrentUser.id 
  obj['id_user'] =  user_id
  console.log(req.session.CurrentUser.id,req.session.CurrentUser.id_companies, obj )
  try {
      var id= await db.insert('designations', obj);
      var result = await db.select('*', 'designations', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})
 
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/addnewtask_listTasks`, async (req, res,) => {

  let {obj, obj1} = req.body; 
  
  let name = req.session.CurrentUser.first_name + " " + req.session.CurrentUser.last_name 
  let id_user = req.session.CurrentUser.id
  let id_company = req.session.CurrentUser.id_companies
  let id_group = req.session.CurrentUser.id_group
  
  obj['created_by'] =  name.toString()
  obj['user_id'] =  id_user
  obj['group_id'] =  id_group
  obj['company_id'] =  id_company
  try {
      var id= await db.insert('tasklists', obj);
      var result = await db.select('*', 'tasklists', {id: id}, "indexed");
      console.log(obj1)
      if(obj1 == "empty"){

      }else{
        for(let element of Object.values(obj1)){
          element['id_list'] =  id
          element['created_by'] =  name.toString()
          await db.insert('tasks', element);
        }
      }
   
      res.send({"reponses":result, "id":id,"ok":true})
 
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/updatenewtask_listTasks`, async (req, res,) => {

  let {obj, objectDelete, objectUpdate, objectAdd, id}  = req.body; 
  console.log(obj, objectUpdate, objectDelete, objectAdd, id)
  
  let name = req.session.CurrentUser.first_name + " " + req.session.CurrentUser.last_name 
  try {
      db.update('tasklists',obj, {id});
      var result = await db.select('*', 'tasklists', {id: id}, "indexed");
      if(objectDelete == undefined){
      }else{
        for(let element of Object.values(objectDelete)){
          await db.delete('tasks',{id: element});
        }
      }if(objectAdd == undefined){
      }else{
        for(let elementadd of Object.values(objectAdd)){
          elementadd['id_list'] =  id
          elementadd['created_by'] =  name.toString()
          await db.insert('tasks', elementadd);
        }
      }if(objectUpdate == undefined){

      }else{
         for(let elementupdate of Object.values(objectUpdate)){
          let id = elementupdate.id
          delete elementupdate.id;
          db.update('tasks',elementupdate, {id});
        }
      }
   
      res.send({"reponses":result, "id":id,"ok":true})
 
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});

app.post(`/addnewcompany`, async (req, res,) => {

  let {obj} = req.body; 
  obj['id_user'] = req.session.CurrentUser.id  
  
  console.log(req.session.CurrentUser.id,req.session.CurrentUser.id_companies, obj )
  try {
      var id= await db.insert('companies', obj);
      var result = await db.select('*', 'companies', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})
 
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});

app.post(`/addnewoperation`, async (req, res,) => {

  let {obj} = req.body; 
  obj['id_user'] = req.session.CurrentUser.id  
  obj['id_current_company'] = req.session.CurrentUser.id_companies
  try {
      var id= await db.insert('operations', obj);
      var result = await db.select('*', 'operations', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})
 
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});

app.post(`/addnewdocument`, async (req, res,) => {

  let {obj} = req.body; 
  obj['id_user'] = req.session.CurrentUser.id  
  obj['id_company'] = req.session.CurrentUser.id_companies
  console.log(req.session.CurrentUser.id,req.session.CurrentUser.id_companies, obj )
  try {
      var id= await db.insert('documents', obj);
      var result = await db.select('*', 'documents', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})
 
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});

app.post(`/updatedocument`, async (req, res,) => {

  let {id, obj} = req.body;  
  try {
    await db.update('documents',obj, {id} );
      var result = await db.select('*', 'documents', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})

    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/updateOperation`, async (req, res,) => {

  let {id, obj} = req.body;  
  try {
    await db.update('operations',obj, {id} );
      var result = await db.select('*', 'operations', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})

    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/updatedesignation`, async (req, res,) => {

  let {id, obj} = req.body;  
  try {
    await db.update('designations',obj, {id} );
      var result = await db.select('*', 'designations', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})

    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/updatecompany`, async (req, res,) => {

  let {id, obj} = req.body;  
  try {
    await db.update('companies',obj, {id} );
      var result = await db.select('*', 'companies', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})

    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/updategroups`, async (req, res,) => {

  let {id, obj} = req.body;  
  try {
    await db.update('groups',obj, {id} );
      var result = await db.select('*', 'groups', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})

    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});

app.post(`/deletedocument`, async (req, res,) => {

  let {id, obj} = req.body;  
  try {
    await db.update('documents',obj, {id} );
      var result = await db.select('*', 'documents', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})

    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/deleteTaskListe`, async (req, res,) => {

  let {id} = req.body;  
  try {
    await db.update('tasklists',{is_deleted : "1"} ,{id} );
      var result = await db.select('*', 'tasklists', {id: id}, "indexed");
      res.send({"reponses":result, "id":id,"ok":true})

    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/deletedesignation`, async (req, res,) => {

  let {id} = req.body;  
  try {
      await db.delete('designations',{id});
      res.send({"ok":true});
      console.log('delete function')
      
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});
app.post(`/deleteTasks`, async (req, res,) => {

  let {id} = req.body;  
  try {
      await db.delete('tasks',{id});
      res.send({"ok":true});
      console.log('delete function')
      
    } catch (error) {
      console.log(error)      
      res.send({"ok":false, "error":error});
  }
});


app.post('/search_items', async (req, res,) => {
    let result = {};
    let {table_name, like, row, where} = req.body
    result[table_name] = await db.search( table_name, row, where,like,  "indexed");
    res.send({"reponses":result, "success":true });

});


// app.post('/load_items', async (req, res,) => {
//   let result = {};
//   let {table_name, where} = req.body
//   result[table_name] = await db.select('*', table_name, where, "indexed");
//   res.send({"reponses":result, "success":true });

// });


// app.post(`/add_to_database`, async (req, res,) => {

//   let {obj, table_name } = req.body;  
//   try {
//       var id= await db.insert(table_name, obj);
//       var result = await db.select('*', table_name, {id: id}, "indexed");
//       res.send({"reponses":result, "id":id,"ok":true})
 
//     } catch (error) {
//       console.log(error)      
//       res.send({"ok":false, "error":error});
//   }
// });




// app.post(`/update_to_database`, async (req, res,) => {
//   let {id, obj, table_name } = req.body;
//   try {
//       await db.update(table_name,obj, {id} );
//       var result = await db.select('*', table_name, {id: id}, "indexed");
//       res.send({"reponses":result, "id":id,"ok":true})

//   } catch (error) {
//       res.send({"ok":false, "error":error});
//   }
// });

// app.post(`/delete_from_database`, async (req, res,) => {
//   let {id,table_name} = req.body;
//   console.log('delete function')

//   try {
//       await db.delete(table_name,{id});
//       res.send({"ok":true});
//       console.log('delete function')

//   } catch (error) {
//       console.log(error)
//       res.send({"ok":false, "error":error});
//   }
// });




// :::::::::::::::::::::::::::::::::::::::::::::::::::
  // ::::::::::::::::::::: send email ::::::::::::::::::
  // :::::::::::::::::::::::::::::::::::::::::::::::::::
  
  
async function generatePDF(file, options) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {

    await page.goto(file, { waitUntil: 'networkidle2' });
    } catch (error) {
      console.error(error);
    }
  
    const pdfBuffer = await page.pdf(options);
    await browser.close();
    return pdfBuffer;
}


async function generateAndSavePDF(html, fileName) {
  // generate the HTML content
  console.log("ijdfoijsoemoise")

  // write the HTML content to a file
  const file = path.join(__dirname, './public/img/uploads/document/temp.html');

  await fs.promises.writeFile(file, html);

  // generate the PDF from the HTML file
  const pdfBuffer = await generatePDF(file, ({ path: file, format: 'A4' }));

  // delete the HTML file
  await fs.promises.unlink(file);

  // save the PDF to a file
  await fs.promises.writeFile(`./public/img/uploads/document/${fileName}`, pdfBuffer);
}




async function mailResume(event, email, file, logo){

    let mailOption = {
      from:`sales@bg-icc.com` ,
      to: email, 
      subject: "Confirmation d'inscription"  , 
      html:` `,
    }
   await mailConfig(mailOption)
  }

 async function mailConfig(option){
  
 let transporter = nodemailer.createTransport({
    name: 'mail.algerian-export.com',
      host: 'mail.algerian-export.com',
      port: 465,
      secure: true,
      auth: {
        user: "contact@algerian-export.com",
        pass: "contact022", 
      },
      debug: true,
      logger : true
    });

  return new Promise((resolve, reject) => {
    transporter.verify(function(error, success){
      if(error){
        console.log(error);
        reject("Could not verify");
      }else{
        // TODO : ajouter l'envoi ici
        console.log('server is ready to send message ')
        transporter.sendMail(option, (error, info) => {
          if(error){
            console.log(error);
            let log=` <br> Mail non envoyé à ${option.to}, date: ${Date.now()},id_mail: ${info.messageId}, error : ${error} <br>`
            fs.appendFile('./myLogs.txt',log, function (err) {
              if (err) throw err;
              // print output
              console.log('Saved logs!');
            });
            reject(error);
          }
          // var info_mail= info.messageId
          console.log('Message sent : %s', info.messageId);
          let log=` <br>Mail envoyé à ${option.to}, date: ${Date.now()},id_mail: ${info.messageId} <br>`
          fs.appendFile('./sendedMails.txt',log, function (err) {
            if (err) throw err;
            // print output
            console.log('Saved logs!');
          });
          resolve();
        })
      }
    })
  });

 } 



  httpServer.listen(80, () => console.log("Sever running on *:80"));