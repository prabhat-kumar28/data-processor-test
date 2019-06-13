const apiProcessor = require('data-processor').apiProcessor;
//const winston_wrapper = require('winston_wrapper');
//const logger = winston_wrapper.getLogger('data-processor-handler')

module.exports.handle = function (event, context, callback) {
  //  winston_wrapper.serverlessFunction(event, context, () => {
        //console.log("Entered handler with request " + JSON.stringify(event));
        //try {
        apiProcessor.process(event).then((body) => {
            //console.log("Exiting with response ", body);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(body)
            })
        }).catch(error => {
            console.log("Exception caught ", error)
            callback(null, {
                statusCode: error.httpStatusCode,
                body: JSON.stringify({
                    errorCode: error.code,
                    errorMessage: error.description
                })
            })
        })
    //})
};
