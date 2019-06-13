Sample Request :

{
    "jobDetails": {
            "domain": "finance",
            "interfaceName": "fx-rates", 
            "jobName": "fx-rates",
            "fileName": "codausd280815.csv",
            "size": 32,
            "bucketName": "tvx-middleware-dev",
            "region": "eu-west-1"
        }
}

------------------------------------------------------------------------

Sample Response to Data processor :

{ jobDetails:
   { domain: 'finance',
     interfaceName: 'fx-rates',
     jobName: 'fx-rates',
     fileName: 'codausd280815.csv',
     size: 32,
     bucketName: 'tvx-middleware-dev',
     region: 'eu-west-1' } } { interfaceConfig:
   { name: 'FXRates',
     domain: 'finance',
     source:
      { resource: 's3',
        type: 'file',
        file: [Object],
        trigger: [Object] },
     s3:
      { inputObjectKey: 'interfaces/input/Finance/FxRates/jo_CODA_0000_controlJobFXRATESFile/',
        archiveObjectKey: 'interfaces/archive/Finance/FxRates/jo_CODA_0000_controlJobFXRATESFile/',
        errorObjectKey: 'interfaces/coda/error/finance/coda/coda001/{input-file-name-pattern}',
        blockSize: 4 },
     preProcessors: { required: true, rules: [Array] },
     processors: { transformers: [Object] },
     destination: { type: 'api', api: [Object] } } } { writer: 'arn for writer' }