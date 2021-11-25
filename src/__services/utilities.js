
export function strUcFirst(a){
    if(typeof(a) === "string"){
        return (a+'').charAt(0).toUpperCase()+a.substr(1);
    }else return undefined
}

/**
 * Clonage des objets quand necessaire
 * @param a
 * @returns {any}
 */
export function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

export function octetsToKilos($octets){
    return Math.round(($octets * 0.000977)*100)/100
}

///date
export function getCurrentDate(){
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    return d.getFullYear() + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        (day < 10 ? '0' : '') + day;
}

export function formatDate(d){
    var month = d.getMonth()+1;
    var day = d.getDate();

    return d.getFullYear() + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        (day < 10 ? '0' : '') + day;
}

export function addDaysToDate(date, nbDays){
    return formatDate(new Date(Date.parse(date) + (60 * 60 * nbDays * 1000)))
}

export function removeDaysToDate(date, nbDays){
    return formatDate(new Date(Date.parse(date) - (60 * 60 * nbDays * 1000)))
}

export function getTimestamp(date){
    var dates1 = date.split("-");
    var newDate = dates1[0]+"/"+dates1[1]+"/"+dates1[2];
    return (new Date(newDate).getTime());
}

export function getTranslateFromTextTable(o, typeText, translator, lg) {
    if(o[typeText]){
        if(o[typeText][lg]) {
            return o[typeText][lg]
        }else if(o[typeText]['en']) {
            return o[typeText]['en']
        }else {
            return translator('no_' + lg + "_" + typeText)
        }
    }else {
        return translator('no_' + lg + "_" + typeText )
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    strUcFirst,
    formatDate,
    getCurrentDate,
    addDaysToDate,
    removeDaysToDate,
    octetsToKilos,
    getTimestamp,
    clone,
    getTranslateFromTextTable
};