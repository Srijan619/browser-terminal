import { marked } from "marked";

export const NEATJS_PROJECT_DESCRIPTION = marked.parse(`
# Welcome to NEATjs!

NEATjs is a lightweight JavaScript library designed to demonstrate the principles of reactivity and simplification of frameworks. It offers a clear and concise way to understand how reactive programming works, along with a few examples to illustrate the concepts.

## Features

- **Reactive Programming**: Learn how reactivity can be implemented in a simple and intuitive manner.
- **Framework Simplification**: Explore how complex frameworks can be simplified for easier understanding and usage.
- **Example Use Cases**: Check out several practical examples that showcase reactivity in action.

## Getting Started

To get started with NEATjs, clone the repository and install the necessary dependencies:

\`\`\`bash
git clone https://github.com/Srijan619/NEATjs.git
cd NEATjs
npm install
\`\`\`

## Example Usage

Here's a simple example demonstrating the reactivity provided by NEATjs:

\`\`\`javascript
import { reactive } from './path/to/neat.js';

const state = reactive({
    count: 0
});

function increment() {
    state.count++;
}

console.log(state.count); // Outputs the current count
increment();
console.log(state.count); // Outputs the updated count
\`\`\`

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

Feel free to explore the project, experiment with the code, and reach out if you have any questions!
`);
