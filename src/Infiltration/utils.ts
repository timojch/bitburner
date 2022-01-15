export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getArrow(event: KeyboardEvent): string {
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "8":
      return "↑";
    case "ArrowLeft":
    case "a":
    case "4":
      return "←";
    case "ArrowDown":
    case "s":
    case "2":
      return "↓";
    case "ArrowRight":
    case "d":
    case "6":
      return "→";
    case "1":
      return "←↓";
    case "3":
      return "→↓";
    case "7":
      return "←↑";
    case "9":
      return "→↑";
  }
  return "";
}
