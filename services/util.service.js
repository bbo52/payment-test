const {to} = require('await-to-js');
const pe = require('parse-error');


module.exports.to = async (promise) => {
    let err; let res;
    [err, res] = await to(promise);
    if (err) return[pe(err)];

    return [null, res];
};

module.exports.ReE = function(res, err, code) { // Error Web Response
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;
    console.log('에러발생: ReE');
    console.error(err);
    console.log(code);

    return res.json({success: false, error: err});
};

module.exports.ReS = function(res, data, code) { // Success Web Response 성공웹응답.
    let send_data = {success: true};

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data);// merge the objects(객체병합)
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data);
};

module.exports.TE = TE = function(err_message, log) { // TE stands for Throw Error
    // if(log === true){
    console.log('에러발생: TE');
    console.log(err_message);
    console.log(log);

    throw new Error(err_message);
};
