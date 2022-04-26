import * as Ports from "ports.lib.js";

class TestCase {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }
}

/** @param {NS} ns */
export async function main(ns) {
    const testCases = [
        new TestCase(`(a)))()a)(()))(`, [`(a(a)(()))`, `(a()a(()))`, `(a()a)(())`, `(a)(a(()))`, `(a)(a)(())`, `(a)()a(())`]),
        new TestCase(`)(`, [``]),
        new TestCase(`()())()`, [`()()()`, `(())()`]),
        new TestCase(`(a)())()`, [`(a)()()`, `(a())()`]),
        new TestCase(`()(a))(`, [`((a))`, `()(a)`]),
        new TestCase(`)(()))(()))()a((`, [`(()(()))()a`, `(())(())()a`]),
        new TestCase(`(((a((a))`, [`a((a))`, `(a(a))`, `((aa))`]),
        new TestCase(`(((())(((a(a(a)((a)`, [`(())aa(a)(a)`, `(())a(aa)(a)`, `(())a(a(a)a)`, `(())(aaa)(a)`, `(())(aa(a)a)`, `(())(a(aa)a)`, `(())((aaa)a)`, `((())aaa)(a)`, `((())aa(a)a)`, `((())a(aa)a)`, `((())(aaa)a)`, `(((())aaa)a)`]),
        new TestCase(`)((((()a(())))()a())`, [`(((()a(())))()a())`, `((((()a())))()a())`, `((((()a(()))))a())`, `((((()a(())))()a))`]),
        new TestCase(`(()))(`, [`(())`]),
        new TestCase(`()(()(a(())a(()))a`, [`()()(a(())a(()))a`, `()(()a(())a(()))a`, `()(()(a())a(()))a`, `()(()(a(())a()))a`]),
        new TestCase(`)))a))))a)aa`, [`aaaa`]),
        new TestCase(`(()))((aa)(`, [`(())(aa)`]),
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/sanitize-parentheses-in-expression.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

        const port = ns.getPortHandle(Ports.CONTRACT_TEST_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        const response = JSON.parse(port.read());
        const result = test.output.every(val => response.indexOf(val) > -1);
        ns.tprint(`Test ${index + 1}/${testCases.length}: ${result ? `PASS` : `!!!! FAILED !!!!`}`);
        if (!result) {
            ns.tprint(`    Expected: ${JSON.stringify(test.output)}, Received: ${JSON.stringify(response)}`);
        }
    }
}
