export function subtractYears(date: Date, years: number) {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(date.getFullYear() - years);
    return dateCopy;
}

export function subtractMonths(date: Date, months: number) {
    const dateCopy = new Date(date);
    dateCopy.setMonth(date.getMonth() - months);
    return dateCopy;
}

export function subtractDays(date: Date, day: number) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() - day);
    return dateCopy;
}

export const minutesToFormatedText = (minutes:number) =>{

    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const minutesLeft = minutes % 60;
    //console.log({days}, {hours}, {minutesLeft})
    let textMinutes = "";
    if (days > 0)
        textMinutes = days + "d - " + hours + "h - " + minutesLeft + " min"
    else if (hours > 0)
        textMinutes = hours + "h - "  + minutesLeft + " min"
    else
        textMinutes = minutesLeft + " min"

    //console.log({minutesLeft})
    return textMinutes ;
}