---
sizes:
  - class: "w-24"
    value: "width: 6rem"
  - class: "w-1/2"
    value: "width: 50%"
  - class: "w-screen"
    value: "width: 100vw"
---

<!-- markdownlint-disable -->

## Size Utilities

<div class=" flex flex-col space-y-4">
{% for size in sizes %}

  <div class="fragment flex space-x-4 items-center justify-center font-mono">
    <span>
    .{{size.class}}
    </span>
    <svg
      class="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
    <span>{{size.value}}</span>
  </div>
  <div  class="fragment h-24 min-w-24 {{size.class}} bg-green-700 rounded"></div>
{% endfor %}
</div>
