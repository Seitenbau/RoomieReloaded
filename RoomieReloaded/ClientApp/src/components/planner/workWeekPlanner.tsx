import { WeekPlanner } from './weekPlanner';

export  class WorkWeekPlanner extends WeekPlanner{

    getDaysToRender():number{
        return 5;
    }
}