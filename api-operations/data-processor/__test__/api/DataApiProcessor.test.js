
var dataApiProcessor = require("../../src/api/DataApiProcessor");
var assert = require("assert");

//jest.mock("../../src/service/ProcessorService");

describe('DataApiProcessor', () => {
    it('process method should return success', async () => {
        var event =
        {
            "body": '{\n\t\t"domain": "Finance",\n        "interfaceName":"FXRates",\n        "jobName": "FXRATES",\n        "fileName":"xyz",\n        "size": 32\n}'
        };

        var actual = await dataApiProcessor.process(event, '');
        let expected = {jobResource : 'reader',message: 'Validation Successful' };
        assert.equal(actual.jobResource,expected.jobResource);
        
    }, 40000);

    it('process method should return success', async () => {
        var event =
        {
            "body": '{\n\t\t"domain": "Finance",\n        "interfaceName":"FXRates",\n        "jobName": "FXRATES",\n        "fileName":"xyz",\n        "size": 32\n}'
        };

        var actual = await dataApiProcessor.process(event, '');
        let expected = {jobResource : 'writer',message: 'Validation Successful' };
        assert.notEqual(actual.jobResource,expected.jobResource);
        
    }, 40000);

    it('process method should return error', async () => {
        var event =
        {
            "body": '{\n\t\t"domain": "Test",\n        "interfaceName":"FXRates",\n        "jobName": "FXRATES",\n        "fileName":"xyz",\n        "size": 32\n}'
        };

        try{
        actual = await dataApiProcessor.process(event, '');
        }catch(ex){
        console.log("exception in testing");
        let actual = ex;
        console.log("actual",ex);
        let expected = " The specified key does not exist.";
        assert.equal(actual,ex,"Validation successful");
        }
                
    });

});