import './calendarView.css';
import * as React from 'react';
import { Action } from 'redux';
import { IPlannerStateProps, IPlannerDispatchProps } from '../planner/base/plannerTypes';
import { MonthPlanner, WeekPlanner, DayPlanner } from '../planner';
import { CalendarType } from '../../utility/dateTimeHelper';

export type CalendarProps = ICalendarStateProps & ICalendarDispatchProps;

export interface ICalendarStateProps extends IPlannerStateProps {
  calendarType: CalendarType;
  shownRooms: string[];
}

export interface ICalendarDispatchProps extends IPlannerDispatchProps {
  onShowChooseRooms?: () => Action;
}

class CalendarView extends React.Component<CalendarProps> {
  render() {
      return (
          <div>
        {this.renderBoard()}
        <div className="additional-row">
          <div className="command-bar">

          </div>
        </div>
      </div>
    );
  }

  private renderBoard = () => {
    const { calendarType } = this.props;

    switch (calendarType) {
      default:
            case 'MONTH':
                return <MonthPlanner {...this.props} />;
            case 'WEEK':
                return <WeekPlanner {...this.props} />;
            case 'DAY':
                return <DayPlanner {...this.props} />;
    }
  };
}

export default CalendarView;
