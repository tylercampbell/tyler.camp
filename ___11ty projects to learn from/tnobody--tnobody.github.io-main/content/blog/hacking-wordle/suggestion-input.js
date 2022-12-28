import { useCallback } from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
import { html } from "https://unpkg.com/htm/preact/index.mjs?module";
import { LetterInput } from "./letter-input.js";
import { createWordleLine, preventDefault, replaceAt } from "./utils.js";

export const SuggestionInput = ({ wordleLines, onChange }) => {
  const handleValueChange = useCallback(
    (v, guessIndex, pos) => {
      const line = wordleLines[guessIndex];
      onChange(replaceAt(wordleLines, guessIndex, replaceAt(line, pos, v)));
    },
    [wordleLines]
  );

  const handleDeleteAt = useCallback(
    (deleteAt) => {
      const wl = [...wordleLines];
      const _arr = [...wl];
      _arr.splice(deleteAt, 1);
      onChange(_arr);
    },
    [wordleLines]
  );

  const addLine = preventDefault((e) => {
    onChange([...wordleLines, createWordleLine()]);
  });

  return html`
    <ul class="list-none flex flex-col gap-8">
      ${wordleLines.map(
        (line, guessIndex) => html`
          <li>
            <ul class="list-none flex gap-4 items-center">
              ${line.map(
                (l, pos) =>
                  html`
                    <${LetterInput}
                      value=${l}
                      onChange=${(v) => handleValueChange(v, guessIndex, pos)}
                    />
                  `
              )}
              <li>
                <button
                  onClick=${preventDefault(() => handleDeleteAt(guessIndex))}
                  disabled=${guessIndex === 0}
                  class="disabled:opacity-20 bg-red-900 font-bold px-4 py-2"
                >
                  ×
                </button>
              </li>
            </ul>
          </li>
        `
      )}
    </ul>
    <div class="flex justify-end">
      <button onClick=${addLine} class="bg-green-900 font-bold px-4 py-2">
        +
      </button>
    </div>
  `;
};
