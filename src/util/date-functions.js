export function getISODate(date) {
    return date.toISOString().substring(0, 10);
}

export function getEndDate(startDateStr, days) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate.setDate(startDate.getDate() + days));
    return getISODate(endDate);
}