//para mandar la respuesta desde el servidor al front
exports.jsonResponse = function (statusCode, body) {
    return {
        statusCode,
        body,
    };
};

