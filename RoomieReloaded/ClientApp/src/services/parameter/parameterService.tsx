import moment, { Moment } from "moment"

import { IUrlService, UrlService } from "../url/urlService";
import { CalendarType } from "../../utility/dateTimeHelper";

export interface IParameterService
{
    getDate() : Moment | null;
    getCalendar() : CalendarType | null;

    setDate(date: Moment) : void;
    setCalendar(calendar: CalendarType) : void;
}

export class ParameterService implements IParameterService
{
    private urlService:IUrlService;

    dateParamName:string = "viewDate";
    calendarParamName:string = "viewCalendar";

    constructor(urlService:IUrlService = new UrlService()) {
        this.urlService = urlService
    }

    getDate = () : Moment | null => {
        const dateParam = this.urlService.getUrlParam(this.dateParamName);

        if(dateParam == null) {
            return null;
        }

        const dateMoment = moment(dateParam);
        return dateMoment.isValid()
            ? dateMoment
            : null;
    }

    getCalendar = () : CalendarType | null => {
        const calendarParam = this.urlService.getUrlParam(this.calendarParamName);

        if(calendarParam == null){
            return null;
        }

        const upperCaseCalendarParam = calendarParam.toUpperCase();

        switch(upperCaseCalendarParam){
            case 'DAY':
            case 'WEEK':
            case 'MONTH':
            case 'WORKWEEK':
                return upperCaseCalendarParam;
            default:
                return null;
        }
    }

    setDate = (date:Moment)  => {
        const formattedDate = date.format("YYYY-MM-DD");
        this.urlService.setUrlParam(this.dateParamName, formattedDate);
    }

    setCalendar = (calendar:CalendarType) => {
        this.urlService.setUrlParam(this.calendarParamName, calendar.toLowerCase());
    }
}