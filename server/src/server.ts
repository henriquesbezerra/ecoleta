import express from 'express';

const app = express();

app.get('/users', (request, response)=>{
    console.log('Listagem de usuários');

    response.json([
        "Henrique",
        "Amanda",
        "Lasanha",
        "Cachorro Quente"
    ]);
});


app.listen('3333');