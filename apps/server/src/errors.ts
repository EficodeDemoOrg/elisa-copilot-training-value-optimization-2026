export class HttpError extends Error {
    status: number;
    code?: string;
    constructor(status: number, message: string, code?: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export const notFound = (what: string) => new HttpError(404, `${what} not found`, 'NOT_FOUND');
