import Employee from "../model/Employee";

export function getStatistic(empl: Employee[], min: number, max: number, step: number, fn: (employee: Employee) => number, field: string) {
    let res: any[] = [];
    let k = 0;
    for (let i = min; i <= max; i += step) {
        res[k++] = {
            id: k,
            [field]: `${i - step} - ${i}`,
            count: empl.filter(employee => {
                const fieldValue = fn(employee)
                return +fieldValue < i && +fieldValue > i - step
            }).length
        }
    }

    return res
}