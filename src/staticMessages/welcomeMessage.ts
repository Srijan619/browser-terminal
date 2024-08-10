import { marked } from "marked";

export const WELCOME_MESSAGE = marked.parse(`
# Welcome to My Project!

Hello! I'm Srijan, and I'm excited to share my work with you. Below is a little bird to brighten your day:

<div class="bird">
<pre>
      \\
       (o>
    \\_//)
     \_/_)
      _|_
</pre>
</div>

Feel free to explore the project and reach out if you have any questions! Start with \`help\` command?
`);
