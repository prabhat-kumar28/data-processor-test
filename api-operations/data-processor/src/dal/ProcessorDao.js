'use strict';

let AWS = require('aws-sdk');
var jp = require('jsonpath');

class ProcessorDao {

    /**
     * 
     * @param {*} interfaceConfigParam 
     * @description returns Interface config Json
     */
    async getInterfaceConfig(interfaceConfigParam) {
        try {
            return new Promise((resolve, reject) => {
                var interfaceConfigResponseJson = "";
                //console.log("Inside Interface Config");

                let s3 = new AWS.S3({
                    region: 'us-west-2'
                })

                s3.selectObjectContent(interfaceConfigParam, (err, data) => {
                    if (err) {
                        console.log("Error while Invoking Interface config: ", err);
                        reject(err.message);
                    }
                    else {

                        // data.Payload is a Readable Stream
                        const eventStream = data.Payload;

                        eventStream.on('data', (event) => {

                            if (event.Records) {

                                interfaceConfigResponseJson = JSON.parse(event.Records.Payload);
                                //console.log("interface details:", JSON.parse(event.Records.Payload));
                            } else if (event.Stats) {
                                //console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
                            } else if (event.End) {
                                //console.log('SelectObjectContent completed');
                            }

                        });

                        // Handle errors encountered during the API call
                        eventStream.on('error', (err) => {
                            console.log("Event Stream error while invoking Interface Config :", err);
                            reject(err);
                        });

                        eventStream.on('end', () => {
                            //console.log("before resolve");
                            resolve(interfaceConfigResponseJson);
                        });
                    }
                });
            })
        } catch (ex) {
            console.log("service exception", ex);
        }
    }

    /**
     * 
     * @param {*} s3ResourceResolverParam 
     * @description returns Resource Resolver Json
     */
    async getResourceResolver(s3ResourceResolverParam) {
        try {
            return new Promise((resolve, reject) => {

                var resourceResolver = "";
                //console.log("Inside Resource resolver");

                let s3 = new AWS.S3({
                    region: 'us-west-2'
                })

                s3.selectObjectContent(s3ResourceResolverParam, (err, data) => {
                    if (err) {
                        console.log("Error while Invoking Resource resolver : ", err);
                        reject(err);
                    }
                    else {

                        // data.Payload is a Readable Stream
                        const eventStream = data.Payload;

                        eventStream.on('data', (event) => {

                            if (event.Records) {
                                resourceResolver = JSON.parse(event.Records.Payload);
                                //console.log("Resource resolver details:", resourceResolver);

                            } else if (event.Stats) {
                                //console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
                            } else if (event.End) {
                                //console.log('SelectObjectContent completed');
                            }

                        });

                        // Handle errors encountered during the API call
                        eventStream.on('error', (err) => {
                            // switch (err.name) {
                            //     // Check against specific error codes that need custom handling
                            // }
                            console.log("Event Stream error while invoking Resource resolver :", err);
                            reject(err);
                        });

                        eventStream.on('end', () => {
                            //console.log("before resolve");
                            resolve(resourceResolver);
                        });
                    }
                });
            })
        } catch (ex) {
            console.log("service exception", ex);
        }
    }

    /**
     * 
     * @param {*} dataProcessorParam 
     * @description call data Processor lambda
     */
    async invokeLambda(dataProcessorParam) {
        
        var lambda = new AWS.Lambda();
        return new Promise((resolve, reject) => {
            lambda.invoke(dataProcessorParam, (error, data) => {
                if (error) {
                    console.log("Error while invoking lambda",error);
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = new ProcessorDao();