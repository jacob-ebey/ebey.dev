import type { JSXProps } from "srv-jsx";

export function Header({
  mainLink,
  open,
}: {
  mainLink?: string;
  open?: boolean;
} & JSXProps) {
  return (
    <header role="banner" class="header">
      {open ? (
        <span class="sr-only">ebey.dev</span>
      ) : (
        <a href={mainLink ?? "/"}>ebey.dev</a>
      )}
      <nav aria-label="Primary">
        <ul>
          {open ? (
            <li>
              <a
                href="/"
                aria-label="Close"
                title="Close"
                onclick={(event) => {
                  "use client";

                  event.preventDefault();
                  if (globalThis.history.length) {
                    globalThis.history.back();
                  } else {
                    globalThis.location.href = "/";
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </a>
            </li>
          ) : (
            <>
              <li>
                <a
                  aria-current="page"
                  href="/subscribe"
                  aria-label="Subscribe"
                  title="Subscribe"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                  >
                    <path d="M106.91,149.09A71.53,71.53,0,0,1,128,200a8,8,0,0,1-16,0,56,56,0,0,0-56-56,8,8,0,0,1,0-16A71.53,71.53,0,0,1,106.91,149.09ZM56,80a8,8,0,0,0,0,16A104,104,0,0,1,160,200a8,8,0,0,0,16,0A120,120,0,0,0,56,80Zm118.79,1.21A166.9,166.9,0,0,0,56,32a8,8,0,0,0,0,16A151,151,0,0,1,163.48,92.52,151,151,0,0,1,208,200a8,8,0,0,0,16,0A166.9,166.9,0,0,0,174.79,81.21ZM60,184a12,12,0,1,0,12,12A12,12,0,0,0,60,184Z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="/menu" aria-label="Menu" title="Menu">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                    />
                  </svg>
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
