var Simplify = require("simplify-commerce"),
    client = Simplify.getClient({
        publicKey: 'sbpb_ZjExMDZhNmMtNmE3Ny00YWFkLWIzMTUtOGQzNGM4ZmZhZDUw',
        privateKey: '6XyurAKUb3MaIkRI4/FGx0ankQL90GJbmLru3aEdL/h5YFFQL0ODSXAOkNtXTToq'
    });
client.payment.create({
    amount : "34000",
    description : "payment description",
    card : {
        expMonth : "11",
        expYear : "19",
        cvc : "345",
        number : "5420923878724339"
    },
    currency : "USD"
}, function(errData, data){
    if(errData){
        console.error("Error Message: " + errData.data.error.message);
        // handle the error
        return;
    }
    console.log("Payment Status: " + data.paymentStatus);
    console.log("Decline: " + data.declineReason);
});