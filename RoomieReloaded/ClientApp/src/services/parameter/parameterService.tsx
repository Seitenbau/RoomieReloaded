import moment, { Moment } from "moment"
import { CalendarType } from "../../reducers/calendarReducer"
import { IQueryService, QueryService } from "../query/queryService";

const queryService : IQueryService = new QueryService();

export interface IParameterService
{
    getDate() : Moment | null;
    getCalendar() : CalendarType | null;

    setDate(date: Moment) : void;
    setCalendar(calendar: CalendarType) : void;
}

export class ParameterService implements IParameterService
{
    dateParamName:string = "viewDate";
    calendarParamName:string = "viewCalendar";

    getDate = () : Moment | null => {
        const dateParam = queryService.getUrlParam(this.dateParamName);

        if(dateParam == null) {
            return null;
        }

        const dateMoment = moment(dateParam);
        return dateMoment.isValid()
            ? dateMoment
            : null;
    }

    getCalendar = () : CalendarType | null => {
        const calendarParam = queryService.getUrlParam(this.calendarParamName);

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
        queryService.setUrlParam(this.dateParamName, formattedDate);
    }

    setCalendar = (calendar:CalendarType) => {
        queryService.setUrlParam(this.calendarParamName, calendar);
    }
}