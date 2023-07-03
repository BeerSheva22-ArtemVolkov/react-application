export function getRandomInt(min, max) {
    if (min === max) {
        max++;
    } else if (min > max) {
        [min, max] = [max, min];
    }
    return Math.trunc(min + Math.random() * (max - min));
}

export function getRandomMatrix(rows, columns, min, max) {
    return Array.from({ length: rows }).map(() => getRandomArrayIntNumbers(columns, min, max));
}

export function getRandomArrayIntNumbers(nNumbers, min, max) {
    return Array.from({ length: nNumbers }).map(() => getRandomInt(min, max));
}

const names = {
    maleNames: ['Vasya', 'Josef', 'Abraham', 'Yakob', 'Asaf', 'Mosez', 'Itschak', 'David'],
    femaleNames: ['Asya', 'Sara', 'Rivka', 'Olya', 'Klara', 'Galya'],
};

export function getRandomElement(array) {
    return array[getRandomInt(0, array.length)];
}

function generateRandomDate(from, to) {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

export function getRandomEmployee(minSalary, maxSalary, minYear, maxYear, departments) {
    const gender = getRandomElement(['male', 'female']);
    const name = getRandomElement(gender === 'female' ? names.femaleNames : names.maleNames);
    const birthDate = generateRandomDate(new Date(minYear, 0, 1), new Date(maxYear + 1, 0, 1));
    const salary = getRandomInt(minSalary, maxSalary) * 1000;
    const department = getRandomElement(departments);
    return {
        name,
        birthDate,
        gender,
        salary,
        department,
    };
}