// library/ISOtimeFormat.js
export const ISOtimeFormat = (dateTime) => {
    const data = new Date(dateTime);
    // Added missing comma after 'en-US' and fixed 'toLocaleTimeString'
    const localTime = data.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    return localTime;
};