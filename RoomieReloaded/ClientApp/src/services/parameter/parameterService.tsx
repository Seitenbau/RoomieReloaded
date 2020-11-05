import { Moment } from "moment"
import { CalendarType } from "../../reducers/calendarReducer"
import { IQueryService, QueryService } from "../query/queryService";

const queryService : IQueryService = new QueryService();

export interface IParameterService
{   
    setDateTime(dateTime: Moment) : void;
    setCalendar(calendar: CalendarType) : void;
}

export class ParameterService implements IParameterService
{
    dateParamName:string = "viewDate";
    calendarParamName:string = "viewCalendar";

    setDateTime = (dateTime:Moment)  => {
        const formattedDate = dateTime.format("YYYY-MM-DD");
        queryService.setUrlParam(this.dateParamName, formattedDate);
    }

    setCalendar = (calendar:CalendarType) => {
        queryService.setUrlParam(this.calendarParamName, calendar);
    }
}