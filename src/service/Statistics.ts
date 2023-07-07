import Employee from "../model/Employee";

export function getStatistic(empl: Employee[], min: number, max: number, step: number, fn: (employee: Employee) => number, field: string) {
    let res: any[] = [];
    let k = 0;
    for (let i = min; i < max; i += step) {
        res[k++] = {
            id: k,
            [field]: `${i} - ${i + step > max ? max : i + step}`,
            count: empl.filter(employee => {
                const fieldValue = fn(employee)
                console.log(fieldValue, i, step);
                
                return +fieldValue < i + step && +fieldValue > i
            }).length
        }
    }

    return res
}