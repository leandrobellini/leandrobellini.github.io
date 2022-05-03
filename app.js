function validaCredenciais(context, logins, username, password) {
    var resultado = false
    context.log(logins)
    logins.forEach(login => {
        context.log(login)
        if(login.cpf == username && login.password == password ){
            context.log('Entrei no IF true')
            resultado = true;
        }
    });
    return resultado
}

module.exports = async function (context, req) {
    const {verify} = require('hcaptcha');
    const axios = require('axios');
    context.log('JavaScript HTTP trigger function processed a request.');

    //HCaptcha
    // Versão Free const SECRET_KEY = '0x54706B771335AEB2e98E2396780c4478589652Eb'
    // Versão Enterprise
    const SECRET_KEY = '0x6c1a67c0e194D2AE71ADDE83C9b146B8B7FBF602'
    const VERIFY_URL = 'https://hcaptcha.com/siteverify'

    //const name = (req.query.name || (req.body && req.body.name));
    const logins = [
        {
            cpf: "39020175890",
            password: "102030"
        },
        {
            cpf: "01234567890",
            password: "123456"
        },
        {
            cpf: "09876543210",
            password: "654321"
        },
        {
            cpf: "09988776655",
            password: "102030"
        }
    ]

    var username = req.body.cpf;
    var password = req.body.senha;
    var HCaptchaResponseToken = req.body['h-captcha-response']
    var sucesso = false

    if(!HCaptchaResponseToken){
        context.log('Sem token HCaptcha')
        context.res = {
                    status: 401,
                    body: 'Usuário ou Senha inválidos'
                };
        return false;
    }else{
        let res = await axios.post('https://hcaptcha.com/siteverify', 
            new URLSearchParams({ 
                secret: SECRET_KEY, response: HCaptchaResponseToken 
                }));

        var retornoHCaptcha = res.data.success
        context.log('---------- retorno HCaptcha -----------------')
        context.log(retornoHCaptcha)
        context.log('---------------------------------------------')

        if(!retornoHCaptcha){
            context.res = {
                        status: 401,
                        body: 'Usuário ou Senha inválidos'
                    };
            return false;
        }else{
            var retorno = await validaCredenciais(context, logins, username, password)
            context.log('Var de retorno')
            context.log(retorno)
                
                if(retorno){
                    context.res = {
                        status: 200,
                        body: 'Login realizado com sucesso'
                    };                    
                }
                else{
                    context.res = {
                        status: 401,
                        body: 'Usuário ou Senha inválidos'
                    };
                }
        }
    }
}