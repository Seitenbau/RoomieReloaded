import './calendarView.css';
import * as React from 'react';
import { CalendarType } from '../../reducers/calendarReducer';
import { Action } from 'redux';
import { CommandBarButton } from 'office-ui-fabric-react';
import { IPlannerStateProps } from '../planner/base/plannerTypes';
import { MonthPlanner, WeekPlanner, DayPlanner } from '../planner';

type CalendarProps = ICalendarStateProps & ICalendarDispatchProps;

export interface ICalendarStateProps extends IPlannerStateProps {
  calendarType: CalendarType;
  shownRooms: string[];
}

export interface ICalendarDispatchProps {
  onShowChooseRooms?: () => Action<any>;
}

class CalendarView extends React.Component<CalendarProps> {
  render() {
    const { onShowChooseRooms } = this.props;

    return (
      <div>
        {this.renderBoard()}
        <div className="additional-row">
          <div className="command-bar">
            <CommandBarButton
              onClick={onShowChooseRooms}
              className="command-bar-button"
              disabled={true}
              iconProps={{ iconName: 'AddFriend' }}
            />
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
