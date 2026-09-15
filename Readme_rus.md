# JSBase
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)
![Version](https://img.shields.io/badge/version-v3.2.1-blue.svg)
![js_badge](https://img.shields.io/badge/Functions-JavaScript-yellow)

JSBase - браузерный набор функций для проверки форм, AJAX-навигации, выбора языка, cookie, диалогов и небольших DOM-утилит. До `jsbase.js` или `jsbase_ru.js` необходимо подключить jQuery.

## Быстрый Старт

Сначала подключите jQuery, затем требуемый вариант JSBase:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="/src/jsbase_ru.js"></script>
```

При необходимости до начала работы переопределите глобальные настройки: `default_url`, `default_id`, `default_method`, `dir_local` и параметры cookie. Для вывода диагностических сообщений в консоль установите `loggen = true`.

## Безопасные AJAX-Ответы

`sendForm`, `getPageID` и `getPageURL` принимают JSON-ответы с полями `error`, `alert`, `html`, `url`, `title`, `set_url` и `script`.

По умолчанию значения из ответа отображаются как обычный текст. Чтобы отрисовывать HTML, подключите [DOMPurify](https://github.com/cure53/DOMPurify) до JSBase: библиотека очистит HTML перед вставкой в DOM. Пользовательские данные необходимо очищать и на стороне сервера.

Скрипты из ответа больше не выполняются как строки JavaScript. Разрешённый обработчик необходимо явно зарегистрировать:

```js
registerResponseHandler('initEditor', function (text, enabled) {
		// Инициализация пользовательского интерфейса.
});
```

Сервер должен передавать аргументы массивом:

```json
{
	"script": {
		"function": "initEditor",
		"args": ["text", true]
	}
}
```

Незарегистрированные обработчики игнорируются. Навигация допускает только URL со схемами `http:` и `https:`, а `includeJS` разрешает загрузку скриптов только с текущего origin.

## Интеграция С Браузером

JSBase использует события `load`, `keyup` и `popstate`. Обработчики регистрируются через `addEventListener`, поэтому не заменяют обработчики основного приложения. Языковые функции подключают первый доступный файл из каталога `languages/`.

English documentation: [README.md](README.md). Сведения о выпусках и миграции: [CHANGELOG.md](CHANGELOG.md).
