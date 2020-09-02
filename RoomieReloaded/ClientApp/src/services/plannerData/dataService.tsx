import React from 'react';
import moment from 'moment';
import { IPlannerGroup, IHasDateRange, IPlannerItem } from "../../components/planner/base/plannerTypes";

export interface IDataService
{
    getGroups() : Promise<IPlannerGroup[]>;
    getRecords(dateRange:IHasDateRange, group:IPlannerGroup) : Promise<IPlannerItem[]>;
}

export class DataService implements IDataService
{
    getGroups = () : Promise<IPlannerGroup[]> => 
    {
        const url:string = 'api/rooms';
        return fetch(url)
            .then(r => {
                if(!r.ok){
                    throw new Error(`Unexpected status code of ${r.status} when calling ${r.url}`)
                }
                console.log(`requested rooms from '${r.url}'`);
                return r;
            })
            .then(r => r.json())
            .then(json => json.rooms.map((room:IApiRoom) => this.mapRoomToPlannerGroup(room)));
    }

    getRecords = (dateRange:IHasDateRange, group:IPlannerGroup) : Promise<IPlannerItem[]> => {

        const start = this.convertDateToRequestDate(dateRange.start);
        const end = this.convertDateToRequestDate(dateRange.end);
        const url:string = `api/calendar/${group.id}?start=${start}&end=${end}`;
        return fetch(url)
        .then(r => {
                if(!r.ok){
                    throw new Error(`Unexpected status code of ${r.status} when calling ${r.url}`)
                }
                console.log(`requested events from '${r.url}'`);
                return r;
            })
            .then(r => r.json())
            .then(json => json.events.map((event:IApiEvent) => this.mapEventToPlannerItem(json.groupId, event)));
    }

    private mapRoomToPlannerGroup = (room:IApiRoom) : IPlannerGroup => {
        return {
            id:room.name,
            title:room.niceName,
            isLoading:false,
            category: room.category,
            link: room.link,
        };
    }

    private convertDateToRequestDate = (date:moment.Moment) : string =>{
        return date.format('YYYY-MM-DD');
    }

    private mapEventToPlannerItem = (groupId:string, event:IApiEvent) : IPlannerItem => {
        var result:IPlannerItem = {
            id: event.id,
            groupId: groupId,
            start: moment(event.start),
            end: moment(event.end),
            title: event.name || event.organizer,
            chatLink: event.chatWithOrganizerLink,
            chatMessage: event.chatMessage,
            isPrivate: event.isPrivate
        };

        result.tooltip = this.createTooltip(result, event);

        return result;
    }

    private createTooltip(item: IPlannerItem, event:IApiEvent): string | JSX.Element | undefined {
        return (<div>
            <div>Organizer: {event.organizer}</div>
            <div>Start: {item.start.format("HH:mm")}</div>
            <div>End: {item.end.format("HH:mm")}</div>
            <div>{this.renderChatHint(event)}</div>
        </div>);
    }

    private renderChatHint(event:IApiEvent): JSX.Element | null {
        if(event.chatHint === null || event.chatHint === undefined){
            return null;
        }
        return <div className="tooltip-text-seperator" >{event.chatHint}</div>;
    }
}

interface IApiRoom
{
    name:string,
    mail:string,
    niceName:string,
    category?:string,
    link?:string
}

interface IApiEvent
{
    id:string,
    name:string,
    organizer:string,
    start:moment.Moment,
    end:moment.Moment,
    chatWithOrganizerLink?:string,
    chatMessage?:string,
    chatHint?: string,
    isPrivate:boolean
}