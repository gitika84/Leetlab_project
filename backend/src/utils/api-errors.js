class ApiError extends Error {
    constructor(statusCode , message , errors = [] , stack = " "){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.CaptureStackTrace(this , this.constructor)
        }
    }
}

export { ApiError }