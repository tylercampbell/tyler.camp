import { html, render } from "https://unpkg.com/htm/preact/index.mjs?module";
import {
  useState,
  useCallback,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
import { SuggestionInput } from "./suggestion-input.js";
import { createWordleLine } from "./utils.js";

function SuggestionForm() {
  const [wordleLines, setWordleLines] = useState([createWordleLine()]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getSuggestions = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const paramState = wordleLines
        .map((line) =>
          line.map(({ letter, state }) => `${letter}:${state}`).join(",")
        )
        .join(";");
      try {
        const sugg = await fetch(
          `/api/hacking-wordle?state=${paramState}`
        ).then((r) => r.json());
        setSuggestions(sugg);
      } finally {
        setIsLoading(false);
      }
    },
    [wordleLines]
  );

  return html`
    <form onSubmit=${getSuggestions} class="not-prose flex flex-col gap-4">
      <${SuggestionInput}
        wordleLines=${wordleLines}
        onChange=${setWordleLines}
      />
      <hr />
      <button
        disabled=${isLoading}
        type="submit"
        class="bg-green-900 px-4 py-2 "
      >
        Get suggestions
      </button>
    </form>

    ${isLoading
      ? html`
          <table class="animate-pulse">
            <tr>
              <th>Word</th>
              <th>Score</th>
            </tr>
            ${Array(10)
              .fill(null)
              .map(
                () => html`
                  <tr>
                    <td class="p-2">
                      <div
                        style=${{
                          "--tw-scale-x": Math.random() * (1 - 0.6) + 0.6,
                        }}
                        class="h-4 transform origin-left rounded w-4/5 bg-green-900"
                      ></div>
                    </td>
                    <td>
                      <div
                        style=${{
                          "--tw-scale-x": Math.random() * (1 - 0.6) + 0.6,
                        }}
                        class="h-4 transform origin-left rounded w-4/5 bg-green-900"
                      ></div>
                    </td>
                  </tr>
                `
              )}
          </table>
        `
      : html`
          <table class="text-l">
            <tr>
              <th>Word</th>
              <th>Score</th>
            </tr>
            ${suggestions.map(
              ([score, word]) => html`
                <tr>
                  <td class="p-2">${word}</td>
                  <td>${score}</td>
                </tr>
              `
            )}
          </table>
        `}
  `;
}

render(html`<${SuggestionForm} />`, document.querySelector("#suggestion-form"));
