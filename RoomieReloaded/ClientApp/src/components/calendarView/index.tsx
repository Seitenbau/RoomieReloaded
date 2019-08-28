import CalendarView, { ICalendarStateProps, ICalendarDispatchProps } from './calendarView';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import { Dispatch, bindActionCreators } from 'redux';
import { getCurrentCalendar, getCurrentDateTime } from '../../selectors/calendarSelectors';
import { getPlannerGroups, getPlannerItems } from '../../selectors/plannerItemSelectors';

const mapStateToProps = (state: RootState): ICalendarStateProps => {
  return {
    calendarType: getCurrentCalendar(state),
    shownRooms: [],
    date:getCurrentDateTime(state),
    startHour:7,
    endHour:19,    
    groups:getPlannerGroups(state),
    items:getPlannerItems(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ICalendarDispatchProps => {
  return bindActionCreators({
  },
  dispatch );
};

const Calendar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarView);

export default Calendar;
