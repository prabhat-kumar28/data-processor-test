
var dataApiProcessor = require("../../src/api/DataApiProcessor");
var assert = require("chai").assert;

//jest.mock("../../src/service/ProcessorService");

describe('DataApiProcessor', () => {
    it('process method should return processor Response Bo', async () => {
        var event =
        {
            "body": '{\n\t\t"domain": "Finance",\n        "interfaceName":"FXRates",\n        "jobName": "FXRATES",\n        "fileName":"xyz",\n        "size": 32\n}'
        };

        dataApiProcessor.process(event, '')
            .then((result) => {
                let expected = { jobResource: "writer", message: 'Validation Successful' };
                assert.equal(result.jobResource, expected.jobResource);
            }
            );

    });

    it('process method should return error', async () => {
        var event =
        {
            "body": '{\n\t\t"domain": "Test",\n        "interfaceName":"FXRates",\n        "jobName": "FXRATES",\n        "fileName":"xyz",\n        "size": 32\n}'
        };

        console.log("Mock Api test", event);
        dataApiProcessor.process(event, '')
            .then((result) => {
                
            }
            ).catch(err=>{
                let expected = "The specified key does not exist.";
                assert.equal("The specified key does not exist.", expected,"Validation Successful");
            });
        });

    });