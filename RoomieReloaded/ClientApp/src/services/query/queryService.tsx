import { Moment } from "moment"
import { CalendarType } from "../../reducers/calendarReducer"

export interface IQueryService
{   
    setUrlParam(name:string, value:string) : void;
    getUrlParam(param:string) : string | null;
}

export class QueryService implements IQueryService
{
    setUrlParam(name:string, value:string) {
        const url = new URL(window.location.href);
        url.searchParams.set(name, value);
        window.history.replaceState("", "", url.toString());
    }

    getUrlParam(param:string) : string | null {
        const url = new URL(window.location.href);
        return url.searchParams.get(param)
    }
}