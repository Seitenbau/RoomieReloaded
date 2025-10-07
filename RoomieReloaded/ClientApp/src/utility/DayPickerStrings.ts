interface IDatePickerStrings {
    months: string[];
    shortMonths: string[];
    days: string[];
    shortDays: string[];
    goToToday: string;
    prevMonthAriaLabel?: string;
    nextMonthAriaLabel?: string;
    prevYearAriaLabel?: string;
    nextYearAriaLabel?: string;
    closeButtonAriaLabel?: string;
    monthPickerHeaderAriaLabel?: string;
    yearPickerHeaderAriaLabel?: string;
}

export const DayPickerStrings: IDatePickerStrings = {
    months: [
        "Januar",
        "Februar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ],

    shortMonths: [
        "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
        "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
    ],

    days: [
        "Sonntag", "Montag", "Dienstag", "Mittwoch",
        "Donnerstag", "Freitag", "Samstag",
    ],

    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],

    goToToday: "Heute",
    prevMonthAriaLabel: "Voriger Monat",
    nextMonthAriaLabel: "Nächster Monat",
    prevYearAriaLabel: "Voriges Jahr",
    nextYearAriaLabel: "Nächstes Jahr",
    closeButtonAriaLabel: "Schließen",
    monthPickerHeaderAriaLabel: "{0}, zur Auswahl eines anderen Monats drücken.",
    yearPickerHeaderAriaLabel: "{0}, zur Auswahl eines anderen Jahres drücken."
};