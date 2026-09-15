# JSBase
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)
![Version](https://img.shields.io/badge/version-v3.2.0-blue.svg)
![js_badge](https://img.shields.io/badge/Functions-JavaScript-yellow)

JSBase is a browser-side collection of form validation, AJAX navigation, language selection, cookies, dialogs, and small DOM helpers. It requires jQuery to be loaded before `jsbase.js` or `jsbase_ru.js`.

## Getting Started

Include jQuery first, then the required JSBase variant:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="/jsbase.js"></script>
```

Set the global configuration variables before use when the defaults do not match your application. Important values include `default_url`, `default_id`, `default_method`, `dir_local`, and the cookie options. Set `loggen` to `true` to enable diagnostic messages in the browser console.

## Secure AJAX Responses

`sendForm`, `getPageID`, and `getPageURL` accept JSON responses with fields such as `error`, `alert`, `html`, `url`, `title`, `set_url`, and `script`.

Response values are rendered as plain text by default. To render server-provided HTML, load [DOMPurify](https://github.com/cure53/DOMPurify) before JSBase; it sanitizes the response before insertion. Treat every API response as untrusted and sanitize user-provided content on the server as well.

Response scripts are no longer evaluated as JavaScript strings. Register each allowed handler explicitly:

```js
registerResponseHandler('initEditor', function (text, enabled) {
		// Initialize application UI here.
});
```

The corresponding server response must use an argument array:

```json
{
	"script": {
		"function": "initEditor",
		"args": ["text", true]
	}
}
```

Unregistered handlers are ignored. Navigation accepts only `http:` and `https:` URLs; `includeJS` accepts scripts from the current origin only.

## Browser Integration

JSBase uses the `load`, `keyup`, and `popstate` events. Event handlers are registered with `addEventListener`, so they do not replace handlers registered by the host application. The language helpers load the first available language script from `languages/`.

For Russian documentation, see [Readme_rus.md](Readme_rus.md). See [CHANGELOG.md](CHANGELOG.md) for migration notes and release history.
