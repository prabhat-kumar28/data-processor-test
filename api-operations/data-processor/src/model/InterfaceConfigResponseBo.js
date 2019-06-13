'use strict';

let _JobType;
let _jobFormat;

class InterfaceConfigResponseBo {
  
    constructor(JobType,jobFormat){
        _JobType = JobType;
        _jobFormat = jobFormat;
    }
    
    get JobType() {
        return _JobType;
    }

    get jobFormat() {
        return _jobFormat;
    }

    toString() {
        return JSON.stringify({
            'JobType': this.JobType,
            'jobFormat' : this.jobFormat
        });
    }
}

module.exports = InterfaceConfigResponseBo;