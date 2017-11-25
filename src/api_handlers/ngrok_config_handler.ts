import axios, { AxiosResponse, AxiosError } from 'axios';
import {IExpressHandler, IExpressRequest, IExpressResponse } from './handler_api';

export class NgrokConfigHandler implements IExpressHandler {
    public async handle(expressRequest: IExpressRequest, res: IExpressResponse) : Promise<any>{
        var result = await axios.get('http://localhost:4040/api/tunnels')
        res.json(result);
    }
}
