'use strict';

const ResourceResolverBo = require('../../model/ResourceResolverBo');

class ProcessorService {

    /**
     *  
     * @param {*} event 
     */
    async process(processorRequestBo) {

        console.log(" Mock Data processor Select Operation ");

         //Data processor request Dto
         var resourceResolverBo = new ResourceResolverBo("reader", "arn of DelimitedFileReader");

        return resourceResolverBo;
    }
    
}



module.exports = new ProcessorService();