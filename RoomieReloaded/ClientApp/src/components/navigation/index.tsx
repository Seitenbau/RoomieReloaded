import NavigationView, { INavigationStateProps, INavigationDispatchProps } from './navigationView';
import { RootState } from '../../reducers';
import { NavigationActions } from '../../reducers/navigationReducer';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux'
import { getCurrentCalendar, getCurrentTimeFrameText, getCurrentDateTime } from '../../selectors/calendarSelectors';

const mapStateToProps = (state: RootState): INavigationStateProps => {
    return {
        activeCalendar:getCurrentCalendar(state),
        currentTimeFrameText:getCurrentTimeFrameText(state),
        currentTimeFrame:getCurrentDateTime(state),
    };
}

const mapDispatchToProps = (dispatch: Dispatch) : INavigationDispatchProps => {
    return bindActionCreators({
        onDayClick: NavigationActions.onDayClick,
        onWeekClick:NavigationActions.onWeekClick,
        onMonthClick:NavigationActions.onMonthClick,
        onNextTimeFrameClick:NavigationActions.onNextTimeFrameClick,
        onPreviousTimeFrameClick:NavigationActions.onPreviousTimeFrameClick,
        onTimeFrameSelected: NavigationActions.onTimeFrameSelected,
        onTodayClick:NavigationActions.onTodayClick, 
    },
    dispatch );
};

const Navigation = connect(mapStateToProps, mapDispatchToProps)(NavigationView);

export default Navigation;