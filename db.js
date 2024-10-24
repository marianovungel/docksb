const mongoose = require('mongoose');

// Definindo explicitamente o strictQuery para evitar o aviso de depreciação
mongoose.set('strictQuery', false); // ou true, conforme sua necessidade

mongoose.connect(process.env.URL_MONGDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
