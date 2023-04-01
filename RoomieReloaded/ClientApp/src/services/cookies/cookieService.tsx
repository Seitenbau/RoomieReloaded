export interface ICookieService{
    getCookieValue(key:string) : any | null;
    setCookieValue(key:string,value:any) : void;
}

class CookieService implements ICookieService{
    getCookieValue = (key:string) : any | null => {
        
        const name = key + "=";
        const decodedCookie = decodeURIComponent(document.cookie);

        const ca = decodedCookie.split(';');

        for(const element of ca) {
            let c = element;
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                const base64CookieValue = c.substring(name.length, c.length);
                const cookieValue = atob(base64CookieValue);
                return JSON.parse(cookieValue);
            }
        }
        return null;
    }

    setCookieValue = (key:string,value:any) : void => {
        const cookieValue = JSON.stringify(value);
        const base64Value = btoa(cookieValue);
        document.cookie = `${key}=${base64Value};path=/;`;
    }
}

export class CookieServiceFactory {
    create = () : ICookieService => {
        return new CookieService();
    }
}