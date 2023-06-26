const BREAKPOINTS = [
  {
    label: "sm",
    width: 640,
    peerClass: "peer/sm",
    peerCheckedClass: "peer-checked/sm",
  },
  {
    label: "md",
    width: 768,
    peerClass: "peer/md",
    peerCheckedClass: "peer-checked/md",
  },
  {
    label: "lg",
    width: 1024,
    peerClass: "peer/lg",
    peerCheckedClass: "peer-checked/lg",
  },
  {
    label: "xl",
    width: 1280,
    peerClass: "peer/xl",
    peerCheckedClass: "peer-checked/xl",
  },
  {
    label: "2xl",
    width: 1536,
    peerClass: "peer/2xl",
    peerCheckedClass: "peer-checked/2xl",
  },
  // TODO - ADD FULL
];

// TODO - SWTICH TO TEMPLATES
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
const createBreakpointContainer = ({ label, width }, url) => {
  const div = document.createElement("div");
  div.id = label;
  div.className = `breakpoint-container`;
  div.innerHTML = `
    <div class="flex justify-between mb-1">
      <h2 class="font-mono">${label}</h2>
    </div>
    <iframe src="${url}" id="iframe" class="${label}"></iframe>
  `;

  const orientation = document.querySelector(
    "input[name=orientation]:checked"
  )?.value;

  const height = orientation === "landscape" ? width * 0.5625 : width * 1.7778;

  const iframe = div.querySelector("iframe");
  iframe.style.height = `${height}px`;
  iframe.style.width = `${width}px`;

  return div;
};

const getActiveBreakpoints = () => {
  const breakpoints = document.querySelectorAll("input[type=checkbox]:checked");
  const activeBreakpoint = Array.from(breakpoints).map((b) => b.id);
  return BREAKPOINTS.filter((b) => activeBreakpoint.includes(b.label));
};

const setAllBreakpoints = (state) => {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = state;
  });
};

const drawBreakpoints = () => {
  const url = document.getElementById("url-input").value;
  const panesContainer = document.getElementById("panes-container");
  panesContainer.innerHTML = "";

  // TODO - DON'T RECREATE ALL PANES WHEN IN SINGLE MODE
  const activeBreakpoints = getActiveBreakpoints();
  activeBreakpoints.forEach((breakpoint) => {
    const elem = createBreakpointContainer(breakpoint, url);
    panesContainer.appendChild(elem);
  });
};

// Hello, DOM!
document.addEventListener("DOMContentLoaded", (event) => {
  const urlInput = document.getElementById("url-input");
  urlInput.value =
    localStorage.getItem("url") || "https://winded.inttodouble.com/test";

  urlInput.addEventListener("change", (event) => {
    localStorage.setItem("url", event.target.value);
    drawBreakpoints();
  });

  // Orientation
  const radios = document.querySelectorAll("input[name=orientation]");
  radios.forEach((radio) => {
    radio.addEventListener("change", drawBreakpoints);
  });

  // Mode
  const modeRadios = document.querySelectorAll("input[name=mode]");
  modeRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "single") {
        setAllBreakpoints(false);
        const firstBox = document.querySelector("input[type=checkbox]");
        firstBox.checked = true;
      } else {
        setAllBreakpoints(true);
      }

      drawBreakpoints();
    });
  });

  // Breakpoints
  const breakpointBoxes = document.querySelectorAll("input[type=checkbox]");
  breakpointBoxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const mode = document.querySelector("input[name=mode]:checked").value;
      if (mode === "single") {
        setAllBreakpoints(false);
        checkbox.checked = true;
      }
      drawBreakpoints();
    });
  });

  const helpButton = document.getElementById("help-button");
  helpButton.addEventListener("click", () => {
    urlInput.value = "https://winded.inttodouble.com/test";
    drawBreakpoints();
  });

  drawBreakpoints();
});
