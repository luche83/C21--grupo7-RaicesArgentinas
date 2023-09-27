const { unlinkSync, existsSync } = require("fs");
const {readJSON, writeJSON} = require("../../data");
const {hashSync} = require('bcryptjs');

module.exports = (req, res) => {
    
            
    const users = readJSON('users.json');

    const usersModify = users.map(user => {
        
        if(user.id === req.params.id){

            existsSync(`./src/public/images/usuarios/${user.image}`)&&
            unlinkSync(`./src/public/images/usuarios/${user.image}`);

            user.name = req.body.name;
            user.surname = req.body.surname;
            user.surname = req.body.surname;
            user.birthday = req.body.birthday;
            user.address = req.body.address;
            user.city = req.body.city;
            user.province = req.body.province;

            
            user.image = req.file ? req.file.filename : user.image;
            
        }

        return user
    })


    writeJSON(usersModify, 'users.json')
     
    return res.redirect('/admin')
}