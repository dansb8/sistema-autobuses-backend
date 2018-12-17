var APIKey = "DZBPSWSVT848PQ45HRAA21h0JZ3B7Vny6c5gL2G86oqyZKQHk"
var sharedSecret="De9{OXdDhI2auETZ{YL5yww{0dp/tyFDH3-HZ91z"
var resourcePath="payments/v1/authorizations"
var queryParams=`apikey=${APIKey}`
var postBody="{\n" +
    "    \"clientReferenceInformation\": {\n" +
    "        \"code\": \"TC50171_3\"\n" +
    "    },\n" +
    "    \"processingInformation\": {\n" +
    "        \"commerceIndicator\": \"internet\"\n" +
    "    },\n" +
    "    \"aggregatorInformation\": {\n" +
    "        \"subMerchant\": {\n" +
    "            \"cardAcceptorID\": \"1234567890\",\n" +
    "            \"country\": \"US\",\n" +
    "            \"phoneNumber\": \"650-432-0000\",\n" +
    "            \"address1\": \"900 Metro Center\",\n" +
    "            \"postalCode\": \"94404-2775\",\n" +
    "            \"locality\": \"Foster City\",\n" +
    "            \"name\": \"Visa Inc\",\n" +
    "            \"administrativeArea\": \"CA\",\n" +
    "            \"region\": \"PEN\",\n" +
    "            \"email\": \"test@cybs.com\"\n" +
    "        },\n" +
    "        \"name\": \"V-Internatio\",\n" +
    "        \"aggregatorID\": \"123456789\"\n" +
    "    },\n" +
    "    \"orderInformation\": {\n" +
    "        \"billTo\": {\n" +
    "            \"country\": \"US\",\n" +
    "            \"lastName\": \"VDP\",\n" +
    "            \"address2\": \"Address 2\",\n" +
    "            \"address1\": \"201 S. Division St.\",\n" +
    "            \"postalCode\": \"48104-2201\",\n" +
    "            \"locality\": \"Ann Arbor\",\n" +
    "            \"administrativeArea\": \"MI\",\n" +
    "            \"firstName\": \"RTS\",\n" +
    "            \"phoneNumber\": \"999999999\",\n" +
    "            \"district\": \"MI\",\n" +
    "            \"buildingNumber\": \"123\",\n" +
    "            \"company\": \"Visa\",\n" +
    "            \"email\": \"test@cybs.com\"\n" +
    "        },\n" +
    "        \"amountDetails\": {\n" +
    "            \"totalAmount\": \"102.21\",\n" +
    "            \"currency\": \"USD\"\n" +
    "        }\n" +
    "    },\n" +
    "    \"paymentInformation\": {\n" +
    "        \"card\": {\n" +
    "            \"expirationYear\": \"2031\",\n" +
    "            \"number\": \"5555555555554444\",\n" +
    "            \"securityCode\": \"123\",\n" +
    "            \"expirationMonth\": \"12\",\n" +
    "            \"type\": \"002\"\n" +
    "        }\n" +
    "    }\n" +
    "}"
var timestamp = Math.floor(Date.now() / 1000);
var preHashString = timestamp + resourcePath + queryParams + postBody;
var crypto = require('crypto');
var hashString = crypto.createHmac('SHA256', sharedSecret).update(preHashString).digest('hex');
var xPayToken = 'xv2:' + timestamp + ':' + hashString;
console.log(xPayToken);