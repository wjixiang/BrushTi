import { Plugin } from "obsidian";

const ALL_EMOJIS: Record<string, string> = {
  ":+1:": "👍",
  ":sunglasses:": "😎",
  ":smile:": "😄",
};

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((element, context) => {
      const codeblocks = element.findAll("task");

      for (let codeblock of codeblocks) {
        const text = codeblock.innerText.trim();
        if (text[0] === ":" && text[text.length - 1] === ":") {
          const emojiEl = codeblock.createSpan({
            text: ALL_EMOJIS[text] ?? text,
          });
          codeblock.replaceWith(emojiEl);
        }
      }
    });
  }
}
