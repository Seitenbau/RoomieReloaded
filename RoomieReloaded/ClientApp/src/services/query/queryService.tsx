export interface IQueryService
{   
    setUrlParam(name:string, value:string) : void;
    getUrlParam(param:string) : string | null;
    getUrl() : string;
}

export class QueryService implements IQueryService
{
    setUrlParam(name:string, value:string) {
        const url = new URL(this.getUrl());
        url.searchParams.set(name, value);
        window.history.replaceState("", "", url.toString());
    }

    getUrlParam(param:string) : string | null {
        const url = new URL(this.getUrl());
        return url.searchParams.get(param)
    }

    getUrl() : string {
        return window.location.href;
    }
}