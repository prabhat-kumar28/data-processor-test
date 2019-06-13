'use strict';

const ProcessorDto = require('../model/ProcessorDto');
const processorService = require('../service/ProcessorService');
const ProcessorTransformer = require('../transformer/ProcessorTransformer');

class DataApiProcessor {

    /**
     * 
     * @param {*} event 
     * @param {*} context 
     * @description returns success
     */
    async process(event, context) {
        try {

            //console.log("**** Starting Data Processor ****");
            let eventReaderRequest = "";
            if (event.body) {
                eventReaderRequest = JSON.parse(event.body);
            }
            else {
                eventReaderRequest = event;
            }

            //Data processor request Dto
            var processorRequestDto = new ProcessorDto(eventReaderRequest.jobDetails.domain, eventReaderRequest.jobDetails.interfaceName, eventReaderRequest.jobDetails.jobName, eventReaderRequest.jobDetails.size);
            //console.log("Data processor Request Dto", processorRequestDto.toString());

            //Transform Dto to Bo
            var processorRequestBo = await ProcessorTransformer.transformToBo(processorRequestDto);
            //console.log("Data processor Request Bo", processorRequestBo.toString());

            // invoke service and supply the data to and from service 
            var processorResponseBo = await processorService.process(eventReaderRequest, processorRequestBo);
            //console.log("Successfully data proceesed to data reader");

            // transform into dto and return response using dto
            return processorResponseBo;

        } catch (exception) {
            console.log("exception", exception);
            throw exception;
        }
    }
}

// let dataProcessor = new DataApiProcessor();
// dataProcessor.process({
//     body: {
//         "jobDetail": {
//             "domain": "Finance",
//             "interfaceName": "FXRates", //jobname
//             "jobName": "FXRATES", // Data processor needs this to fetch interface config file
//             "fileName": "codausd280815.csv",
//             "sizeInKb": 32,
//             "bucketName": "tvx-middleware-dev",
//             "region": "eu-west-1"
//         }
//     }
// })

module.exports = new DataApiProcessor();