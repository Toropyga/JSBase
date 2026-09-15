# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.1] - 2026-09-15

### Changed

- Moved all source files into the `src/` directory (`jsbase.js`, `jsbase_ru.js`, `languages/`).
- Updated `README.md` and `README_rus.md` include examples to reference the new `src/` path.

## [3.2.0] - 2026-09-15

### Added

- `registerResponseHandler(name, handler)` for explicitly registering post-response handlers.
- Support for passing handler arguments through `script.args` as an array.
- Safe URL validation for redirects, navigation, and dynamically included scripts.
- Safe response rendering with DOMPurify when it is available, with a plain-text fallback otherwise.

### Changed

- `jsbase.js` and `jsbase_ru.js` now use the same executable implementation.
- `popstate` handlers use `addEventListener` and no longer replace host application handlers.
- Anchor navigation resolves element IDs with `document.getElementById`.
- `window.open` clears the opened window's `opener` reference.

### Security

- Removed dynamic execution of server response strings through `new Function`.
- Server response content is escaped or sanitized before it is inserted into the DOM.
- Confirmation dialog text and notification text are escaped before rendering.
- Dynamic script loading is restricted to the current origin.
- Navigation rejects URL schemes other than `http:` and `https:`.

### Migration Notes

- Replace server responses in the former format `{ "script": { "function": "initEditor", "arg": "..." } }` with `{ "script": { "function": "initEditor", "args": [] } }`.
- Register every permitted handler in the client with `registerResponseHandler`. Unknown handler names are ignored.
- Load DOMPurify before JSBase when AJAX responses intentionally contain HTML. Without DOMPurify, those responses are displayed as plain text.

## [3.1.2] - 2023-05-13

### Changed

- Updated the `ShowHide` function.

[3.2.1]: https://github.com/toropyga/JSBase/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/toropyga/JSBase/compare/v3.1.2...v3.2.0
[3.1.2]: https://github.com/toropyga/JSBase/releases/tag/v3.1.2
