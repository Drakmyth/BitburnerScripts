import { CodingContractData, NS } from "@ns";

// generated from ns.codingcontracts.getContractTypes()
export const ContractTypes = {
    FIND_LARGEST_PRIME_FACTOR: `Find Largest Prime Factor`,
    SUBARRAY_WITH_MAXIMUM_SUM: `Subarray with Maximum Sum`,
    TOTAL_WAYS_TO_SUM_1: `Total Ways to Sum`,
    TOTAL_WAYS_TO_SUM_2: `Total Ways to Sum II`,
    SPIRALIZE_MATRIX: `Spiralize Matrix`,
    ARRAY_JUMPING_GAME_1: `Array Jumping Game`,
    ARRAY_JUMPING_GAME_2: `Array Jumping Game II`,
    MERGE_OVERLAPPING_INTERVALS: `Merge Overlapping Intervals`,
    GENERATE_IP_ADDRESSES: `Generate IP Addresses`,
    ALGORITHMIC_STOCK_TRADER_1: `Algorithmic Stock Trader I`,
    ALGORITHMIC_STOCK_TRADER_2: `Algorithmic Stock Trader II`,
    ALGORITHMIC_STOCK_TRADER_3: `Algorithmic Stock Trader III`,
    ALGORITHMIC_STOCK_TRADER_4: `Algorithmic Stock Trader IV`,
    MINIMUM_PATH_SUM_IN_A_TRIANGLE: `Minimum Path Sum in a Triangle`,
    UNIQUE_PATHS_IN_A_GRID_1: `Unique Paths in a Grid I`,
    UNIQUE_PATHS_IN_A_GRID_2: `Unique Paths in a Grid II`,
    SHORTEST_PATH_IN_A_GRID: `Shortest Path in a Grid`,
    SANITIZE_PARENTHESES_IN_EXPRESSION: `Sanitize Parentheses in Expression`,
    FIND_ALL_VALID_MATH_EXPRESSIONS: `Find All Valid Math Expressions`,
    HAMMINGCODES_ENCODE: `HammingCodes: Integer to Encoded Binary`,
    HAMMINGCODES_DECODE: `HammingCodes: Encoded Binary to Integer`,
    PROPER_2_COLORING_OF_A_GRAPH: `Proper 2-Coloring of a Graph`,
    COMPRESSION_1: `Compression I: RLE Compression`,
    COMPRESSION_2: `Compression II: LZ Decompression`,
    COMPRESSION_3: `Compression III: LZ Compression`,
    ENCRYPTION_1: `Encryption I: Caesar Cipher`,
    ENCRYPTION_2: `Encryption II: Vigenère Cipher`,
};

export class SolveResult {
    public solved: boolean;
    public message: string;

    constructor(reward: string, failure: string) {
        this.solved = failure === "";
        this.message = this.solved ? reward : failure;
    }

    static success = (message: string) => new SolveResult(message, "");
    static failure = (message: string) => new SolveResult("", message);
}

export class ContractSolver {
    constructor(
        public title: string,
        public script: string,
        public processInput: (
            input: CodingContractData
        ) => CodingContractData = (input) => input
    ) {}

    solve = async (ns: NS, filename: string, host: string, portId: number) => {
        const port = ns.getPortHandle(portId);
        port.clear();

        const input = ns.codingcontract.getData(filename, host);
        const processedInput = this.processInput(input);
        const runOptions = {
            threads: 1,
            preventDuplicates: true,
        };
        ns.run(this.script, runOptions, JSON.stringify(processedInput), portId);

        while (port.empty()) {
            await ns.sleep(1);
        }

        const answer = JSON.parse(port.read().toString());
        const reward = ns.codingcontract.attempt(answer, filename, host);
        if (reward === "") {
            return SolveResult.failure(
                `Answer: ${answer}, Input: ${JSON.stringify(input)}`
            );
        } else {
            return SolveResult.success(reward);
        }
    };

    static findSolver = (title: string) => {
        return ContractSolvers.find((s) => s.title === title);
    };
}

