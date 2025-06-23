class HttpException extends Error {
    constructor(public status: number, public message: any, public data: any = undefined) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export = HttpException;

