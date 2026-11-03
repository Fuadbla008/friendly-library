export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function formatDate(value, options = {}) {
  if (!value) return "—";
  const merged = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  };
  Object.keys(merged).forEach((key) => {
    if (merged[key] === undefined) delete merged[key];
  });
  return new Intl.DateTimeFormat("en-US", merged).format(new Date(value));
}

export function daysUntil(value) {
  const target = new Date(value);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end - start) / 86400000);
}

export function loanStatus(value) {
  const days = daysUntil(value);
  if (days < 0) {
    return {
      key: "overdue",
      label: `${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} overdue`,
      tone: "bg-[#f4dfd6] text-[#9c3f27] border-[#e4b7a8]",
    };
  }
  if (days === 0) {
    return {
      key: "today",
      label: "Due today",
      tone: "bg-[#f6e7c8] text-[#7a5620] border-[#e8d09b]",
    };
  }
  if (days <= 3) {
    return {
      key: "soon",
      label: `Due in ${days} ${days === 1 ? "day" : "days"}`,
      tone: "bg-[#f6e7c8] text-[#7a5620] border-[#e8d09b]",
    };
  }
  return {
    key: "ok",
    label: `Due in ${days} days`,
    tone: "bg-[#e2ebe2] text-[#2f5b49] border-[#c2d5c6]",
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function resizeImage(file, maxWidth = 720, maxHeight = 1080, quality = 0.82) {
  return new Promise((resolve, reject) => {
    readFileAsDataUrl(file)
      .then((src) => {
        const image = new Image();
        image.onload = () => {
          const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * ratio);
          canvas.height = Math.round(image.height * ratio);
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        image.onerror = reject;
        image.src = src;
      })
      .catch(reject);
  });
}
