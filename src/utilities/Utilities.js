export const FahrenheitToCelsius = (f) => {
    return (f - 32) * 5/9;
}

export const FormatTemperature = (t) => {
    return t.toFixed(1);
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
    [1, "AUTO/CIRCULATE"],
    [2, "ON"],
]);