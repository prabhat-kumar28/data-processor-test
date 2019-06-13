'use strict';

let _jobResource;
let _jobArn;

class ResourceResolverBo {
  
    constructor(jobResource,jobArn){
        _jobResource = jobResource;
        _jobArn = jobArn;
    }
    
    get jobResource() {
        return _jobResource;
    }

    get jobArn() {
        return _jobArn;
    }

    toString() {
        return JSON.stringify({
            'jobResource': this.jobResource,
            'jobArn' : this.jobArn
        });
    }
}

module.exports = ResourceResolverBo;