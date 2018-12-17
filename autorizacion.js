var Simplify = require("simplify-commerce"),
    client = Simplify.getClient({
        publicKey: 'sbpb_ZjExMDZhNmMtNmE3Ny00YWFkLWIzMTUtOGQzNGM4ZmZhZDUw',
        privateKey: '6XyurAKUb3MaIkRI4/FGx0ankQL90GJbmLru3aEdL/h5YFFQL0ODSXAOkNtXTToq'
    });

client.authorization.create({
    amount : "2500",
    description : "test authorization",
    card : {
        expMonth : "11",
        expYear : "19",
        cvc : "123",
        number : "5555555555554444"
    },
    currency : "USD"
}, function(errData, data){

    if(errData){
        console.error("Error Message: " + errData.data.error.message);
        // handle the error
        return;
    }

    console.log("Success Response: " + JSON.stringify(data));
});