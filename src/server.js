const express = require('express');
const nunjucks = require('nunjucks')
const routes = require("./routes");
const server = express();
const methodOverrride = require('method-override')

// responsavel por funcionar o req body
server.use(express.urlencoded({extended:true}))
//usar arquivos estaticos
server.use(express.static('public'))
//Fazer os methodos put e delete funcionar
server.use(methodOverrride('_method'))
// usar as rotas
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("src/app/views",{
    express:server,
    autoescape:false,
    noCache:true
})



server.listen(5000,function(){
    console.log("server is runing");
})
