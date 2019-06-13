'use strict';

const processorDao = require('../dal/ProcessorDao');
const InterfaceConfigResponseBo = require('../model/InterfaceConfigResponseBo');
const ResourceResolverBo = require('../model/ResourceResolverBo');
let AWS = require('aws-sdk');
var jp = require('jsonpath');

class ProcessorService {

    /**
     * 
     * @param {*} processorRequestBo 
     * @description returns Resource Resolver Bo whcih contains lambda details for calling data reader
     */
    async process(eventReaderRequest, processorRequestBo) {
        return new Promise(async (resolve, reject) => {

            try {
                //console.log(" Data processor Select Operation ");

                let dataProcessorRequestBo = JSON.parse(processorRequestBo);
                //console.log("data processor Request Bo Json :", dataProcessorRequestBo)

                //console.log("Fetching Config data for select query to get Interface config from S3");
                // Call Select query to S3 bucket to get Interface Config 
                var interfaceConfigParam = await this.getInterfaceConfigParam(dataProcessorRequestBo);

                //console.log("Data processor Request to fetch Interface config from S3");
                var interfaceConfigJson = await processorDao.getInterfaceConfig(interfaceConfigParam);
                //console.log("Data processor Response details for Interface Config from S3 ", interfaceConfigJson);

                var interfaceConfigResource = this.getInterfaceConfigResource(interfaceConfigJson);

                //console.log("Fetching Config data for select query to get Resource resolver from S3");
                // Call Select query to S3 bucket to get Resource resolver 
                var resourceResolverParam = await this.getResourceResolverParam();

                //console.log("Data processor Request to fetch Interface config from S3");
                var resourceResolverJson = await processorDao.getResourceResolver(resourceResolverParam);
                //console.log("resourceResolverJson", resourceResolverJson);

                var resourceResolverBo = JSON.parse(this.getResourceResolverData(interfaceConfigResource, resourceResolverJson));

                //dataWriter 
                var dataWriter = {"writer": "arn for writer"};
                
                var dataProcessorParam = await this.getDataProcessorParam(resourceResolverBo, eventReaderRequest, interfaceConfigJson, dataWriter);

                var dataprocessorResponse = await processorDao.invokeLambda(dataProcessorParam);

                console.log("Data processor Response details :", eventReaderRequest,interfaceConfigJson,dataWriter);
                resolve(resourceResolverBo);
            }
            catch (ex) {
                console.log("service exception", ex);
                reject(ex)
            }
        });
    }

    /**
     * 
     * @param {*} resourceResolverBo 
     * @param {*} eventReaderRequest 
     * @param {*} interfaceConfigJson 
     * @param {*} dataWriter 
     * @description returns params related to data processor
     */
    getDataProcessorParam(resourceResolverBo, eventReaderRequest, interfaceConfigJson, dataWriter) {

        var body =  Object.assign({},eventReaderRequest,interfaceConfigJson,dataWriter);
        var arnReader = resourceResolverBo.jobArn[0];
        
        var params = {
            FunctionName: arnReader,
            InvocationType: 'Event',
            Payload: JSON.stringify(body)
                };

    return params;
    }

    /**
     * 
     * @param {*} interfaceConfigResource 
     * @param {*} resourceResolverJson 
     * @description returns Resource Resolver Bo which will help in calling lambda 
     */
    getResourceResolverData(interfaceConfigResource, resourceResolverJson) {

        try {
            var JobResource = "$.resources[?(@.properties.type==" + "'" + interfaceConfigResource.JobType + "'" + ")].resource";
            var JobArn = "$.resources[?(@.properties.type==" + "'" + interfaceConfigResource.JobType + "'" + ")].properties.arn";

            //Used Json Path to read the file from s3
            var resource = jp.query(resourceResolverJson, JobResource);
            var arn = jp.query(resourceResolverJson, JobArn);
            //console.log("paths", resource, arn);

            //Data processor request Dto
            var resourceResolverBo = new ResourceResolverBo(resource, arn);
            //console.log("Dto", resourceResolverBo.toString());
            return resourceResolverBo;
        }
        catch (ex) {
            console.log("service Exception :", ex)
            throw ex;
        }
    }

    /**
     * 
     * @param {*} interfaceConfigJson 
     * @description returns interfaceConfigResponseBo which is required to while calling Resource config
     */
    getInterfaceConfigResource(interfaceConfigJson) {
        try {
            var interfaceConfigResponseBo = "";
            var type = "$.interfaceConfig..type";
            var format = "$.interfaceConfig..format";
            //console.log("interfaceConfigJson", interfaceConfigJson);

            // Query to fetch data from Json file
            var JobType = jp.value(interfaceConfigJson, type);
            var jobFormat = jp.value(interfaceConfigJson, format);
            //console.log("paths", JobType, jobFormat);

            //Data processor request Dto
            interfaceConfigResponseBo = new InterfaceConfigResponseBo(JobType, jobFormat);
            //console.log("Dto", interfaceConfigResponseBo.toString());

            return interfaceConfigResponseBo;
        }
        catch (ex) {
            console.log("service exception", ex);
            throw ex;
        }

    }


    /**
     *  
     * @param {*} dataprocessorRequestBo 
     * @description returns Interface config param which is required to call S3 Select event
     */
    async getInterfaceConfigParam(dataprocessorRequestBo) {
        try {
            var bucketName = "tvx-middleware-dev/interfaces/configs/" + dataprocessorRequestBo.domain + "/" + dataprocessorRequestBo.interfaceName;
            var KeyPath = dataprocessorRequestBo.jobName + "-interface-config.json";
            const resourceParams = {
                Bucket: bucketName,
                Key: KeyPath,
                ExpressionType: 'SQL',
                Expression: 'SELECT * FROM S3Object',
                InputSerialization: {
                    JSON: {
                        Type: 'DOCUMENT'
                    }
                },
                OutputSerialization: {
                    JSON: {}
                }
            };
            return resourceParams;

        } catch (ex) {
            console.log("service exception", ex);
            throw ex;
        }
    }

    /**
     * @description returns Resource config param which is required to call S3 Select event
     */
    async getResourceResolverParam() {
        try {

            const resourceParams = {
                Bucket: 'tvx-middleware-dev/metadata',
                Key: 'resourse-resolver.json',
                ExpressionType: 'SQL',
                Expression: 'SELECT * FROM S3Object',
                InputSerialization: {
                    JSON: {
                        Type: 'DOCUMENT'
                    }
                },
                OutputSerialization: {
                    JSON: {}
                }
            };
            return resourceParams;

        } catch (ex) {
            console.log("service exception", ex);
            throw ex;
        }
    }
}

module.exports = new ProcessorService();