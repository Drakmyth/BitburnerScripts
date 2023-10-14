// Find All Valid Math Expressions

import { NS } from "@ns";

const operators = ["+", "-", "*"] as const;
type Operator = (typeof operators)[number];
type Term = number | Expression;

class Expression {
    public value: number;

    constructor(
        public term1: Term,
        public operator?: Operator,
        public term2?: Term
    ) {
        if (operator === undefined || term2 === undefined) {
            this.value = this.getTermValue(term1);
            return;
        }

        switch (operator) {
            case "+":
                this.value =
                    this.getTermValue(term1) + this.getTermValue(term2);
                break;
            case "-":
                this.value =
                    this.getTermValue(term1) - this.getTermValue(term2);
                break;
            case "*":
                this.value =
                    this.getTermValue(term1) * this.getTermValue(term2);
                break;
        }
    }

    private getTermValue(term: Term) {
        switch (typeof term) {
            case "number":
                return term;
            case "object":
                return term.value;
        }
    }

    multiply(term: Term) {
        this.operator = "*";
        this.term2 = term;
        this.value =
            this.getTermValue(this.term1) * this.getTermValue(this.term2);
    }

    toString() {
        return `${this.term1}${
            this.operator !== undefined ? this.operator : ""
        }${this.term2 !== undefined ? this.term2 : ""}`;
    }
}

export async function main(ns: NS) {
    const input: [string, number] = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
    const str = input[0];
    const target = input[1];

    const test = solve(str);
    const answers = test.filter((e) => e.value == target).map((a) => a.toString());

    ns.print(`All expressions equalling ${target} are: ${answers}`);
    ns.writePort(responsePort, JSON.stringify(answers));
}

function solve(str: string) {
    const expressions: Expression[] = [];

    if (str.length < 1) return expressions;
    if (str.length === 1 || str[0] !== "0") {
        expressions.push(new Expression(Number.parseInt(str)));
    }
    if (str.length === 1) return expressions;

    for (let i = str.length - 1; i > 0; i--) {
        const rightStr = str.substring(i);
        if (rightStr.length > 1 && rightStr[0] === "0") continue;

        const rightTerm = Number.parseInt(rightStr);
        const left = solve(str.substring(0, i));

        for (let leftTerm of left) {
            for (let operator of operators) {
                if (leftTerm.term2 === undefined) {
                    expressions.push(
                        new Expression(leftTerm.term1, operator, rightTerm)
                    );
                } else if (operator === "*") {
                    expressions.push(
                        new Expression(
                            leftTerm.term1,
                            leftTerm.operator,
                            new Expression(leftTerm.term2, operator, rightTerm)
                        )
                    );
                } else {
                    expressions.push(
                        new Expression(leftTerm, operator, rightTerm)
                    );
                }
            }
        }
    }

    return expressions;
}
