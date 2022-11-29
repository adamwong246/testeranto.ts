import { ClassySuite, } from "./../level2/TesterantoClasses";
export class TesterantoClassic {
    constructor(cc, suites, givenOverides, whenOverides, thenOverides, checkOverides) {
        this.cc = cc;
        this.constructorator = cc;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.checkOverides = checkOverides;
    }
    Suites() {
        /* @ts-ignore:next-line */
        return {
            Default: (givenz, checkz) => new ClassySuite("Default constructor", givenz, checkz),
        };
    }
    Given() {
        return Object.assign({}, this.givenOverides);
    }
    When() {
        const objectdescription = Object.getOwnPropertyDescriptors(this.constructorator.prototype);
        let autogeneratedWhens = {};
        // Object.keys(objectdescription).forEach((k, ndx) => {
        //   autogeneratedWhens[k] = (...xArgs) =>
        //     new ClassyWhen<Klass>(`!${k}`, (y) => {
        //       return y[k](...xArgs);
        //     });
        // });
        /* @ts-ignore:next-line */
        return Object.assign(Object.assign({}, autogeneratedWhens), this.whenOverides);
    }
    Then() {
        let autogeneratedWhens = {};
        // Object.keys(
        //   Object.getOwnPropertyDescriptors(this.constructorator.prototype)
        // ).forEach(
        //   (publicMethod, ndx) =>
        //     (autogeneratedWhens[publicMethod] = (expected) =>
        //       new ClassyThen<Klass>(`!${publicMethod}`, (thing) =>
        //         assert.equal(thing[publicMethod](expected), expected)
        //       ))
        // );
        /* @ts-ignore:next-line */
        return Object.assign(Object.assign({}, autogeneratedWhens), this.thenOverides);
    }
    Checks() {
        return Object.assign({}, this.checkOverides);
    }
}
