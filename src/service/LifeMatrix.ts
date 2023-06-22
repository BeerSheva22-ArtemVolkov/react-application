// import { getRandomMatrix } from "../util/random";

import { matrixSum, range } from "../util/number-functions";

export default class LifeMatrix {
    constructor(private _numbers: number[][]) {
    }

    get numbers() {
        return this._numbers;
    }

    getCellValue(row: number, column: number): number {
        const startValue = this._numbers[row][column];

        let rowMax = row + 1 >= this._numbers.length ? row : row + 1;
        let columnMax = column + 1 >= this._numbers[0].length ? column : column + 1;

        let neighboursCount = -this._numbers[row][column];
        for (let newRow = Math.max(0, row - 1); newRow <= rowMax; newRow++) {
            for (let newColumn = Math.max(0, column - 1); newColumn <= columnMax; newColumn++) {
                neighboursCount += this._numbers[newRow][newColumn]
            }
        }

        return Number(neighboursCount == 3 || startValue && neighboursCount == 2);
    }

    generateNext() {

        let res = this._numbers.map(function (arr) {
            return arr.slice();
        })

        for (let i = 0; i < this._numbers.length; i++) {
            for (let j = 0; j < this._numbers[0].length; j++) {
                res[i][j] = this.getCellValue(i, j);
            }
        }
        this._numbers = res;
    }

    next(): number[][] {

        // this.generateNext()
        // this._numbers = getRandomMatrix(this._numbers.length, this._numbers[0].length, 0, 2)
        this._numbers = this._numbers.map((_, index) => this.getNewRow(index))
        return this._numbers;
    }

    private getNewRow(index: number): number[] {
        return this._numbers[index].map((_, j) => this.getNewCell(index, j))
    }

    private getNewCell(row: number, column: number): number {
        const cell = this._numbers[row][column];
        const partialMatrix = this.partialMatrix(row, column);
        const sum = matrixSum(partialMatrix) - cell;
        return cell ? getCellFromLive(sum) : getCellFromDead(sum);
    }

    private partialMatrix(row: number, column: number): number[][] {
        const indexStart = !column ? 0 : column - 1;
        const indeexEnd = column === this._numbers[row].length - 1 ? column + 1 : column + 2;
        return [row - 1, row, row + 1].map(i => this.numbers[i] ? this._numbers[i].slice(indexStart, indeexEnd) : [])
    }
}

function getCellFromLive(sum: number): number {
    return +(sum >= 2 && sum <= 3)
}

function getCellFromDead(sum: number): number {
    return +(sum === 3)
}