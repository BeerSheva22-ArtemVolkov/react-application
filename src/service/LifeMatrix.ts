import { getRandomMatrix } from "../util/random";

export default class LifeMatrix {
    constructor(private _numbers: number[][]) {
    }

    get numbers() {
        return this._numbers;
    }

    getCellValue(i: number, j: number): number {
        const startValue = this._numbers[i][j]; 
        let imax = i + 1 >= this._numbers.length ? i : i + 1;
        let jmax = j + 1 >= this._numbers[0].length ? j : j + 1;

        let res = -this._numbers[i][j];
        for (let ii = i - 1 < 0 ? i : i - 1; ii <= imax; ii++) {
            for (let jj = j - 1 < 0 ? j : j - 1; jj <= jmax; jj++) {
                res += + this._numbers[ii][jj]
            }
        }

        return startValue && (res == 2 || res == 3) || !startValue && (res == 3) ? 1 : 0;
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

        this.generateNext()
        // this._numbers = getRandomMatrix(this._numbers.length, this._numbers[0].length, 0, 2)

        return this._numbers;
    }
}