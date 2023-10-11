const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.code.toLocaleLowerCase() === "space") {
    setRandomColors();
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;

  if (type === "lock") {
    const node =
      event.target.tagName.toLocaleLowerCase() === "i"
        ? event.target
        : event.target.children[0];

    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickBoard(event.target.textContent);
  }
});

const generateRandomColor = () => {
  const hexCodes = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }
  return "#" + color;
};

const copyToClickBoard = (text) => {
  return navigator.clipboard.writeText(text);
};

const setRandomColors = (isInitial) => {
  const colors = isInitial ? getColorFromHash() : [];

  cols.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const text = col.querySelector("h2");
    const button = col.querySelector("button");

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) colors.push(color);

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });

  updateColorsHash(colors);
};

const setTextColor = (text, color) => {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
};

const updateColorsHash = (colors = []) => {
  document.location.hash = colors
    .map((col) => col.toString().substring(1))
    .join("-");
};

const getColorFromHash = () => {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
};

setRandomColors(true);

const bind = (context, fn) => {
  return function (...args) {
    fn.apply(context, args);
  };
};

function logPerson() {
  console.log(`Person: ${this.name}, ${this.age}, ${this.job}`);
}

const person1 = { name: "Igor", age: 27, job: "FE" };
const person2 = { name: "Alice", age: 27, job: "HR" };

bind(person1, logPerson);
bind(person2, logPerson);
