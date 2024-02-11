//to control error in the backend via using middleware folder also
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this,this.constructor); //usinh method of error

    }
}

module.exports = ErrorHandler