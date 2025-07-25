import moment from "moment";
import { IUrlService } from "../url/urlService";
import { IParameterService, ParameterService } from "./parameterService";
import { CalendarType } from "../../utility/dateTimeHelper";

describe('Getting and setting calendar', () => {
    it('day', () => {
        testSetGetCalendar('day','DAY')
    }),
    it('week', () => {
        testSetGetCalendar('week','WEEK')
    }),
    it('workweek', () => {
        testSetGetCalendar('workweek','WORKWEEK')
    }),
    it('month', () => {
        testSetGetCalendar('month','MONTH')
    }),
    it('no calendar type', () => {
        testSetGetCalendar('loremipsum', null)
    }),
    it('no calendar parameter set', () => {
        testSetGetCalendar(undefined, null)
    })
})

describe('Getting and setting date', () => {
    it('ISO date', () => {
        testSetGetDate('1970-01-01','1970-01-01');
    }),
    it('Wrong date', () => {
        testSetGetDate('loremipsum', null);
    }),
    it('No date', () => {
        testSetGetDate(undefined, null);
    })
})

function testSetGetCalendar(calendar?:string, expected?:string | null) {
    const urlServiceMock:IUrlService = new UrlServiceMock();
    const parameterService:IParameterService = new ParameterService(urlServiceMock);

    if(calendar) {
        parameterService.setCalendar(calendar as CalendarType);
    }

    const actual = parameterService.getCalendar()
    expect(actual).toBe(expected);
}

function testSetGetDate(date?:string, expected?:string | null) {
    const urlServiceMock:IUrlService = new UrlServiceMock();
    const parameterService:IParameterService = new ParameterService(urlServiceMock);

    if(date) {
        parameterService.setDate(moment(date))
    }

    const actual = parameterService.getDate()

    if(actual != null) {
        expect(actual.format("YYYY-MM-DD")).toBe(expected)
    } else {
        expect(actual).toBe(expected);
    }
}

class UrlServiceMock implements IUrlService {
    private url:URL;

    constructor(url?:string) {
        if(url) {
            this.url = new URL(url);
        } else {
            this.url = new URL("http://www.example.com")
        }
    }

    setUrlParam(name:string, value:string) {
        this.url.searchParams.set(name, value);
    }

    getUrlParam(param:string) : string | null {
        return this.url.searchParams.get(param);
    }

    getFullUrl() : string {
        return this.url.toString();
    }
} 
