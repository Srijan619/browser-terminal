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

What does this terminal support?

1. Few of the native <code>zsh</code> terminal features to lighten your mood.
2. Navigate through <code>history</code> of commands used using up and down arrow.
3. Still using <code>cat</code> is not too outdated, right?
4. Customize your terminal with top right setting icon, mine favourite is <code>solarized</code>.

And many more to follow in the near future :) Feel free to explore the project and reach out if you have any questions! Start with \`help\` command?
`);
