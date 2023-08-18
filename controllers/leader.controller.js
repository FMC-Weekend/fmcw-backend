const pamodel = require('../models/pa_m');
const usermodel = require('../models/User_m');
const camodel = require('../models/ca_m');
var exports = module.exports = {}

exports.leader = function(req, res){

    try {
        pamodel.findAll({
            limit: 5,
            order: [ [ 'norefcode', 'DESC' ]],
            attributes: ['name', 'ref_code', 'norefcode'],
          }).then((result)=>{
              res.json(result);
          }).catch((error)=>{
              res.send(error);
          });

    }
    catch(error) {
        res.json({
            status: 'Fail',
            error
        })
    }
};

// exports.change = async function(req, res){
// // //     await pamodel.update({norefcode: 0}, {where : {email: 'chinmaycooldud@gmail.com'}});
// // //     await pamodel.update({norefcode: 0}, {where : {email: 'arhanjain97@gmail.com'}});
// // //     await pamodel.update({norefcode: 0}, {where : {email: 'arhan.jain126@gmail.com'}});
// // //     await pamodel.update({norefcode: 0}, {where : {email: 'aryashukla95@gmail.com'}});
//     // await pamodel.update({pass: 'sep', add : 'InFocus', paid: 'Credit'}, {where : {email: 'angrycder@gmail.com'}});
//     await camodel.update({norefcode: 0}, {where: {ref_code: "CARHBNY916"}});
//     await camodel.destroy({where: {ref_code: "CAPZLAP394"}})
// //         await usermodel.destroy({where: {email: 'angrycder@gmail.com'}});
// //     await pamodel.destroy({where: {email: 'angrycder@gmail.com'}});
//     res.send('success');
// };
