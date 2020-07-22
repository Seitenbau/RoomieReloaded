import CalendarView, { ICalendarDispatchProps, ICalendarStateProps } from './calendarView';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import { Dispatch, bindActionCreators } from 'redux';
import { getCurrentCalendar, getCurrentDateTime } from '../../selectors/calendarSelectors';
import { getPlannerGroups, getPlannerItems } from '../../selectors/plannerItemSelectors';
import { getCategoryStates } from '../../selectors/categorySelectors';
import { CategoryActions } from '../../reducers/categoryReducer';

const mapStateToProps = (state: RootState): ICalendarStateProps => {
  return {
    calendarType: getCurrentCalendar(state),
    shownRooms: [],
    date:getCurrentDateTime(state),
    startHour:7,
    endHour:19,    
    groups:getPlannerGroups(state),
    items:getPlannerItems(state),
    categoryStates:getCategoryStates(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ICalendarDispatchProps => {
  return bindActionCreators({
    setCategoryState:(category:string, isCollapsed: boolean) => CategoryActions.setCategoryState(category, isCollapsed),
  },
  dispatch );
};

const Calendar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarView);

export default Calendar;
