require('dotenv').config();

const CONFIG = {};


CONFIG.imp_apiKey = process.env.IMP_APIKEY ||'7495396678046189';
CONFIG.imp_secretKey = process.env.IMP_SECRETKEY || '2f6bXTQKnQgLNWpyMpYrANlROHHGLoPODVZBPQmcGCYuzn2lN1NoP8fEPWkBlapZ6oBWeX9Vz7p8vsuj';

module.exports = CONFIG;
