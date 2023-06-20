export function getRandomInt(min, max) {
    if (min == max) {
        max++;
    } else if (min > max) {
        [min, max] = [max, min];
    }
    return Math.trunc(min + Math.random() * (max - min));
}

export function getRandomElement(array) {
    return array[getRandomInt(0, array.length)];
}

export async function getRandomEmployee(minSalary, maxSalary, departments) {
    const response = await fetch(`https://randomuser.me/api/?nat=US`);
    const data = await response.json();

    const gender = data.results[0].gender;
    const name = data.results[0].name.first;
    const birthYear = new Date().getFullYear() - +data.results[0].dob.age;

    const salary = getRandomInt(minSalary, maxSalary) * 1000;
    const department = getRandomElement(departments);
    return { name, birthYear, gender, salary, department };
}

export async function getRandomEmployees(count, minSalary, maxSalary, departments) {
    const response = await fetch(`https://randomuser.me/api/?nat=US&results=${count}`);
    const data = await response.json();

    return data.results.map((empl) => {
        const gender = empl.gender;
        const name = empl.name.first;
        const birthYear = new Date().getFullYear() - +empl.dob.age;

        const salary = getRandomInt(minSalary, maxSalary) * 1000;
        const department = getRandomElement(departments);
        return { name, birthYear, gender, salary, department };
    })

}

export function getRandomMatrix(rows, columns, min, max) {
    return Array.from({ length: rows }).map(() => getRandomArrayIntNumbers(columns, min, max))
}

function getRandomArrayIntNumbers(nNumbers, min, max) {
    return Array.from({ length: nNumbers }).map(() => getRandomInt(min, max))
}