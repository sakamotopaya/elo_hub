
export interface IExpressRequest {
    body: any;
    query : any;
    params: any;
}

export interface IExpressResponse {
    status(statusCode: number) : IExpressResponse;
    send(message: string): IExpressResponse;
    json(data: any): IExpressResponse;
}

export interface IExpressHandler {
    handle(request: IExpressRequest, response: IExpressResponse) : Promise<any>;
}
