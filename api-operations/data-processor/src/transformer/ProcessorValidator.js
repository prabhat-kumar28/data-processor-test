'use strict';

let GenericException = require('generic-exception').GenericException;
const ExceptionCategory = require('../model/ExceptionCategory');
const ExceptionType = require('../model/ExceptionType');

class ProcessorValidator {

    async validate(processorDto) {
        if (!(processorDto.name && processorDto.name.trim())) {
            throw this.generateValidationException(ExceptionType.MISSING_CUSTOMER_FIRSTNAME);
        }
        if (!(processorDto.email && processorDto.email.trim())) {
            throw this.generateValidationException(ExceptionType.MISSING_CUSTOMER_EMAIL);
        }
        if (!processorDto.email.toString().match('.com')) {
            throw this.generateValidationException(ExceptionType.INVALID_EMAIL, {
                'emailId': processorDto.email.toString()
            });
        }
        return processorDto;
    }

    generateValidationException(exceptionType, inspectionFields) {
        return new GenericException.Builder(exceptionType, global.messageBundle)
            .withMessage(`Validation error : ${exceptionType}`)
            .withExceptionCategory(ExceptionCategory.VALIDATION_ERROR)
            .withInspectionFields(inspectionFields)
            .build();
    }
}

module.exports = new ProcessorValidator();