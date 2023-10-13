/*
Find All Valid Math Expressions
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


You are given the following string which contains only digits between 0 and 9:

70612160370

You are also given a target number of 20. Return all possible ways you can add the +(add), -(subtract), and *(multiply) operators to the string such that it evaluates to the target number. (Normal order of operations applies.)

The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:

["70612160370", 20]

NOTE: The order of evaluation expects script operator precedence NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:

Input: digits = "123", target = 6
Output: [1+2+3, 1*2*3]

Input: digits = "105", target = 5
Output: [1*0+5, 10-5]
*/

// Find All Valid Math Expressions

/** @param {NS} ns */
export async function main(ns) {
    const cache = new Map();
    ns.clearLog();
    // const input = JSON.parse(ns.args[0]);
    // const responsePort = ns.args[1];
    // const str = input[0];
    // const target = input[1];
    const str = "177596109526"; // hardcoded for testing
    const target = 50; // hardcoded for testing
    ns.print(`Input: ${str}`);
    ns.print(`Target: ${target}`);

    const startTime = performance.now();
    const tokenizations = get_all_tokenizations(str, cache);
    const tokenTime = performance.now();
    const expressions = get_all_expressions(tokenizations, cache);
    const expressionTime = performance.now();

    const answers = [];
    for (let expression of expressions) {
        if (evaluate_expression(ns, expression) === target) {
            answers.push(expression.join(""));
        }
    }
    const evaluationTime = performance.now();
    ns.print(`Num Answers Found: ${answers.length}`);

    ns.print(`Perf:`);
    ns.print(`    Tokenization: ${tokenTime - startTime}ms`);
    ns.print(`    Expressions: ${expressionTime - tokenTime}ms`);
    ns.print(`    Evaluation: ${evaluationTime - expressionTime}ms`);
    ns.print(`    Total: ${evaluationTime - startTime}ms`);

    // ns.print(`Output: ${JSON.stringify(answers)}`);
    // ns.writePort(responsePort, JSON.stringify(answers));
}

function is_token_valid(token) {
    return token.length === 1 || token.charAt(0) !== "0";
}

function get_all_tokenizations(digits, cache) {
    if (cache.has(digits)) return cache.get(digits);

    const tokenizations = [];

    if (digits.length === 2) {
        tokenizations.push(digits.split(``).map((d) => parseInt(d)));
    }

    if (digits.length > 2) {
        for (let i = 1; i < digits.length; i++) {
            const first = digits.substring(0, i);
            if (!is_token_valid(first)) break;
            const firstInt = parseInt(first);

            const rest = get_all_tokenizations(digits.substring(i), cache);
            tokenizations.push(...rest.map((s) => [firstInt, ...s]));
        }
    }

    if (is_token_valid(digits)) {
        tokenizations.push([parseInt(digits)]);
    }

    cache.set(digits, tokenizations);
    return tokenizations;
}

function get_all_expressions(tokenizations, cache) {
    let expressions = [];
    for (let tokens of tokenizations) {
        const built = build_expressions(tokens, cache);
        built.forEach((b) => expressions.push(b));
    }

    return expressions;
}

const ADD = "+";
const SUBTRACT = "-";
const MULTIPLY = "*";

function build_expressions(tokens, cache) {
    const cacheKey = JSON.stringify(tokens);
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const operators = [ADD, SUBTRACT, MULTIPLY];
    const expressions = [];

    if (tokens.length === 1) {
        expressions.push([tokens[0]]);
    }

    if (tokens.length > 1) {
        const first = tokens[0];
        const tails = build_expressions(tokens.slice(1), cache);

        for (let tail of tails) {
            for (let op of operators) {
                expressions.push([first, op].concat(tail));
            }
        }
    }

    cache.set(cacheKey, expressions);
    return expressions;
}

function operate(operator, term1, term2) {
    switch (operator) {
        case ADD:
            return term1 + term2;
        case SUBTRACT:
            return term1 - term2;
        case MULTIPLY:
            return term1 * term2;
    }
}

class MultEval {
    constructor(product, end) {
        this.product = product;
        this.end = end;
    }
}

function evaluate_multiplication(ns, expression, start) {
    const lastIndex = expression.length - 1;
    if (start === lastIndex)
        return new MultEval(expression[lastIndex], lastIndex);

    let index = start;
    let result = expression[index];
    let operator = expression[index + 1];
    while (operator === MULTIPLY) {
        result = result * expression[index + 2];
        index += 2;
        operator = expression[index + 1];
    }

    return new MultEval(result, index);
}

function evaluate_expression(ns, expression) {
    if (expression.length === 1) return expression[0];

    let result = expression[0];
    let start = 0;

    if (expression[1] === MULTIPLY) {
        const mult = evaluate_multiplication(ns, expression, start);
        result = mult.product;
        start = mult.end;
    }

    let i = start;
    while (i < expression.length - 1) {
        const operator = expression[i + 1];
        let term2 = expression[i + 2];
        let nextIndex = i + 2;
        if (i + 3 < expression.length && expression[i + 3] === MULTIPLY) {
            const term2Eval = evaluate_multiplication(ns, expression, i + 2);
            term2 = term2Eval.product;
            nextIndex = term2Eval.end;
        }

        result = operate(operator, result, term2);
        i = nextIndex;
    }

    return result;
}
