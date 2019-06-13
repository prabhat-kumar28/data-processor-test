'use strict';

let ProcessorDto = require('../model/ProcessorDto');
let ProcessorBo = require('../model/ProcessorBo');
let processorValidator = require('./ProcessorValidator');

class ProcessorTransformer {

    static async transformToBo(processorDto) {
        let dataProcessorDto = JSON.parse(processorDto.toString());
        return new ProcessorBo(dataProcessorDto.domain, dataProcessorDto.interfaceName, dataProcessorDto.jobName, dataProcessorDto.fileName, dataProcessorDto.size);
    }

    static async transformToDto(processorBo) {
        return new ProcessorDto();
    }
}

module.exports = ProcessorTransformer;