export interface IUrlService
{   
    setUrlParam(name:string, value:string) : void;
    getUrlParam(param:string) : string | null;
    getFullUrl() : string;
}

export class UrlService implements IUrlService
{
    setUrlParam(name:string, value:string) {
        const url = new URL(this.getFullUrl());
        url.searchParams.set(name, value);
        window.history.replaceState("", "", url.toString());
    }

    getUrlParam(param:string) : string | null {
        const url = new URL(this.getFullUrl());
        return url.searchParams.get(param)
    }

    getFullUrl() : string {
        return window.location.href;
    }
}