import {
  useCallback,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
import { html } from "https://unpkg.com/htm/preact/index.mjs?module";
import { preventDefault } from "./utils.js";

const findNextInput = (el) => {
  const inputs = Array.from(el.closest("ul").querySelectorAll("input"));
  const inputIndex = inputs.findIndex((input) => input === el);
  return inputs[inputIndex + 1];
};

const States = {
  ignore: "I",
  required: "R",
  correct: "C",
};

export const LetterInput = ({ value, onChange }) => {
  const { letter, state } = value;
  const handleCorrect = preventDefault((e) => {
    onChange({
      letter,
      state: state === States.correct ? States.ignore : States.correct,
    });
  });

  const handleRequired = preventDefault((e) => {
    onChange({
      letter,
      state: state === States.required ? States.ignore : States.required,
    });
  });

  const handleInputChanged = preventDefault((e) => {
    if (e.target.value !== letter) {
      onChange({ state, letter: e.target.value });
    }
    if (/^[a-zA-Z]$/.test(e.key)) {
      findNextInput(e.target)?.focus();
    }
  });

  const handleFocus = useCallback((e) => {
    e.target.select();
  }, []);

  const backgrounds = {
    [States.ignore]: "bg-transparent",
    [States.correct]: "bg-[#538d4e]",
    [States.required]: "bg-[#b59f3b]",
  };
  return html`
    <li class="flex flex-col border-[#3a3a3c] border focus-within:outline">
      <button
        onClick=${handleCorrect}
        class="h-6 ${state !== States.required
          ? backgrounds[States.correct]
          : "bg-transparent"}"
      ></button>
      <input
        maxlength="1"
        value=${letter}
        onFocus=${handleFocus}
        onKeyup=${handleInputChanged}
        class="uppercase border-0 focus:outline-none p-2 text-xl font-bold text-center ${backgrounds[
          state
        ]}"
        type="text"
      />
      <button
        onClick=${handleRequired}
        class="h-6 ${state !== States.correct
          ? backgrounds[States.required]
          : "bg-transparent"}"
      ></button>
    </li>
  `;
};
