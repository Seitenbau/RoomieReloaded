import moment from "moment";
import { CalendarType } from "../../reducers/calendarReducer";
import { IQueryService } from "../query/queryService";
import { IParameterService, ParameterService } from "./parameterService";

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
    const queryServiceMock:IQueryService = new QueryServiceMock();
    const parameterService:IParameterService = new ParameterService(queryServiceMock);

    if(calendar) {
        parameterService.setCalendar(calendar as CalendarType);
    }

    const actual = parameterService.getCalendar()
    expect(actual).toBe(expected);
}

function testSetGetDate(date?:string, expected?:string | null) {
    const queryServiceMock:IQueryService = new QueryServiceMock();
    const parameterService:IParameterService = new ParameterService(queryServiceMock);

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

class QueryServiceMock implements IQueryService {
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

    getUrl() : string {
        return this.url.toString();
    }
} 
