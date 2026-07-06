function areProcessingDirectivesSupported() {
  const el = document.createElement("div");
  el.innerHTML = "<?marker name=a><?start name=b><?end>";
  return Array.from(el.childNodes).every((node) => node.nodeType === 7);
}

function areInvokerCommandsSupported() {
  const CommandEventCtor = (
    globalThis as typeof globalThis & {
      CommandEvent?: { prototype?: object };
    }
  ).CommandEvent;

  return (
    typeof HTMLButtonElement !== "undefined" &&
    "command" in HTMLButtonElement.prototype &&
    "source" in (CommandEventCtor?.prototype ?? {})
  );
}

function installPolyfills() {
  if (!areProcessingDirectivesSupported()) {
    void import("template-for-polyfill").catch(console.error.bind(console));
  }

  if (!areInvokerCommandsSupported()) {
    void import("invokers-polyfill").catch(console.error.bind(console));
  }
}

function applyStoredTheme() {
  const theme = localStorage.getItem("theme");

  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

installPolyfills();
applyStoredTheme();
window.addEventListener("pageshow", applyStoredTheme);
