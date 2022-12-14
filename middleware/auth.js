require('dotenv').config()

const authMiddleware = async (req, res, next) => {
    const admin = require("firebase-admin");
    const serviceAccount = {
        type: process.env.ACCOUNT_TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
    }

    if(!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    try {
        const verUser = await admin.auth().verifyIdToken(req.headers.authorization)
        req.email = verUser.email
        next()
    } catch(err) {
        console.log(err)
    }

}

module.exports = authMiddleware;