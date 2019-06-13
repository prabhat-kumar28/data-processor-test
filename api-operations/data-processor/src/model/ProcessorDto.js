'user strict';
/* Example:
let _name,
    _email,
    _mobile;
*/

let _interfaceName;
let _jobName;
let _size;
let _domain;
let _fileName


class ProcessorDto {
    
    constructor(domain,interfaceName,jobName,fileName,size){
        _domain = domain;
        _interfaceName = interfaceName;
        _jobName = jobName;
        _fileName = fileName;
        _size = size;
    }

    get domain() {
        return _domain;
    }

    get interfaceName() {
        return _interfaceName;
    }

    get jobName() {
        return _jobName;
    }

    get fileName() {
        return _fileName;
    }

    get size() {
        return _size;
    }

    toString() {
        return JSON.stringify({
            'domain': this.domain,
            'interfaceName': this.interfaceName,
            'jobName' : this.jobName,
            'fileName' : this.fileName,
            'size' : this.size
        });
    }
    
}

module.exports = ProcessorDto;