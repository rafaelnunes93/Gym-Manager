const fs = require('fs')
const data = require('../data.json')
const {date} = require('../utils')


exports.index = function(req, res){
    return res.render("members/index",{members:data.members});
}



//show
exports.show = function(req,res){
    // req.query.id
    // req.body
    // req.params.id /:id

    const {id} = req.params

    const foundIntructor = data.members.find(function(member){
        return member.id == id
    })

    if(!foundIntructor) return res.send("Member not found")

    

    const member = {
        ...foundIntructor,
        birth: date(foundIntructor.birth).birthDay
    }

    return res.render("members/show",{member})
}


exports.create = function(req,res){
    return res.render("members/create");
}


//crete
exports.post = function(req,res){
    //enviar os dados do formulario

    const keys = Object.keys(req.body)

    //DesEstrurando o objeto
    let {avatar_url,birth,name,email, gender,blood,weight,height } = req.body


    for (key of keys){
        if(req.body[key] == "") {
            return res.send('Please, fill all fields') 
        }
           
    }

 birth = Date.parse(birth)

 let id = 1;
 const lastMember = data.members[data.members.length - 1 ]

if (lastMember){
    id = lastMember.id + 1
}


    data.members.push({
       id,avatar_url,birth,name,email, gender,blood,weight,height 

    })

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err) return res.send("write file error");

        return res.redirect("/members")
    })

    //return res.re(req.body)
}


//EDIT

exports.edit = function(req,res){

    const { id } = req.params

    const foundIntructor = data.members.find(function(member){
        return member.id == id
    })

    if(!foundIntructor) return res.send("Member not found")

    const member ={
        ...foundIntructor,
        birth:date(foundIntructor.birth).iso
    }


    return res.render('members/edit',{member})
}


//put 
exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundIntructor = data.members.find(function(member, foundindex){
       if (id == member.id){
           index = foundindex
           return true
       }
    })

    if(!foundIntructor) return res.send("Member not found")

    const member = {
        ...foundIntructor,
        ...req.body,
        birth:  Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err) res.send("white error!")

        return res.redirect(`/members/${id}`)
    })

}


// DELETE

exports.delete = function(req,res){
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member){

        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data,null,2),function(err){
            if(err) return res.send("Write file error")

            return res.redirect("/members");
    })
}