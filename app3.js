function validaCredenciais(context, logins, username, password) {
    context.log('---- Autenticação ----');
    var resultado = false;
    logins.forEach(login => {
        if(login.cpf == username && login.password == password ) {  
            context.log('Autenticado com sucesso!');
            context.log(login.cpf);
            context.log(login.password);
            resultado = true;
        }
    });
    if (!resultado) {
        context.log('Usuário ou senha invávilos');
    }
    context.log('----------------');
    return resultado;
}

module.exports = async function (context, req) {
    const axios = require('axios');
    context.log('JavaScript HTTP trigger function processed a request.');

    // hCaptcha - Versão Enterprise
    const SECRET_KEY = '0x6c1a67c0e194D2AE71ADDE83C9b146B8B7FBF602';
    const VERIFY_URL = 'https://hcaptcha.com/siteverify';

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
            password: "302010"
        }
    ];

    var username = req.body.cpf;
    var password = req.body.senha;
    var HCaptchaResponseToken = req.body['h-captcha-response'];
    var GCaptchaResponseToken = req.body['g-captcha-response'];
    var sucesso = false;

    context.log('---- Inputs ----');
    context.log('token hCaptcha: ' + HCaptchaResponseToken);
    context.log('token gCaptcha: ' + GCaptchaResponseToken);
    context.log('user:' + username);
    context.log('pass: ' + password);
    context.log('----------------');

    if(!HCaptchaResponseToken && !GCaptchaResponseToken) {
        context.log('Sem token HCaptcha');
        context.res = {
                    status: 401,
                    body: 'Usuário ou Senha inválidos'
                };
        return false;
    }else{
        let res = await axios.post(VERIFY_URL, 
            new URLSearchParams({ 
                secret: SECRET_KEY, response: HCaptchaResponseToken 
                }));

        var retornoHCaptcha = res.data.success;
        context.log('---------- retorno hCaptcha -----------------');
        context.log('Status: ' + retornoHCaptcha);
        context.log('Data..: ' + res.data);
        context.log('Score.: ' + res.score);
        context.log('---------------------------------------------');

        if(!retornoHCaptcha){
            context.res = {
                        status: 401,
                        body: 'Usuário ou Senha inválidos'
                    };
            return false;
        }else{
            var retorno = await validaCredenciais(context, logins, username, password);
            context.log('Var de retorno');
            context.log(retorno);
                
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