export const ContractSolvers = [
    new ContractSolver(
        ContractTypes.ALGORITHMIC_STOCK_TRADER_1,
        `contracts/algorithmic-stock-trader.js`,
        (input) => [1, input]
    ),
    new ContractSolver(
        ContractTypes.ALGORITHMIC_STOCK_TRADER_2,
        `contracts/algorithmic-stock-trader.js`,
        (input) => [input.length, input]
    ),
    new ContractSolver(
        ContractTypes.ALGORITHMIC_STOCK_TRADER_3,
        `contracts/algorithmic-stock-trader.js`,
        (input) => [2, input]
    ),
    new ContractSolver(
        ContractTypes.ALGORITHMIC_STOCK_TRADER_4,
        `contracts/algorithmic-stock-trader.js`
    ),
    new ContractSolver(
        ContractTypes.ARRAY_JUMPING_GAME_1,
        `contracts/array-jumping-game.js`
    ),
    new ContractSolver(
        ContractTypes.ARRAY_JUMPING_GAME_2,
        `contracts/array-jumping-game-ii.js`
    ),
    new ContractSolver(
        ContractTypes.COMPRESSION_1,
        `contracts/compression-i-rle-compression.js`
    ),
    new ContractSolver(
        ContractTypes.COMPRESSION_2,
        `contracts/compression-ii-lz-decompression.js`
    ),
    // new ContractSolver(
    //     ContractTypes.COMPRESSION_3,
    //     `contracts/compression-iii-lz-compression.js`
    // ),
    new ContractSolver(
        ContractTypes.ENCRYPTION_1,
        `contracts/encryption-i-caesar-cipher.js`
    ),
    new ContractSolver(
        ContractTypes.ENCRYPTION_2,
        `contracts/encryption-ii-vigenere-cipher.js`
    ),
    new ContractSolver(
        ContractTypes.FIND_ALL_VALID_MATH_EXPRESSIONS,
        `contracts/find-all-valid-math-expressions.js`
    ),
    new ContractSolver(
        ContractTypes.FIND_LARGEST_PRIME_FACTOR,
        `contracts/find-largest-prime-factor.js`
    ),
    new ContractSolver(
        ContractTypes.GENERATE_IP_ADDRESSES,
        `contracts/generate-ip-addresses.js`
    ),
    new ContractSolver(
        ContractTypes.HAMMINGCODES_DECODE,
        `contracts/hammingcodes-encoded-binary-to-integer.js`
    ),
    new ContractSolver(
        ContractTypes.HAMMINGCODES_ENCODE,
        `contracts/hammingcodes-integer-to-encoded-binary.js`
    ),
    new ContractSolver(
        ContractTypes.MERGE_OVERLAPPING_INTERVALS,
        `contracts/merge-overlapping-intervals.js`
    ),
    new ContractSolver(
        ContractTypes.MINIMUM_PATH_SUM_IN_A_TRIANGLE,
        `contracts/minimum-path-sum-in-a-triangle.js`
    ),
    new ContractSolver(
        ContractTypes.PROPER_2_COLORING_OF_A_GRAPH,
        `contracts/proper-2-coloring-of-a-graph.js`
    ),
    new ContractSolver(
        ContractTypes.SANITIZE_PARENTHESES_IN_EXPRESSION,
        `contracts/sanitize-parentheses-in-expression.js`
    ),
    new ContractSolver(
        ContractTypes.SHORTEST_PATH_IN_A_GRID,
        `contracts/shortest-path-in-a-grid.js`
    ),
    new ContractSolver(
        ContractTypes.SPIRALIZE_MATRIX,
        `contracts/spiralize-matrix.js`
    ),
    new ContractSolver(
        ContractTypes.SUBARRAY_WITH_MAXIMUM_SUM,
        `contracts/subarray-with-maximum-sum.js`
    ),
    new ContractSolver(
        ContractTypes.TOTAL_WAYS_TO_SUM_1,
        `contracts/total-ways-to-sum.js`,
        (input) => [input, [...Array(input).keys()].filter((a) => a > 0)]
    ),
    new ContractSolver(
        ContractTypes.TOTAL_WAYS_TO_SUM_2,
        `contracts/total-ways-to-sum.js`
    ),
    new ContractSolver(
        ContractTypes.UNIQUE_PATHS_IN_A_GRID_1,
        `contracts/unique-paths-in-a-grid.js`,
        (input) =>
            Array(input[0])
                .fill(null)
                .map(() => Array(input[1]).fill(0))
    ),
    new ContractSolver(
        ContractTypes.UNIQUE_PATHS_IN_A_GRID_2,
        `contracts/unique-paths-in-a-grid.js`
    ),
];
