var randomstring = require('randomstring');
var exports = module.exports = {};

exports.genrefcodeca = async function(req, res){
    var code = 'CA'
    code = code + randomstring.generate({
        length: 5,
        charset: "alphabetic",
        readable: true,
        capitalization: "uppercase",
      });
      code = code +
        randomstring.generate({
          length: 3,
          charset: "numeric",
          readable: true,
          capitalization: "uppercase",
        });

    return code;
    
};

exports.genrefcodepa = async function(req, res){
    var code = 'PA'
    code = code + randomstring.generate({
        length: 5,
        charset: "alphabetic",
        readable: true,
        capitalization: "uppercase",
      });
      code = code +
        randomstring.generate({
          length: 3,
          charset: "numeric",
          readable: true,
          capitalization: "uppercase",
        });

    return code;
    
};

exports.genorderid = async function(req, res){
    var code = ''
    code = code + randomstring.generate({
        length: 3,
        charset: "alphabetic",
        readable: true,
        capitalization: "uppercase",
      });
      code = code +
        randomstring.generate({
          length: 3,
          charset: "numeric",
          readable: true,
          capitalization: "uppercase",
        });

    return code;
};