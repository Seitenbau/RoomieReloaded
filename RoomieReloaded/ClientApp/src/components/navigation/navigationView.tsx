import * as React from 'react';
import { DefaultButton, CommandBarButton } from '@fluentui/react/lib/Button';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Icon } from '@fluentui/react/lib/Icon';
import './navigation.css';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { DayOfWeek } from '@fluentui/react';
import moment from 'moment';
import { VoidCreator, AnyValueCreator } from '../../actions/actions';
import { ClipboardService } from '../../services/clipboard/clipboardService';
import { UrlService } from '../../services/url/urlService';
import Toast from '../toast/toast';
import { CalendarType, getCalendarTypeText } from '../../utility/dateTimeHelper';

const clipboardService = new ClipboardService();
const urlService = new UrlService();

export interface INavigationState{
    darkMode: boolean;
    showShareToast: boolean;
}

export interface INavigationStateProps{
    currentTimeFrameText:string;
    currentTimeFrame:moment.Moment,
    activeCalendar:CalendarType;
}

export interface INavigationDispatchProps{
    onMonthClick:VoidCreator,
    onWeekClick:VoidCreator,
    onDayClick:VoidCreator,
    onNextTimeFrameClick:VoidCreator,
    onPreviousTimeFrameClick:VoidCreator,
    onTodayClick:VoidCreator,
    onTimeFrameSelected:AnyValueCreator;
}

type NavigationProps = INavigationStateProps & INavigationDispatchProps;

class NavigationView extends React.Component<NavigationProps, INavigationState> {
    constructor(props: NavigationProps) {
        super(props);
        let darkMode = this.readDarkMode();
        let showShareToast = false;
        this.state = { darkMode, showShareToast };
        this.updateBodyClass();
    }

    render(){
        const{
            onMonthClick,
            onWeekClick,
            onDayClick,
            onNextTimeFrameClick,
            onPreviousTimeFrameClick,
            onTodayClick,
            onTimeFrameSelected,
            currentTimeFrameText,
            currentTimeFrame,
            activeCalendar
        } = this.props;

        return (
            <div className="navigation" >
                <div className="timeFrameNavigation" >
                    <CommandBarButton onClick={() => onPreviousTimeFrameClick()}
                        className="timeFrameNavigation-button previous"
                        iconProps={{iconName:'ChevronLeftSmall'}} 
                        title={this.getPrevButtonText(activeCalendar)}
                        />
                    <div className="timeFrameNavigation-text">
                        {currentTimeFrameText}
                    </div>
                    <CommandBarButton onClick={() => onNextTimeFrameClick()}
                        className="timeFrameNavigation-button next"
                        iconProps={{iconName:'ChevronRightSmall'}} 
                        title={this.getNextButtonText(activeCalendar)}
                        />
                    <CommandBarButton onClick={() => onTodayClick()}
                        title="Zum heutigen Datum springen"
                        className="timeFrameNavigation-button today"
                        iconProps={{iconName:'GotoToday'}} />
                    <DatePicker 
                        title="Datum wählen"
                        className="timeFrameNavigation-button date"
                        showWeekNumbers={true}
                        showMonthPickerAsOverlay={true}
                        firstDayOfWeek={DayOfWeek.Monday}
                        formatDate={this.formatDate}
                        onSelectDate={(date?:Date | null) => this.onSelectDate(date, onTimeFrameSelected)}
                        value={currentTimeFrame.toDate()}
                        allowTextInput={false}
                    />
                    <CommandBarButton onClick={() => this.onShareClick()}
                        title="Diese Ansicht teilen"
                        className="timeFrameNavigation-button"
                        iconProps={{iconName:'Share'}} />
                    {this.state.showShareToast ?
                        <Toast message="Link wurde in die Zwischenablage kopiert" /> 
                        : null
                    }
                </div>
                
                <div className="themeSettings" title="Darkmode an/aus">
                    <Icon iconName="Sunny" className="light-mode-icon" />
                    <Toggle onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this.onDarkModeChange(checked)} checked={this.state.darkMode} />
                    <Icon iconName="ClearNight" className="dark-mode-icon" />
                </div>
                <div className="boardNavigation">
                    <DefaultButton onClick={() => onMonthClick()} className={this.getButtonClassName("MONTH", activeCalendar)} >
                        Monat
                    </DefaultButton>
                    <DefaultButton onClick={() => onWeekClick()} className={this.getButtonClassName("WEEK", activeCalendar)} >
                        Woche
                    </DefaultButton>
                    <DefaultButton onClick={() => onDayClick()} className={this.getButtonClassName("DAY", activeCalendar)} >
                        Tag
                    </DefaultButton>
                </div>
            </div>
        )
    }

    private getButtonClassName(buttonCalendar:CalendarType, activeCalendar:CalendarType) : string {
        const defaultClass = "boardNavigation-button";
        const activeBoardClassName = buttonCalendar === activeCalendar ? " boardNavigation-button-activated" : "";
    
        const buttonClass = `${defaultClass} ${buttonCalendar.toLowerCase()}${activeBoardClassName}`;
    
        return buttonClass;
    }

    private getPrevButtonText(activeCalendar: CalendarType):string {
        if(activeCalendar === "WEEK") return "Vorherige " + getCalendarTypeText(activeCalendar);
        return "Vorheriger " + getCalendarTypeText(activeCalendar)
    }

    private getNextButtonText(activeCalendar: CalendarType):string {
        if(activeCalendar === "WEEK") return "Nächste " + getCalendarTypeText(activeCalendar);
        return "Nächster " + getCalendarTypeText(activeCalendar)
    }
    
    private formatDate(date?:Date):string{
        if(date === undefined){
            return "";
        }
        const selectedDate = moment(date);
        return selectedDate.format("DD.MM.YYYY");
    }
    
    private onSelectDate(date:Date | undefined | null, updateFunc:AnyValueCreator){
        if(date === null || date === undefined){
            return;
        }
        const selectedDate = moment(date);
        updateFunc(selectedDate);
    }

    private onShareClick() {
        const url = urlService.getFullUrl();
        clipboardService.copyTextToClipboard(url);

        this.setState({showShareToast: true});

        setTimeout(() => {
            this.setState({showShareToast: false});
        }, 3000);
    }

    private onDarkModeChange(checked?: boolean) {
        this.setState( 
            state => ({ darkMode: checked || false }),
            () => {
                this.updateBodyClass();
                this.storeDarkMode();
            } );
    }

    private updateBodyClass() {
        if (this.state.darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }

    private readDarkMode() {
        let darkMode = localStorage.getItem( "dark-mode" );
        return (darkMode === "on");
    }

    private storeDarkMode() {
        if (this.state.darkMode) {
            localStorage.setItem("dark-mode", "on");
        } else {
            localStorage.setItem( "dark-mode", "off");
        }
    }
}

export default NavigationView;