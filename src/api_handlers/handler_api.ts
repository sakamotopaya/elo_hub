
export interface IExpressRequest {
    body: any;
    query : any;
}

export interface IExpressResponse {
    send(message: string): void;
    json(data: any): void;
}

export interface IExpressHandler {
    handle(request: IExpressRequest, response: IExpressResponse) : Promise<any>;
}
