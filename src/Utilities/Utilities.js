export const RoundToPointFive = (value) => {
    return (Math.round(value * 2) / 2).toFixed(1);
}

export const ConvertToCelsius = (fahrenheit) => {
    if(!fahrenheit) return NaN;
    
    return (fahrenheit - 32) * 5/9;
}

export const ConvertToFahrenheit = (celsius) => {
    if(!celsius) return NaN;
    
    return celsius * 9 / 5 + 32;
} 

export const FormatTemperature = (t) => {
    if(!t) return NaN;

    return t.toFixed(1);
}

export const TimeToString = (t) => {
    if(!t.hour && !t.minute)
        return "NULL";

    const AMPM = t.hour > 12 ? "PM" : "AM";
    const hour = t.hour > 12 ? t.hour-12 : t.hour;
    const minute = t.minute > 9 ? t.minute : "0" + t.minute;

    return `${hour}:${minute} ${AMPM}`;
}

export const ModeMap = new Map([
    [0, "OFF"],
    [1, "HEAT"],
    [2, "COOL"],
    [3, "AUTO"],
]);

export const StateMap = new Map([
    [0, "OFF"],
    [1, "HEATING"],
    [2, "COOLING"],
]);

export const FanModeMap = new Map([
    [0, "AUTO"],
    [1, "CIRCULATE"],
    [2, "ON"],
]);
