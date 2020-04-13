const fs = require('fs')
const data = require('../data.json')
const {age,date} = require('../utils')


exports.index = function(req, res){
    return res.render("instructors/index",{instructors:data.instructors});
}








//show
exports.show = function(req,res){
    // req.query.id
    // req.body
    // req.params.id /:id

    const {id} = req.params

    const foundIntructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundIntructor) return res.send("Instructor not found")

    

    const instructor = {
        ...foundIntructor,
        age: age(foundIntructor.birth),
        services: foundIntructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundIntructor.created_at),
    }

    return res.render("instructors/show",{instructor})
}


exports.create = function(req,res){
    return res.render("instructors/create");
}


//crete
exports.post = function(req,res){
    //enviar os dados do formulario

    const keys = Object.keys(req.body)

    //DesEstrurando o objeto
    let {avatar_url,birth,name, services, gender } = req.body


    for (key of keys){
        if(req.body[key] == "") {
            return res.send('Please, fill all fields') 
        }
           
    }

 birth = Date.parse(birth)
 const created_at = Date.now()
 const id = Number(data.instructors.length + 1 )



    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,

    })

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err) return res.send("write file error");

        return res.redirect("/instructors")
    })

    //return res.re(req.body)
}


//EDIT

exports.edit = function(req,res){

    const { id } = req.params

    const foundIntructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundIntructor) return res.send("Instructor not found")

    const instructor ={
        ...foundIntructor,
        birth:date(foundIntructor.birth).iso
    }


    return res.render('instructors/edit',{instructor})
}


//put 
exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundIntructor = data.instructors.find(function(instructor, foundindex){
       if (id == instructor.id){
           index = foundindex
           return true
       }
    })

    if(!foundIntructor) return res.send("Instructor not found")

    const instructor = {
        ...foundIntructor,
        ...req.body,
        birth:  Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err) res.send("white error!")

        return res.redirect(`/instructors/${id}`)
    })

}


// DELETE

exports.delete = function(req,res){
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){

        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data,null,2),function(err){
            if(err) return res.send("Write file error")

            return res.redirect("/instructors");
    })
}