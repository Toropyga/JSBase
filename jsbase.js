/**
 * JavaScript functions
 * @author: Yuri Frantsevich (FYN)
 * Email: frantsevich@gmail.com | fyn@tut.by
 * Version: 3.0.2
 */
//  +---------------------------------------+
//  |              Description              |
//  +---------------------------------------+

/**
 * A set of basic functions for JavaScript
 *
 * The functions use the loggen variable (true/false),
 * responsible for displaying information about the progress in the console and
 * the results of the functions. It is declared in the body of the script.
 * See "Global Variables"
 *
 * For the creation and correct operation of the visual block "Loading"
 * global variable bg is used
 *
 * For the functions to work correctly, you need to connect the JQuery library
 * The latest version of jQuery is located at: https://jquery.com
 */

//  +---------------------------------------+
//  |            Global Variables           |
//  |  (for the scripts to work correctly)  |
//  +---------------------------------------+

let loggen              = false;                // output of information about the operation of functions to the console yes/no (1/0 or true/false)
let animation_time      = 2500;                 // time in ms for animation
let default_url         = './index.php';        // the URL to which the default form data is send
let default_method      = 'POST';               // default method used for data transfer (GET/POST)
let default_type        = 'json';               // the default data type used when sending data to the server
let default_id          = 'content';            // ID of the default block in which the AJAX response is output after submitting the form
let bg                  = {};                   // the object being created that displays the data loading animation
let show_loader         = true;                 // display or not animation for data loading
let no_history          = 0;                    // write or not the transition to the browser history (0 - write, 1 - not write)

let cookie_domain       = 'localhost';          // current domain for cookies
let cookie_path         = '/';                  // path for cookies
let cookie_expires      = 600;                  // lifetime for cookies
let cookie_secure       = true;                 // cookies are transmitted over a secure protocol yes/no (1/0 or true/false)
let cookie_simesite     = 'Lax';                // cross-site interaction
                                                // «Strict» — a complete ban on sending cookies to third-party sites.
                                                // «Lax» — some cookies are blocked for cross-site requests (images or iframes).
                                                // «None» — no restrictions on cookies .
// language settings
let dir_local           = '/languages/';   	    // the default path to the directory (folder) where the language JS files are located
let file_local          = 'lang_';              // default language JS file name prefix
let default_lang        = 'ru';                 // default language file
let language            = [];                   // language array
let lang_use            = 'en';                 // default language
let lang_key            = '';
let send_status         = false;                // data sending status

// console CSS style
let CSS_Style                 = {
    'h1': 'font: bold 16px Arial; color: #ff0dff;',
    'h2': 'font: bold 14px Arial; color: #ff0dff;',
    'h3': 'font: bold 11px Arial; color: #ff0dff;',
    'bold': 'font-weight: bold;',
    'error': 'font-weight: bold; color: #ff0000;',
    'warn': 'padding: 1px 4px; background: #42381f; font: 11px Arial; color: #ef9e00;',
    'alert': 'padding: 1px 4px; background: #ff0000; font: 11px Arial; color: #ffffff;',
    'red': 'color: #cf1313;',
    'green': 'color: #00ff00;',
    'blue': 'color: #209eff;',
    'orange': 'color: #ef9e00;',
    'clear': 'font: Arial;'
};
let css_confirm         = true;                 // use the style of the Confirm dialog of the MyConfirm function built into the script

let show_hide           = [];                   // an array containing information about the object to which the ShowHide function is applied and what state it is in
show_hide.count         = 0;                    // triggers count of function ShowHide

//  +---------------------------------------+
//  |          Base functions block         |
//  +---------------------------------------+

/**
 * Checking the completeness of the form before saving
 * Validation is carried out by the presence of the "required" parameter in the form field
 * If there is an error, the cursor moves to the field containing the error
 * @param name - form ID
 * @return {boolean} true - there are errors, false - no errors
 */
function checkRequired(name) {
    if (loggen) {
        console.group("checkRequired");
        console.time("checkRequired");
        console.log("Form ID: %c" + name, CSS_Style.green);
    }
    if (!name || !document.getElementById(name)) {
        if (loggen) {
            console.error("Name ERROR: %c" + name, CSS_Style.orange);
            console.timeEnd("checkRequired");
            console.groupEnd();
        }
        return true;
    }
    else name = "#"+name;
    let form = $(name);
    if (loggen) console.log("Check form for required fields");
    let error = false;
    let field = '';
    form.find('input, textarea, select, radio, checkbox').each( function(){
        if ($(this).prop('required') && $(this).val() == '') {
            if (!field) field = $(this);
            error = true;
        }
    });
    if (error) {
        field.focus();
        if (loggen) console.warn("%cERROR %cRequired field ID: %c" + field.attr("id"), CSS_Style.red, CSS_Style.clear, CSS_Style.error);
    }
    if (loggen) {
        console.timeEnd("checkRequired");
        console.groupEnd();
    }
    return error;
}

/**
 * Form fields verification before saving
 * The verification is carried out for compliance with the regular expression specified in the pattern parameter
 * If there is an error, the cursor moves to the field containing the error
 * @param name - form ID
 * @return {boolean} true - there are errors, false - no errors
 */
function checkPattern(name) {
    if (loggen) {
        console.group("checkPattern");
        console.time("checkPattern");
        console.log("Form ID: %c" + name, CSS_Style.green);
    }
    if (!name || !document.getElementById(name)) {
        if (loggen) {
            console.error("Name ERROR: %c" + name, CSS_Style.orange);
            console.timeEnd("checkPattern");
            console.groupEnd();
        }
        return true;
    }
    else name = "#"+name;
    let form = $(name);
    if (loggen) console.log("Check form patterns");
    let error = false;
    let field = '';
    let pattern = '';
    let reg = '';
    let value = '';
    form.find('input, textarea, select, radio, checkbox').each( function(){
        pattern = $(this).prop('pattern');
        if (pattern) {
            pattern = pattern.replace('/\\/g', '\\\\');
            reg = new RegExp(pattern);
            value = $(this).val();
            if (value.length && !reg.test(value)) {
                if (!field) field = $(this);
                error = true;
            }
        }
    });
    if (error) {
        field.focus();
        if (loggen) console.warn("%cERROR %cPattern field ID: %c" + field.attr("id"), CSS_Style.red, CSS_Style.clear, CSS_Style.error);
    }
    if (loggen) {
        console.timeEnd("checkPattern");
        console.groupEnd();
    }
    return error;
}

/**
 * Генерация объекта "Ожидание загрузки" (Loading)
 * Деактивирует/активирует страницу в ожидании загрузки данных
 * Объект bg объявляется глобально в теле скрипта
 * -----------------------------------------------------------
 * Важен CSS-стиль для отображения
 * Пример CSS:
 *      .loading {
 *          border: 10px solid #f3f3f3;
 *          border-top: 10px solid #23475F;
 *          border-bottom: 10px solid #ff0000;
 *          border-radius: 50%;
 *          width: 80px;
 *          height: 80px;
 *          animation: spin 1.5s linear infinite;
 *          position: absolute;
 *          top: 40%;
 *          left: 50%;
 *          margin-right: -50%;
 *          transform: translate(-50%, -50%);
 *          z-index: 99;
 *          opacity: 1;
 *      }
 *      @keyframes spin {
 *          0% { transform: rotate(0deg); }
 *          100% { transform: rotate(360deg); }
 *      }
 *
 *      div.lin {
 *          border: 30px solid #ff0000;
 *          position: absolute;
 *          top: 10px;
 *          left: 10px;
 *          border-radius: 50%;
 *          width: 0px;
 *          height: 0px;
 *      }
 *
 *      .load {
 *          position: fixed;
 *          top: 0;
 *          left: 0;
 *          right: 0;
 *          bottom: 0;
 *          width: 100%;
 *          min-height: 100%;
 *          background: #ffffff;
 *          opacity: 0.8;
 *          z-index: 88 !important;
 *          animation: fadeIn 1s linear;
 *      }
 *      @keyframes fadeIn {
 *          0% { opacity: 0; }
 *          100% { opacity: 0.8; }
 *      }
 * -----------------------------------------------------------
 * @param stop - если передан параметр (true, !=0), то удаляет объект и активирует страницу
 * @return {boolean} true
 */
function Loader(stop) {
    if (show_loader) {
        if (stop) {
            if (bg.parentNode) {
                if (loggen) {
                    console.group("Loader");
                    console.time("Loader");
                    console.log("Loader: %cSTOP", CSS_Style.red);
                }
                bg.parentNode.removeChild(bg);
                if (loggen) {
                    console.timeEnd("Loader");
                    console.groupEnd();
                }
            }
        }
        else {
            if (!bg.parentNode) {
                if (loggen) {
                    console.group("Loader");
                    console.time("Loader");
                    console.log("Loader: %cSTART", CSS_Style.green);
                }
                // создание объекта
                // стили см. в описании к функции
                bg = document.createElement('div');
                bg.innerHTML = '<div class="loading"><div class="lin"></div></div>';
                bg.className = 'load';
                document.body.appendChild(bg);
                if (loggen) {
                    console.timeEnd("Loader");
                    console.groupEnd();
                }
            }
        }
    }
    return true;
}

/**
 * Отображение информационного блока и переданного текста
 * @param text - отображаемый текст
 * @param time - время отображения блока
 * @param style - стилевой класс для блока
 * Возможный стиль для класса alert:
 *  .alert {
 *      position: fixed;
 *      min-width: 200px;
 *      min-height: 40px;
 *      background-color: #ffffff;
 *      border: 1px solid #FA751C;
 *      color: #FA751C;
 *      top: 50%;
 *      left: 50%;
 *      transform: translate(-50%, -50%);
 *      border-radius: 10px 10px 10px 10px;
 *      padding: 30px 20px 10px 20px;
 *      text-align: center;
 *      z-index: 90;
 *  }
 * @return {boolean} false
 */
function showAlert (text, time, style) {
    if (!style) style = 'alert';
    if (!time) time = animation_time;
    if (loggen) {
        console.group("showAlert");
        console.time("showAlert");
        console.log("Text: %c" + text, CSS_Style.blue);
        console.log("Time: %c" + time, CSS_Style.orange);
        console.log("Style: %c" + style, CSS_Style.orange);
    }
    let div = document.createElement('div');
    div.className = style;
    div.innerHTML = text;
    document.body.appendChild(div);
    setTimeout(function() {
        div.parentNode.removeChild(div);
    }, time);
    if (loggen) {
        console.log("Done");
        console.timeEnd("showAlert");
        console.groupEnd();
    }
    return false;
}

/**
 * AJAX функция передачи данных из формы по ID
 * Выполняется проверка полноты и правильности заполнения
 * Все параметры по умолчанию прописываются в блоке "Глобальные переменные"
 *
 * Пример:
 * <div id="content">
 * <form id="form_id" action="./?page=page_id" method="post" onsubmit="return sendForm(this.id, 'content');">
 *     <input ....>
 *     <button type="submit">Send</button>
 * </form>
 * </div>
 *
 * или в JS-функции
 *
 * if (sendForm('form_id', 'content', true) {
 *      document.location = '/';
 * }
 *
 * +--------------------------------------------------+
 * |              Передаваемые параметры              |
 * +--------------------------------------------------+
 * @param name  -   ID формы
 * @param id    -   ID блока вывода ответа, если не указан, то параметр по умолчанию
 * @param back  -   какой ответ возвращает функция (по умолчанию - false):
 *                      true - если нет ошибок вернёт true, в противном случае - false
 *                      false - всегда вернёт false
 * @param type  -   тип данных, используемый при передаче данных на сервер (json или jsonp), если отсутствует, то тип по умолчанию
 *
 * -- необязательные параметры, которые можем получить из формы или, если отсутствуют, из переменных по умолчанию
 * @param url       -   URL на который передаём
 * @param method    -   метод, используемый для передачи данных (GET/POST)
 *
 * +--------------------------------------------------+
 * |             Возвращаемые параметры               |
 * +--------------------------------------------------+
 * Сервер может возвращать массив данных со следующими ключами:
 *          error {boolean}     -   наличие ошибки
 *          alert {string}      -   текст информационного сообщения или ошибки
 *          html {string}       -   HTML-текст для вывода на экран
 *          url {string}        -   URL на который надо перенаправить (происходит переход на указанный URL)
 *          no_error {boolean}  -   не отображать (true) или отображать сообщение об ошибке
 *          set_url {string}    -   адрес, который устанавливается в адресной строке браузера
 *          title {string}      -   новый заголовок страницы (<title>...</title>)
 *          script {string}     -   script, который надо выполнить по итогу (объект, содержащий два ключа: 'arg' и 'function', где 'arg' - аргументы функции, а 'function' - имя функции. Например, 'arg' => '"text", true', 'function' => 'initEditor')
 *
 * В возвращаемом массиве могут быть и иные данные в следующем формате: {key_id => html_text}, где
 *          key_id {string}     -   ID блока на странице, в котором будет заменёно содержимое,
 *          html_text {string}  -   HTML-текст, который отобразится в блоке с идентификатором key_id
 *
 * @returns {boolean}
 */
function sendForm (name, id, back, url, method, type) {
    let show_error = true;      // отобразить ли сообщение об ошибке если сервер вернул ошибку
    //let is_json = true;         // получаемый ответ в формате JSON
    let use_animation = true;   // использовать ли анимацию при смене страниц
    send_status = false;
    // если к url надо добавить ещё какие либо дополнительные параметры,
    // указываем их в переменной param
    // например: let param = 'param_1=value_1&param_2=value_2';
    let param = 'js=1';

    if (loggen) {
        console.group("sendForm");
        console.time("sendForm");
        console.log("Form ID: %c" + name, CSS_Style.green);
    }
    // проверяем наличие формы по переданному ID
    if (!document.getElementById(name)) {
        if (loggen) {
            console.timeEnd("sendForm");
            console.error("Form ID not found");
            console.groupEnd();
        }
        return false;
    }
    // вешаем заставку
    Loader();
    // проверяем наличие блока вывода по переданному ID
    let output = true;
    if (!id) {
        id = default_id;
        if (loggen) console.info("Output ID not transmitted! Using default ID %c"+id, CSS_Style.orange);
        if (!document.getElementById(id)) {
            if (loggen) console.warn("Default output block %c"+id+"%c not found!", CSS_Style.orange, CSS_Style.clear);
            output = false;
        }
    }
    else {
        if (!document.getElementById(id)) {
            if (loggen) console.warn("Output block %c"+id+"%c not found! Using default ID %c"+default_id, CSS_Style.orange, CSS_Style.clear, CSS_Style.orange);
            id = default_id;
            if (!document.getElementById(id)) {
                if (loggen) console.warn("Default output block %c"+id+"%c not found!", CSS_Style.orange, CSS_Style.clear);
                output = false;
            }
        }
        else if (loggen) console.log("Output block ID: %c"+id, CSS_Style.green);
    }
    if (!output) {
        if (loggen) console.warn("Output block not found!");
        Loader(true);
        if (loggen) {
            console.error("FAIL");
            console.timeEnd("sendForm");
            console.groupEnd();
        }
        return false;
    }
    // устанавливаем значение по умолчанию для ответа
    if (!back) back = false;
    // формируем ссылку на объект формы
    let form = $("#"+name);
    // определяем метод передачи данных
    if (!method) method = form.attr('method');
    if (!method) method = default_method;
    // определяем URL
    if (!url) url = form.attr('action');
    if (!url) url = default_url;
    let newurldata = url;
    if (param) {
        let reg = /^(.+)?(\/?\?.+)$/;
        if (loggen) console.log("Check param URL: %c"+newurldata, CSS_Style.blue);
        if (reg.test(newurldata)) url = newurldata.replace(reg, "$1$2&" + param);
        else {
            reg = /^(\/?[^\?]+)$/;
            if (reg.test(newurldata)) url = newurldata.replace(reg, "$1?" + param);
            else url = '/?'+param;
        }
        if (loggen) console.log("New URL: %c"+url, CSS_Style.green);
    }
    else url = newurldata;
    // определяем заголовок
    let title = 'Form';
    // определяем тип данных
    if (!type) type = default_type;
    // производим проверку на обязательность заполнения полей
    let error = checkRequired(name);
    // проводим проверку на правильность заполнения
    if (!error) error = checkPattern(name);
    // создаём объект перехода по ссылке для истории браузера
    let state = {};
    let script = {};
    let run_script  = 0;
    // начинаем отправку формы
    if (!error) {
        $("#"+name).each(function(){ $(this).removeClass('error_filed'); });
        if (loggen) console.log("Begin sending to url: %c"+url, CSS_Style.blue);
        let dt;                                                             // передаваемыее данные
        let c_type = "application/x-www-form-urlencoded; charset = UTF-8";  // content type
        let p_data = true;                                                  // process data
        let cache = true;
        // если форма может содержать передачу файлов, то устанавливаем дополнительные параметры
        if (form.attr('enctype') == 'multipart/form-data') {
            if (loggen) console.log("Send form %c"+name, CSS_Style.green);
            dt = new FormData(document.getElementById(name));
            cache = false;
            method = 'POST';
            c_type = false;
            p_data = false;
            type = false;
            if (loggen) {
                console.log("%cSend multipart data", CSS_Style.h3);
                console.log(dt);
            }
        }
        else {
            dt = form.serialize();
            if (loggen) console.log("%cSend data:\n%c"+dt, CSS_Style.h3, CSS_Style.orange);
        }
        $.ajax({
            type:           method,
            method:         method,
            url:            url,
            data:           dt,
            cache:          cache,
            contentType:    c_type,
            processData:    p_data,
            dataType:       type,
            success: function (data) {
                // результат работы
                if (loggen) {
                    console.log("%cReturn data:", CSS_Style.h3);
                    console.table(data);
                }
                // сервер вернул ошибку
                if (data.error) {
                    if (loggen) console.warn("ERROR return from server!");
                    if (!data.no_error && show_error) {
                        let txt = (data.alert)?data.alert:'ERROR return from server!';
                        showAlert(txt, (animation_time*2));
                    }
                }
                // с сервера пришло информационное сообщение
                else if (data.alert) {
                    if (loggen) console.info("Show alert from server");
                    showAlert(data.alert, (animation_time*2));
                }
                // пришло перенаправление на URL
                if (data.url) {
                    if (loggen) console.info("Go to URL: "+data.url);
                    document.location.href = data.url;
                    return true;
                }
                // с сервера пришёл HTML-текст
                if (data.html) {
                    if (output) {
                        if (loggen) console.log("Write HTML from server");
                        document.getElementById(id).innerHTML = data.html;
                    }
                }
                // перебор переданного массива (объекта) данных
                for (let key in data) {
                    if (key === 'error' || key === 'script' || key === 'alert' || key === 'set_url' || key === 'no_error' || key === 'html' || key === 'title' || key === 'error_field') continue;
                    if (!document.getElementById(key)) {
                        if (loggen) console.warn("ID %c"+key+"%c not found!", CSS_Style.orange, CSS_Style.clear);
                        continue;
                    }
                    let new_obj = $("#"+key);
                    if (use_animation) {
                        if (loggen) console.log("Set animation text for %c"+key, CSS_Style.green);
                        let value = data[key];
                        /*
                        //Альтернатива
                        new_obj.stop().fadeTo("slow", 0, function () {
                            new_obj.html(value);
                            new_obj.stop().fadeTo("slow", 1);
                        });
                        */
                        let type = new_obj.get(0).tagName.toLowerCase();
                        new_obj.fadeOut("slow", function () {
                            if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                            else new_obj.html(value);
                            new_obj.fadeIn("slow");
                        });
                    }
                    else {
                        let value = data[key];
                        if (loggen) console.log("Set static text for ID: %c" + key, CSS_Style.green);
                        let type = new_obj.get(0).tagName.toLowerCase();
                        if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                        else new_obj.html(value);
                    }
                }
                if (data.set_url) newurldata = data.set_url;
                if (data.title) document.title = data.title;
                if (data.script) {
                    run_script = 1;
                    script = data.script;
                }
                // выделяем поле ошибки
                if (data.error_field) {
                    let fld = $("[name='"+data.error_field+"']");
                    let info = fld.offset();
                    fld.focus().addClass("error_field");
                    setTimeout(function () {window.scrollTo(info['left'], (info['top']-50))}, 500);
                }
                if (data.error_fields) {
                    let counter = 0;
                    for (let key in data.error_fields) {
                        let fld = $("[name='" + key + "']");
                        let info = fld.offset();
                        fld.focus().addClass("error_field");
                        counter++;
                        if (counter === 1) {
                            setTimeout(function () {
                                window.scrollTo(info['left'], (info['top']-50))
                            }, 500);
                        }
                    }
                }
            }
        }).done(function () {
            send_status = true;
            // всё отработало хорошо
            state = { 'page_id': name, 'content_id': id, 'function': 'sendForm', 'url': url, 'data': dt };
            if (loggen) {
                console.log("%cSave to browser history:", CSS_Style.h3);
                console.table({'state': state});
                console.table({'title': title, 'new_url': newurldata});
            }
            if (!no_history) window.history.pushState(state, title, newurldata);
            else no_history = 0;
            if (run_script) {
                let param =  'setTimeout(function () { '+script.function+ '('+script.arg+'); }, '+animation_time/5+');'
                if (loggen) console.log("%cRun new script: %c "+param, CSS_Style.green, CSS_Style.orange);
                let run = new Function(param);
                run();
            }
            // снимаем заставку
            Loader(true);
            if (loggen) {
                console.log("%cSend status: %c"+send_status, CSS_Style.green, CSS_Style.red);
                console.log("%cSUCCESS", CSS_Style.green);
                console.timeEnd("sendForm");
                console.groupEnd();
            }
        }).fail(function () {
            // произошла ошибка в работе
            // снимаем заставку
            Loader(true);
            if (loggen) {
                console.error("FAIL");
                console.timeEnd("sendForm");
                console.groupEnd();
            }
            back = false;
        });
    }
    // возникли ошибки при проверке формы
    else {
        // снимаем заставку
        Loader(true);
        if (loggen) {
            console.error("Check form ERROR!");
            console.timeEnd("sendForm");
            console.groupEnd();
        }
        back = error;
    }
    return back;
}

/**
 * AJAX функция "перехода" по страницам с использованием ID гипперссылки без перезагрузки страницы браузера
 * Получает контент от сервера и отображает его на странице
 * Все параметры по умолчанию прописываются в блоке "Глобальные переменные"
 * Адрес запрашиваемой страницы (URL) берётся из параметра data-href или href
 *
 * Пример:
 * <div id="id_1" data-href="/index.php?param_x=value_x" onclick="return getPageID(this.id)" data-title="Новый заголовок страницы">
 *     или
 * <a id="id_2" href="/index.php?param_x=value_x" onclick="return getPageID(this.id)" data-title="Новый заголовок страницы" title="заголовок ссылки">
 *
 * +--------------------------------------------------+
 * |              Передаваемые параметры              |
 * +--------------------------------------------------+
 * @param name      -   ID гипперссылки
 * @param id        -   ID блока вывода ответа, если не указан, то параметр по умолчанию
 * @param method    -   метод, используемый для передачи данных (GET/POST), если отсутствует, то метод по умолчанию
 * @param type      -   тип данных, используемый при передаче данных на сервер, если отсутствует, то тип по умолчанию
 *
 * +--------------------------------------------------+
 * |             Возвращаемые параметры               |
 * +--------------------------------------------------+
 * Сервер может возвращать массив данных со следующими предопределёнными ключами
 *          error {boolean}     -   наличие ошибки
 *          alert {string}      -   текст информационного сообщения или ошибки
 *          html {string}       -   HTML-текст для вывода на экран
 *          url {string}        -   URL на который надо перенаправить (происходит переход на указанный URL)
 *          no_error {boolean}  -   не отображать (true) или отображать сообщение об ошибке
 *          title {string}      -   заголовок новой страницы (<title>), если не передан, то
 *                                  берётся из параметра data-title или title гипперссылки (по параметру name)
 *          set_url {string}    -   url, который отображается в адресной строке
 *          script {string}     -   script, который надо выполнить по итогу (объект, содержащий два ключа: 'arg' и 'function', где 'arg' - аргументы функции, а 'function' - имя функции. Например, 'arg' => '"text", true', 'function' => 'initEditor')
 *
 * В возвращаемом массиве могут быть и иные данные в следующем формате: {key_id => html_text}, где
 *          key_id {string}     -   ID блока на странице, в котором будет заменёно содержимое,
 *          html_text {string}  -   HTML-текст, который отобразится в блоке с идентификатором key_id
 *
 * @returns {boolean}
 */
function getPageID (name, id, method, type) {
    // настройка скрипта
    let show_error = true;      // отобразить ли сообщение об ошибке если сервер вернул ошибку
    let use_animation = true;   // использовать ли анимацию при смене страниц
    send_status = false;
    // если к url надо добавить ещё какие либо дополнительные параметры,
    // указываем их в переменной param
    // например: let param = 'param_1=value_1&param_2=value_2';
    let param = 'js=1';
    if (loggen) {
        console.group("getPageID");
        console.time("getPageID");
        console.log("Link ID: %c" + name, CSS_Style.green);
    }
    if (!document.getElementById(name)) {
        if (loggen) {
            console.error("Link ID not found");
            console.timeEnd("getPageID");
            console.groupEnd();
        }
        return false;
    }
    // ставим заставку
    Loader();
    let run_script  = 0;
    let obj = document.getElementById(name);
    // проверяем наличие блока вывода по переданному ID
    let output = true;
    if (!id) {
        id = default_id;
        if (loggen) console.info("Output ID not transmitted! Using default ID %c"+id, CSS_Style.orange);
        if (!document.getElementById(id)) {
            if (loggen) console.warn("Default output block %c"+id+"%c not found!", CSS_Style.orange, CSS_Style.clear);
            output = false;
        }
    }
    else {
        if (!document.getElementById(id)) {
            if (loggen) console.warn("Output block %c"+id+"%c not found! Using default ID %c"+default_id, CSS_Style.orange, CSS_Style.clear, CSS_Style.orange);
            id = default_id;
            if (!document.getElementById(id)) {
                if (loggen) console.warn("Default output block %c"+id+"%c not found!", CSS_Style.orange, CSS_Style.clear);
                output = false;
            }
        }
        else if (loggen) console.log("Output block ID: %c"+id, CSS_Style.green);
    }
    if (!output) {
        if (loggen) console.warn("Output block not found!");
        Loader(true);
        if (loggen) {
            console.error("FAIL");
            console.timeEnd("getPageID");
            console.groupEnd();
        }
        return false;
    }
    // определяем URL
    let newurldata = (obj.dataset.href)?obj.dataset.href:obj.href;
    // определяем метод передачи данных
    if (!method) method = default_method;
    // определяем тип данных
    if (!type) type = default_type;
    let urldata = '';
    if (param) {
        let reg = /^(.+)?(\/?\?.+)$/;
        if (loggen) console.log("Check URL: %c"+newurldata, CSS_Style.blue);
        if (reg.test(newurldata)) urldata = newurldata.replace(reg, "$1$2&" + param);
        else {
            reg = /^(\/?[^\?]+)$/;
            if (reg.test(newurldata)) urldata = newurldata.replace(reg, "$1?" + param);
            else urldata = '/?'+param;
        }
        if (loggen) console.log("New URL: %c"+urldata, CSS_Style.blue);
    }
    else urldata = newurldata;
    // определяем заголовок
    let title = obj.dataset.title;
    if (!title) title = obj.title;
    // создаём объект перехода по ссылке для истории браузера
    let state = {}; // 'page_id': name, 'content_id': id };
    if (loggen) console.log("Get from link ID %c"+name+"%c to URL: %c"+urldata, CSS_Style.green, CSS_Style.clear, CSS_Style.blue);
    $.ajax({
        url:        urldata,
        method:     method,
        dataType:   type,
        success: function( data ) {
            // результат работы
            if (loggen) {
                console.log("%cReturn DATA:", CSS_Style.h3);
                console.table(data);
            }
            // сервер вернул ошибку
            if (data.error) {
                if (loggen) console.warn("ERROR return from server!");
                if (!data.no_error && show_error) {
                    let txt = (data.alert)?data.alert:'ERROR return from server!';
                    showAlert(txt, (animation_time*2));
                }
            }
            // с сервера пришло информационное сообщение
            else if (data.alert) {
                if (loggen) console.info("Show alert from server");
                showAlert(data.alert, (animation_time*2));
            }
            // пришло перенаправление на URL
            if (data.url) {
                if (loggen) console.info("Go to URL: "+data.url);
                document.location.href = data.url;
                return true;
            }
            // с сервера пришёл HTML-текст
            if (data.html) {
                if (loggen) console.log("Write HTML from server");
                let new_obj = $("#"+id);
                if (use_animation) {
                    if (loggen) console.log("Set animation text for %c"+id, CSS_Style.green);
                    new_obj.fadeOut("slow", function () {
                        new_obj.html(data.html);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    if (loggen) console.log("Set static text for %c"+id, CSS_Style.green);
                    new_obj.html( data.html );
                }
            }
            // с сервера пришёл заголовок документа
            if (data.title || title) {
                if (data.title) {
                    if (loggen) console.log("Set document Title: %c" + data.title, CSS_Style.orange);
                    document.title = data.title;
                }
                else {
                    if (loggen) console.log("Set document Title: %c" + title, CSS_Style.orange);
                    document.title = title;
                }
            }
            // перебор переданного массива (объекта) данных
            for (let key in data) {
                if (key === 'error' || key === 'script' || key === 'alert' || key === 'set_url' || key === 'no_error' || key === 'title' || key === 'html' || key === 'title') continue;
                if (!document.getElementById(key)) {
                    if (loggen) console.warn("ID %c"+key+"%c not found!", CSS_Style.orange, CSS_Style.clear);
                    continue;
                }
                let new_obj = $("#"+key);
                if (use_animation) {
                    if (loggen) console.log("Set animation text for %c"+key, CSS_Style.green);
                    let value = data[key];
                    let type = new_obj.get(0).tagName.toLowerCase();
                    new_obj.fadeOut("slow", function () {
                        if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                        else new_obj.html(value);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    let value = data[key];
                    if (loggen) console.log("Set static text for ID: %c" + key, CSS_Style.green);
                    let type = new_obj.get(0).tagName.toLowerCase();
                    if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                    else new_obj.html(value);
                    if (!document.getElementById(key)) {
                        if (loggen) console.warn("Not found ID: %с" + key, CSS_Style.red);
                    }
                }
            }
            if (data.set_url) newurldata = data.set_url;
            if (data.script) {
                run_script = 1;
                script = data.script;
            }
        }
    }).done (function () {
        // всё отработало хорошо
        send_status = true;
        // снимаем заставку
        Loader(true);
        // записываем переход на новую страницу в историю браузера
        state = { 'page_id': name, 'content_id': id, 'function': 'getPageID', 'url': urldata, 'data': [] };
        if (loggen) {
            console.log("%cSave to browser history:", CSS_Style.h3);
            console.table({'state': state});
            console.table({'title': title, 'new_url': newurldata});
        }
        if (!no_history) window.history.pushState(state, title, newurldata);
        else no_history = 0;
        if (run_script) {
            let param =  'setTimeout(function () { '+script.function+ '('+script.arg+'); }, '+animation_time/5+');'
            if (loggen) console.log("%cRun new script: %c "+param, CSS_Style.green, CSS_Style.orange);
            let run = new Function(param);
            run();
        }
        if (loggen) {
            console.log("%cSend status: %c"+send_status, CSS_Style.green, CSS_Style.red);
            console.log("%cSUCCESS", CSS_Style.green);
            console.timeEnd("getPageID");
            console.groupEnd();
        }
    }).fail (function () {
        // произошло ошибка в работе
        // снимаем заставку
        Loader(true);
        if (loggen) {
            console.error("FAIL");
            console.timeEnd("getPageID");
            console.groupEnd();
        }
    });
    return false;
}

/**
 * AJAX функция "перехода" по страницам с использованием переданного URL без перезагрузки страницы браузера
 * Аналогична функции getPageID, но для запроса использует переданный URL
 * Получает контент от сервера и отображает его на странице
 * Все параметры по умолчанию прописываются в блоке "Глобальные переменные"
 *
 * +--------------------------------------------------+
 * |              Передаваемые параметры              |
 * +--------------------------------------------------+
 * @param url       -   запрашиваемый URL
 * @param id        -   ID блока вывода ответа, если не указан, то параметр по умолчанию
 * @param method    -   метод, используемый для передачи данных (GET/POST), если отсутствует, то метод по умолчанию
 * @param type      -   тип данных, используемый при передаче данных на сервер, если отсутствует, то тип по умолчанию
 *
 * +--------------------------------------------------+
 * |             Возвращаемые параметры               |
 * +--------------------------------------------------+
 * Сервер может возвращать массив данных со следующими предопределёнными ключами
 *          error {boolean}     -   наличие ошибки
 *          alert {string}      -   текст информационного сообщения или ошибки
 *          html {string}       -   HTML-текст для вывода на экран
 *          url {string}        -   URL на который надо перенаправить (происходит переход на указанный URL)
 *          no_error {boolean}  -   не отображать (true) или отображать сообщение об ошибке
 *          title {string}      -   заголовок новой страницы, если не передан, то
 *                                  берётся из параметра data-title или title гипперссылки (по параметру name)
 *          set_url {string}    -   url, который отображается в адресной строке
 *          script {string}     -   script, который надо выполнить по итогу (объект, содержащий два ключа: 'arg' и 'function', где 'arg' - аргументы функции, а 'function' - имя функции. Например, 'arg' => '"text", true', 'function' => 'initEditor')
 *
 * В возвращаемом массиве могут быть и иные данные в следующем формате: {key_id => html_text}, где
 *          key_id {string}     -   ID блока на странице, в котором будет заменёно содержимое,
 *          html_text {string}  -   HTML-текст, который отобразится в блоке с идентификатором key_id
 *
 * @returns {boolean}
 */
function getPageURL (url, id, method, type) {
    // настройка скрипта
    let show_error = true;      // отобразить ли сообщение об ошибке если сервер вернул ошибку
    let use_animation = true;   // использовать ли анимацию при смене страниц
    let title = 'Title '+url;   // заголовок страницы для истории браузера
    send_status = false;
    // если к url надо добавить ещё какие либо дополнительные параметры,
    // указываем их в переменной param
    // например: let param = 'param_1=value_1&param_2=value_2';
    let param = 'js=1';
    if (loggen) {
        console.group("getPageURL");
        console.time("getPageURL");
        console.log("URL: %c" + url, CSS_Style.green);
    }
    // ставим заставку
    Loader();
    let run_script  = 0;
    // проверяем наличие блока вывода по переданному ID
    let output = true;
    if (!id) {
        id = default_id;
        if (loggen) console.info("Output ID not transmitted! Using default ID %c"+id, CSS_Style.orange);
        if (!document.getElementById(id)) {
            if (loggen) console.warn("Default output block %c"+id+"%c not found!", CSS_Style.orange, CSS_Style.clear);
            output = false;
        }
    }
    else {
        if (!document.getElementById(id)) {
            if (loggen) console.warn("Output block %c"+id+"%c not found! Using default ID %c"+default_id, CSS_Style.orange, CSS_Style.clear, CSS_Style.orange);
            id = default_id;
            if (!document.getElementById(id)) {
                if (loggen) console.warn("Default output block %c"+id+"%c not found!", CSS_Style.orange, CSS_Style.clear);
                output = false;
            }
        }
    }
    if (!output) {
        if (loggen) console.warn("Output block not found!");
        Loader(true);
        if (loggen) {
            console.error("FAIL");
            console.timeEnd("getPageURL");
            console.groupEnd();
        }
        return false;
    }
    // определяем URL
    let newurldata = url;
    // определяем метод передачи данных
    if (!method) method = default_method;
    // определяем тип данных
    if (!type) type = default_type;
    let urldata = '';
    if (param) {
        let reg = /^(.+)?(\/?\?.+)$/;
        if (loggen) console.log("Check URL: %c"+newurldata, CSS_Style.blue);
        if (reg.test(newurldata)) urldata = newurldata.replace(reg, "$1$2&" + param);
        else {
            reg = /^(\/?[^\?]+)$/;
            if (reg.test(newurldata)) urldata = newurldata.replace(reg, "$1?" + param);
            else urldata = '/?'+param;
        }
        if (loggen) console.log("New URL: %c"+urldata, CSS_Style.blue);
    }
    else urldata = newurldata;
    // создаём объект перехода по ссылке для истории браузера
    let state = {}; // 'page_url': url, 'content_id': id };
    if (loggen) console.log("Get to URL: %c"+urldata, CSS_Style.blue);
    $.ajax({
        url:        urldata,
        method:     method,
        dataType:   type,
        success: function( data ) {
            // результат работы
            if (loggen) {
                console.log("%cReturn DATA:", CSS_Style.h3);
                console.table(data);
            }
            // сервер вернул ошибку
            if (data.error) {
                if (loggen) console.warn("ERROR return from server!");
                if (!data.no_error && show_error) {
                    let txt = (data.alert)?data.alert:'ERROR return from server!';
                    showAlert(txt, (animation_time*2));
                }
            }
            // с сервера пришло информационное сообщение
            else if (data.alert) {
                if (loggen) console.info("Show alert from server");
                showAlert(data.alert, (animation_time*2));
            }
            // пришло перенаправление на URL
            if (data.url) {
                if (loggen) console.info("Go to URL: "+data.url);
                document.location.href = data.url;
                return true;
            }
            // с сервера пришёл HTML-текст
            if (data.html) {
                if (loggen) console.log("Write HTML from server");
                let new_obj = $("#"+id);
                if (use_animation) {
                    if (loggen) console.log("Set animation text for %c"+id, CSS_Style.green);
                    new_obj.fadeOut("slow", function () {
                        new_obj.html(data.html);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    if (loggen) console.log("Set static text for %c"+id, CSS_Style.green);
                    new_obj.html( data.html );
                }
            }
            // с сервера пришёл заголовок документа
            if (data.title) {
                if (loggen) console.log("Set document Title: %c" + data.title, CSS_Style.orange);
                document.title = data.title;
                title = data.title;
            }
            // перебор переданного массива (объекта) данных
            for (let key in data) {
                if (key === 'error' || key === 'script' || key === 'alert' || key === 'no_error' || key === 'title' || key === 'html') continue;
                if (!document.getElementById(key)) {
                    if (loggen) console.warn("ID %c"+key+"%c not found!", CSS_Style.orange, CSS_Style.clear);
                    continue;
                }
                let new_obj = $("#"+key);
                if (use_animation) {
                    if (loggen) console.log("Set animation text for %c"+key, CSS_Style.green);
                    let value = data[key];
                    let type = new_obj.get(0).tagName.toLowerCase();
                    new_obj.fadeOut("slow", function () {
                        if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                        else new_obj.html(value);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    let value = data[key];
                    if (loggen) console.log("Set static text for ID: %c" + key, CSS_Style.green);
                    let type = new_obj.get(0).tagName.toLowerCase();
                    if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                    else new_obj.html(value);
                }
            }
            if (data.set_url) newurldata = data.set_url;
            if (data.script) {
                run_script = 1;
                script = data.script;
            }
        }
    }).done (function () {
        send_status = true;
        // записываем переход на новую страницу в историю браузера
        state = { 'page_id': url, 'content_id': id, 'function': 'getPageURL', 'url': urldata, 'data': [] };
        if (loggen) {
            console.log("%cSave to browser history:", CSS_Style.h3);
            console.table({'state': state});
            console.table({'title': title, 'new_url': newurldata});
        }
        if (!no_history) window.history.pushState(state, title, newurldata);
        else no_history = 0;// всё отработало хорошо
        if (loggen) console.log("getPageURL() SUCCESS");// снимаем заставку
        if (run_script) {
            let param =  'setTimeout(function () { '+script.function+ '('+script.arg+'); }, '+animation_time/5+');'
            if (loggen) console.log("%cRun new script: %c "+param, CSS_Style.green, CSS_Style.orange);
            let run = new Function(param);
            run();
        }
        Loader(true);
        if (loggen) {
            console.log("%cSend status: %c"+send_status, CSS_Style.green, CSS_Style.red);
            console.log("%cSUCCESS", CSS_Style.green);
            console.timeEnd("getPageURL");
            console.groupEnd();
        }
    }).fail (function () {
        // произошло ошибка в работе
        // снимаем заставку
        Loader(true);
        if (loggen) {
            console.error("FAIL");
            console.timeEnd("getPageURL");
            console.groupEnd();
        }

    });
    return false;
}

/**
 * Переход по ID к URL
 * По событию происходит переход к URL, указанному в data-href или href объекта
 *
 * Пример:
 * <div id="id_1" data-href="/index.php?param_x=value_x" onclick="return goToURL(this.id, true, 'width=600,height=400')">
 *     или
 * <a id="id_2" href="/index.php?param_x=value_x" onclick="return goToURL(this.id)" title="заголовок ссылки">
 *
 * @param id - ID объекта
 * @param blank - открыть в новом окне (true) или в текущем (false)
 * @param options - параметры нового окна
 * @returns {boolean}
 */
function goToURL(id, blank, options) {
    // если к url надо добавить ещё какие либо дополнительные параметры,
    // указываем их в переменной param
    // например: let param = 'param_1=value_1&param_2=value_2';
    let param = '';
    blank = blank || false;
    options = options || '';
    if (loggen) {
        console.group("goToURL");
        console.time("goToURL");
        console.log("From ID: %c" + id, CSS_Style.green);
    }
    if (!id || !document.getElementById(id)) {
        if (loggen) {
            console.error("ID %c"+id+"%c not found", CSS_Style.orange, CSS_Style.clear);
            console.timeEnd("goToURL");
            console.groupEnd();
        }
        return false;
    }
    let obj = document.getElementById(id);
    // определяем URL
    let url = (obj.dataset.href)?obj.dataset.href:obj.href;
    if (param) {
        let reg = /^(.+)?(\/?\?.+)$/;
        if (loggen) console.log("Check URL: %c"+url, CSS_Style.blue);
        if (reg.test(url)) url = url.replace(reg, "$1$2&" + param);
        else {
            reg = /^(\/?[^\?]+)$/;
            if (reg.test(url)) url = url.replace(reg, "$1?" + param);
            else url = '/?'+param;
        }
        if (loggen) console.log("New URL: %c"+url, CSS_Style.blue);
    }
    if (loggen) {
        console.log("Go to URL: %c"+url, CSS_Style.blue);
        console.log("%cDone", CSS_Style.orange);
        console.timeEnd("goToURL");
        console.groupEnd();
    }
    if (blank) window.open(url, '_blank', options);
    else document.location.href = url;
}

/**
 * Подключение внешнего JS файла
 * @param url - адрес файла
 * @return {boolean}
 */
function includeJS(url) {
    if (loggen) {
        console.group("includeJS");
        console.time("includeJS");
        console.log("Included URL: %c" + url, CSS_Style.blue);
    }
    let script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
    if (loggen) {
        console.log("%cDone", CSS_Style.orange);
        console.timeEnd("includeJS");
        console.groupEnd();
    }
    return true;
}

/**
 * Получение массива с установленным в браузере пользователя порядком языковых предпочтений
 * И подключение языковых файлов
 *
 * Пример:
 *      getLanguage();
 *    или
 *      let lang = getLanguage('',false);
 *    или
 *      let srv = JSON.parse('<?php echo strtr(json_encode($_SERVER), array('\\\\'=>'\\/')); ?>');
 *      str = srv.HTTP_ACCEPT_LANGUAGE;
 *      getLanguage(str, true);
 *
 * @param str - строка с перечнем языковых настроек (необязательный параметр)
 *      str может быть получена из PHP кода из переменной _SERVER:
 *          str = '<?php echo $_SERVER['HTTP_ACCEPT_LANGUAGE']; ?>';
 *        или
 *          let srv = JSON.parse('<?php echo strtr(json_encode($_SERVER), array('\\\\'=>'\\/')); ?>');
 *          str = srv.HTTP_ACCEPT_LANGUAGE;
 *          (в данном случае переменная srv содержит все Headers (заголовки) браузера доступные в PHP)
 * @param include - подключать или нет языковые файлы (true/false)
 *
 * --------------------------------------+
 * СПРАВОЧНИК СОКРАЩЕНИЙ (КОДОВ) ЯЗЫКОВ: |
 * --------------------------------------+
 * Абхазский                        ab
 * Азербайджанский                  az
 * Аймарский                        ay
 * Албанский                        sq
 * Английский                       en
 * Американский английский          en-us
 * Арабский                         ar
 * Армянский                        hy
 * Ассамский                        as
 * Африкаанс                        af
 * Башкирский                       ba
 * Белорусский                      be
 * Бенгальский                      bn
 * Болгарский                       bg
 * Бретонский                       br
 * Валлийский                       cy
 * Венгерский                       hu
 * Вьетнамский                      vi
 * Галисийский                      gl
 * Голландский                      nl
 * Греческий                        el
 * Грузинский                       ka
 * Гуарани                          gn
 * Датский                          da
 * Зулу                             zu
 * Иврит                            iw
 * Идиш                             ji
 * Индонезийский                    in
 * Интерлингва (искусственный язык) ia
 * Ирландский                       ga
 * Исландский                       is
 * Испанский                        es
 * Итальянский                      it
 * Казахский                        kk
 * Камбоджийский                    km
 * Каталанский                      ca
 * Кашмирский                       ks
 * Кечуа                            qu
 * Киргизский                       ky
 * Китайский                        zh
 * Корейский                        ko
 * Корсиканский                     co
 * Курдский                         ku
 * Лаосский                         lo
 * Латвийский, латышский            lv
 * Латынь                           la
 * Литовский                        lt
 * Малагасийский                    mg
 * Малайский                        ms
 * Мальтийский                      mt
 * Маори                            mi
 * Македонский                      mk
 * Молдавский                       mo
 * Монгольский                      mn
 * Науру                            na
 * Немецкий                         de
 * Непальский                       ne
 * Норвежский                       no
 * Пенджаби                         pa
 * Персидский                       fa
 * Польский                         pl
 * Португальский                    pt
 * Пуштунский                       ps
 * Ретороманский                    rm
 * Румынский                        ro
 * Русский                          ru
 * Самоанский                       sm
 * Санскрит                         sa
 * Сербский                         sr
 * Словацкий                        sk
 * Словенский                       sl
 * Сомали                           so
 * Суахили                          sw
 * Суданский                        su
 * Тагальский                       tl
 * Таджикский                       tg
 * Тайский                          th
 * Тамильский                       ta
 * Татарский                        tt
 * Тибетский                        bo
 * Тонга                            to
 * Турецкий                         tr
 * Туркменский                      tk
 * Узбекский                        uz
 * Украинский                       uk
 * Урду                             ur
 * Фиджи                            fj
 * Финский                          fi
 * Французский                      fr
 * Фризский                         fy
 * Хауса                            ha
 * Хинди                            hi
 * Хорватский                       hr
 * Чешский                          cs
 * Шведский                         sv
 * Эсперанто (искусственный язык)   eo
 * Эстонский                        et
 * Яванский                         jw
 * Японский                         ja
 * --------------------------------------+
 * @return array - массив, упорядоченный по ключам, где по ключу "0" - первый язык (код языка) браузера, "1" - второй и т.д.
 */
function getLanguage (str, include) {
    // настройка функции
    let use_net_query = false;                           // использовать или нет AJAX-запрос к серверу (не работает сервер)
    let server = 'https://ajaxhttpheaders3.appspot.com'; // адрес внешнего сервера
    let data_type = 'jsonp';                             // тип данных, получаемых от сервера
    let include_local = true;                            // настройка подключения языковых файлов по умолчанию
    // регулярные выражения
    let lng_str;
    let reg_1 = /,/;
    let reg_2 = /;/;
    let reg_3 = /q\=/;
    let reg_4 = /-.+/;
    // локальные переменные
    let lng_array_1;
    let lng_array_2;
    let lng_nm = {};
    let lng_vl = {};
    let lng = {};
    let l_key;
    let l_val;
    let i = 0;
    if (loggen) {
        console.group("getLanguage");
        console.time("getLanguage");
        console.log("Get data: %c"+str, CSS_Style.orange);
        console.log("Include: %c"+include, CSS_Style.orange);
    }
    Loader();
    // если данные переданы в строке
    if (str) {
        // обрабатываем параметры, переданные в строке
        lng_str = str;
        lng_array_1 = lng_str.split(reg_1);
        for (lng_str in lng_array_1) {
            lng_array_2 = lng_array_1[lng_str].split(reg_2);
            l_key = lng_array_2[0];
            l_key = l_key.replace(reg_4, '');
            l_val = lng_array_2[1]?lng_array_2[1]:"1";
            if (typeof(l_val) === 'string') l_val = l_val.replace(reg_3, '');
            lng_nm[l_key] = (10-(l_val*10));
        }
        for (l_key in lng_nm) {
            l_val = lng_nm[l_key];
            lng_vl[l_val] = l_key;
        }
        for (l_key in lng_vl) {
            lng[i] = lng_vl[l_key];
            i++;
        }
        if (include) includeLanguage(lng);
        Loader(true);
    }
    // если в строке данные не передавались
    else {
        if (use_net_query) {
            // используем запрос к внешнему серверу
            if (loggen) console.log("Begin query to URL: %c"+server, CSS_Style.blue);
            $.ajax({
                url:      server,
                dataType: data_type,
                success: function (headers) {
                    // обрабатываем ответ от внешнего сервера
                    lng_str = headers['Accept-Language'];
                    lng_array_1 = lng_str.split(reg_1);
                    for (lng_str in lng_array_1) {
                        lng_array_2 = lng_array_1[lng_str].split(reg_2);
                        l_key = lng_array_2[0];
                        l_key = l_key.replace(reg_4, '');
                        l_val = lng_array_2[1]?lng_array_2[1]:"1";
                        if (typeof(l_val) === 'string') l_val = l_val.replace(reg_3, '');
                        lng_nm[l_key] = (10-(l_val*10));
                    }
                    for (l_key in lng_nm) {
                        l_val = lng_nm[l_key];
                        lng_vl[l_val] = l_key;
                    }
                    for (l_key in lng_vl) {
                        lng[i] = lng_vl[l_key];
                        i++;
                    }
                    if (loggen) console.log("%cURL query success", CSS_Style.green);
                    // подключаем файлы
                    if (include === true || (include !== false && include_local)) includeLanguage(lng);
                }
            }).done(function () {
                Loader(true);
                if (loggen) {
                    console.log("%cDone", CSS_Style.orange);
                    console.timeEnd("getLanguage");
                    console.groupEnd();
                }
            }).fail(function () {
                if (loggen) console.warn("URL query fail");
                lng_str = (window.navigator.language || window.navigator.browserLanguage);
                lng_str = lng_str.substr(0, 2).toLowerCase();
                lng[0] = lng_str;
                if (loggen) console.info("Use local parameters");
                // подключаем файлы
                if (include === true || (include !== false && include_local)) includeLanguage(lng);
                Loader(true);
                if (loggen) {
                    console.log("%cDone", CSS_Style.orange);
                    console.timeEnd("getLanguage");
                    console.groupEnd();
                }
            });
        }
        else {
            // используем локальные параметры
            if (loggen) console.info("Use local parameters");
            lng_str = (window.navigator.language || window.navigator.browserLanguage);
            lng_str = lng_str.substr(0, 2).toLowerCase();
            lng[0] = lng_str;
            if (include === true || (include !== false && include_local)) includeLanguage(lng);
            Loader(true);
            if (loggen) {
                console.log("%cDone", CSS_Style.orange);
                console.timeEnd("getLanguage");
                console.groupEnd();
            }
        }
    }
    return lng;
}

/**
 * Подключение языковых файлов JS
 * происходит проверка существования языковых файлов и подключение первого имеющегося
 * если не найдено ни одного языкового файла из переданного массива, то подключается языковой файл по умолчанию
 * @param lng   - массив получаемый из функции getLanguage(), см. выше
 * @param dir   - путь к директории (папке) в которой расположены языковые JS файлы
 * @param file  - префикс имени языковых JS файлов
 * @return {boolean}
 */
function includeLanguage (lng, dir, file) {
    // локальные переменные
    let url;                                    // сгенерированный путь к файлу
    let res = {};                               // массив результатов асинхронных запросов
    let sum = [];
    let key;
    let ln;
    if (!dir) dir = dir_local;
    if (!file) file = file_local;
    if (loggen) {
        console.group("includeLanguage");
        console.time("includeLanguage");
        console.log("Check DIR: %c"+dir, CSS_Style.orange);
        console.log("Prefix: %c"+file, CSS_Style.orange);
    }
    // функции обратного вызова для правильной обработки асинхронных запросов при проверке существования файлов
    // файл существует
    let successCallback = function (lan) {
        if (loggen) {
            console.group("includeLanguage "+lan);
            console.time("includeLanguage "+lan);
        }
        res[lan] = true;
        sum.push(true);
        key = sum.length;
        let finish = false;
        let res_file = 'none';
        if (key == ObjLen(lng)) {
            let included = false;       // признак того, что файл подключен
            let val;
            for (key in lng) {
                val = lng[key];
                url = dir + '' + file + '' + val + '.js';
                if (res[val] && !included) {
                    includeJS(url);
                    if (loggen) console.log("Included file: %c" + url, CSS_Style.green);
                    included = true;
                    res_file = url;
                }
                else {
                    if (loggen) console.log("File %c"+url+"%c is not included because another file is already included.", CSS_Style.orange, CSS_Style.clear);
                }
            }
            if (!included) {
                url = dir+''+file+''+default_lang+'.js';
                includeJS(url);
                if (loggen) console.log("Included default file %c"+url, CSS_Style.green);
            }
            finish = true;
        }
        Loader(true);
        if (loggen) {
            console.log("%cDone", CSS_Style.orange);
            console.timeEnd("includeLanguage "+lan);
            console.groupEnd();
            if (finish) {
                console.group("includeLanguage Result");
                console.log("%cResult:", CSS_Style.h3);
                console.table(res);
                console.log("Included file: %c" + res_file, CSS_Style.green);
                console.groupEnd();
            }
        }
    }
    // файл не существует
    let errorCallback = function (lan) {
        if (loggen) {
            console.group("includeLanguage "+lan);
            console.time("includeLanguage "+lan);
        }
        res[lan] = false;
        sum.push(false);
        key = sum.length;
        let finish = false;
        let res_file = 'none';
        if (key == ObjLen(lng)) {
            let included = false;       // признак того, что файл подключен
            let val;
            for (key in lng) {
                val = lng[key];
                if (res[val] && !included) {
                    url = dir + '' + file + '' + val + '.js';
                    includeJS(url);
                    if (loggen) console.log("Included file: %c" + url, CSS_Style.green);
                    included = true;
                    res_file = url;
                }
                else {
                    if (loggen) console.log("File %c"+url+"%c is not included because another file is already included.", CSS_Style.orange, CSS_Style.clear);
                }
            }
            if (!included) {
                url = dir+''+file+''+default_lang+'.js';
                includeJS(url);
                if (loggen) console.log("Included default file %c"+url, CSS_Style.green);
            }
            finish = true;
        }
        Loader(true);
        if (loggen) {
            console.log("%cDone", CSS_Style.orange);
            console.timeEnd("includeLanguage "+lan);
            console.groupEnd();
            if (finish) {
                console.group("includeLanguage Result");
                console.log("%cResult:", CSS_Style.h3);
                console.table(res);
                console.log("Included file: %c" + res_file, CSS_Style.green);
                console.groupEnd();
            }
        }
    }
    if (loggen) {
        console.log("%cLanguages:", CSS_Style.h3);
        console.table(lng);
    }
    if (loggen) console.log("Begin Include");
    let inc = false;
    if (lang_key !== undefined && lang_key) {
        if (loggen) console.log("Include from key: "+lang_key);
        for (key in lng) {
            ln = lng[key];
            if (ln === lang_key) {
                if (loggen) console.log("Key "+lang_key+"%c passed", CSS_Style.green);
                url = dir + '' + file + '' + ln + '.js';
                if (loggen) console.log("Include file: %c" + url, CSS_Style.green);
                lng = [];
                lng[0] = ln;
                // проверяем существует или не существует файл
                checkFile(url, successCallback, errorCallback, ln);
                inc = true;
                break;
            }
        }
        if (loggen && !inc) console.log("Key "+lang_key+"%c not passed", CSS_Style.red);
    }
    if (!inc) {
        // перебор переданного массива с поддерживаемыми браузером языками
        for (key in lng) {
            ln = lng[key];
            url = dir + '' + file + '' + ln + '.js';
            if (loggen) console.log("Include file: %c" + url, CSS_Style.green);
            // проверяем существует или не существует файл
            checkFile(url, successCallback, errorCallback, ln);
        }
    }

    if (loggen) {
        console.log("%cDone", CSS_Style.orange);
        console.timeEnd("includeLanguage");
        console.groupEnd();
    }
    return true;
}

/**
 * Проверка существования языкового файла
 * @param url       - запрашиваемый URL
 * @param successF  - ссылка на функцию, выполняемую в случае наличия файла по указанному URL
 * @param errorF    - ссылка на функцию, выполняемую в случае отсутствия файла по указанному URL
 * @param ln        - дополнительный параметр, возвращаемый в функцию, выполняемую по результату запроса
 */
function checkFile (url, successF, errorF, ln) {
    if (loggen) console.log("checkFile() URL: %c"+url, CSS_Style.green);
    $.ajax({
        type:       'post',
        url:        url,
        method:     'HEAD',
    })
    .done(function () {
        successF(ln);
    })
    .fail(function () {
        errorF(ln);
    });
}

/**
 * Функция, выщитывающая размер переданного объекта/массива
 * @param obj - объект/массив
 * @return {number}
 */
function ObjLen (obj) {
    let sum = 0;
    let key;
    for (key in obj) sum++;
    return sum;
}

/**
 * JQuery функция центрирования элемента на странице
 * Использование: $("#block_id").center();
 * @returns {jQuery}
 */
jQuery.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

/**
 * Замена стандартного диаллога confirm
 * @param text - текст, выводимый на экран
 * @param title - заголовок
 * @param func - ссылка на функцию, вызываемую по результату нажатия кнопки ОК
 *
 * Использование в JS:
 * if (MyConfirm(confirm_text, title, function () {
 *      //действия, выполняемые при нажатии кнопки OK;
 * }));
 *
 * @constructor
 */
function MyConfirm (text, title, func) {
    if (!title) title = language[lang_use]['confirm'];
    let result = false;
    if (loggen) {
        console.group("MyConfirm");
        console.time("MyConfirm");
        console.log("Text: %c"+text, CSS_Style.orange);
        console.log("Title: %c"+title, CSS_Style.orange);
        console.log("Function: %c"+func, CSS_Style.orange);
    }
    // форма сообщения
    // CSS Style
    let script_css = "<style type=text/css>" +
        "div.confirm_bg {" +
        "    position: fixed;" +
        "    top: 0;" +
        "    left: 0;" +
        "    right: 0;" +
        "    bottom: 0;" +
        "    width: 100%;" +
        "    min-height: 100%;" +
        "    z-index: 88 !important;" +
        "}" +
        "div.confirm {" +
        "    position: absolute;" +
        "    top: 40%;" +
        "    left: 40%;" +
        "    min-width: 350px;" +
        "    min-height: 100px;" +
        "    background-color: #fff;" +
        "    border: 1px solid #333333;" +
        "    border-radius: 8px;" +
        "    opacity: 1 !important;" +
        "    margin-right: -50%;" +
        "    box-shadow: 10px 10px 5px 4px rgba(0,0,0,0.16);" +
        "}" +
        "div.confirm_title {" +
        "    position: relative;" +
        "    display: inline-block;" +
        "    vertical-align: center;" +
        "    min-width: 350px;" +
        "    max-width: 100%;" +
        "    height: 30px;" +
        "    background-color: #EEEEEE;" +
        "    padding: 10px 10px 0px 10px;" +
        "    border-bottom: 1px solid #333333;" +
        "    border-radius: 8px 8px 0 0;" +
        "    font-weight: bold;" +
        "    color: #FA751C;" +
        "}" +
        "div.confirm_buttons {" +
        "    position: relative;" +
        "    height: 30px;" +
        "    text-align: right;" +
        "    padding-right: 10px;" +
        "    padding-top: 5px;" +
        "    margin-bottom: 10px;" +
        "}" +
        "button.confirm_button {" +
        "    padding: 5px 15px;" +
        "    border-radius: 4px;" +
        "    cursor: pointer;" +
        "    margin: 0px 5px 1px 5px;" +
        "}" +
        "button.button_cancel {" +
        "    background-color: rgb(248, 248, 248);" +
        "    border: 1px solid rgba(204, 204, 204, 0.5);" +
        "    color: #5D5D5D;" +
        "}" +
        "button.button_ok {" +
        "    background-color: #fa8a15;" +
        "    border: 1px solid #7d3403;" +
        "    color: #f5f5f5" +
        "}";
    let content = "<div id='confirm_dialog' class='confirm_bg'>" +
        "<div class='confirm'>" +
        "<div class='confirm_title'><p>" + title + "</p></div>" +
        "<div class='confirm_text'>" + text + "</div>" +
        "<div class='confirm_buttons'>" +
        "<button id='OkAction' class='confirm_button button_ok'>" + language[lang_use]['confirm_ok'] + "</button>" +
        "<button id='CancelAction' class='confirm_button button_cancel'>" + language[lang_use]['confirm_cancel'] + "</button>" +
        "</div>" +
        "</div>" +
        "</div>";
    if (css_confirm) content = script_css + " " + content;
    $('body').prepend(content);
    $('#OkAction').click(function () {
        result = true;
        if (loggen) console.log("Return: %cTRUE", CSS_Style.green);
        $(this).parents('#confirm_dialog').fadeOut(500, function () {
            $(this).remove();
        });
        if (loggen) console.log("Go to func");
        func();
    });
    $('#CancelAction').click(function () {
        if (loggen) console.log("Return: %FALSE", CSS_Style.red);
        $(this).parents('#confirm_dialog').fadeOut(500, function () {
            $(this).remove();
        });
    });
    return result;
}

/**
 * Определение данных Браузера
 * @return {checkBrowser}
 */
function checkBrowser() {
    let winNav = window.navigator;
    // Булевы значения (true/false)
    this.dom = document.getElementById?1:0;                             // Поддерживает или нет DOM (старые браузеры, такие как IE4, не поддерживали)
    this.isOpera = winNav.userAgent.indexOf("OPR") > -1;                // Браузер Опера
    this.isIEedge = winNav.userAgent.indexOf("Edge") > -1;              // Браузер MS Edge
    this.isMSIE = winNav.userAgent.indexOf("MSIE") > -1;                // Браузер MS IE старый
    this.isIE = winNav.userAgent.indexOf("InfoPath") > -1;              // Браузер MS IE
    this.isFF = winNav.userAgent.indexOf("Firefox") > -1;               // Браузер Firefox
    // Todo проверить
    this.isSafari = winNav.userAgent.indexOf("Mac") > -1;               // Браузер Safari
    this.isChrome = window.chrome;                                      // Браузер Chrome
    this.isChromium = false;                                            // Браузер Chromium
    // Строковые значения
    this.device = getPlatform();                                        // Операционная платформа ОС
    this.version = "0";                                                 // Версия браузера
    let vendorName = winNav.vendor;
    if (this.isIE && !winNav.userAgent.indexOf("rv:")) this.isIE = false;
    else if (!this.isIE && !this.isChrome && !this.isChromium && !this.isFF && !this.isIEedge && !this.isSafari && !this.isOpera && winNav.userAgent.indexOf("rv:")) this.isIE = true;
    if (this.isChrome !== null && typeof this.isChrome !== "undefined" && vendorName === "Google Inc." && this.isOpera === false && this.isIEedge === false) {
        if (isWithChromePDFReader()) {
            this.isChrome = true;
        } else {
            this.isChrome = false;
            this.isChromium = true;
        }
    }
    this.isMS = (this.isIE || this.isIEedge || this.isMSIE)?true:false; // Продукт от Microsoft
    if (this.isOpera) {
        this.browser = 'Opera';
        this.version = winNav.userAgent.substring((winNav.userAgent.indexOf("OPR/")+4));
    }
    else if (this.isFF) {
        this.browser = 'Firefox';
        this.version = winNav.userAgent.substr((winNav.userAgent.indexOf("rv:")+3),4);
    }
    else if (this.isMSIE) {
        this.browser = 'OldIE';
        this.version = winNav.userAgent.substr((winNav.userAgent.indexOf("rv:")+3),4);
    }
    else if (this.isIE) {
        this.browser = 'IE';
        this.version = winNav.userAgent.substr((winNav.userAgent.indexOf("rv:")+3),4);
    }
    else if (this.isIEedge) {
        this.browser = 'Edge';
        this.version = winNav.userAgent.substring((winNav.userAgent.indexOf("Edge/")+5));
    }
    else if (this.isChrome) {
        this.browser = 'Chrome';
        this.version = winNav.userAgent.substr((winNav.userAgent.indexOf("Chrome/")+7),4);
    }
    else if (this.isChromium) {
        this.browser = 'Chromium';
        this.version = winNav.userAgent.substr((winNav.userAgent.indexOf("Chrome/")+7),4);
    }
    else if (this.isSafari) {
        this.browser = 'Safari';
        this.version = 4;
    }
    return this;
}

/**
 * Вспомогательная функция для определения Chromium
 * @return {boolean}
 */
function isWithChromePDFReader() {
    for (let i = 0; i < window.navigator.plugins.length; i++) {
        if (window.navigator.plugins[i].name == 'Chrome PDF Viewer') return true;
    }
    return false;
}

/**
 * Определение операционной платформы
 * @return {*}
 */
function getPlatform () {
    let userDeviceArray = [
        {device: 'Android', platform: /Android/},
        {device: 'iPhone', platform: /iPhone/},
        {device: 'iPad', platform: /iPad/},
        {device: 'Symbian', platform: /Symbian/},
        {device: 'Windows Phone', platform: /Windows Phone/},
        {device: 'Tablet OS', platform: /Tablet OS/},
        {device: 'Linux', platform: /Linux/},
        {device: 'Windows', platform: /Windows NT/},
        {device: 'Macintosh', platform: /Macintosh/}
    ];
    for (let i in userDeviceArray) {
        if (userDeviceArray[i].platform.test(window.navigator.userAgent)) {
            return userDeviceArray[i].device;
        }
    }
    return 'Неизвестная платформа!';
}

/**
 * Кодирование строки в Base64
 * @param str - строка которую кодируем
 * @return {string}
 */
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

/**
 * Декодирование строки из Base64
 * @param str - строка которую декодируем
 * @return {string}
 */
function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * Проверка установок логирования
 * В куки сохраняются переключения выполненные клавишами
 */
function checkLog () {
    let log = getCookie('loggen');
    if (log && log != 'false') {
        console.log("JavaScript log "+"%c"+"ON\n%cTo disable logging, press the key combination \"Ctrl+*\"", "color: #00ff00; font-weight: bold", CSS_Style.orange);
        loggen = true;
    }
    else {
        console.log("JavaScript log "+"%c"+"OFF\n%cTo enable logging, press the key combination \"Ctrl+*\"", "color: #cf1313; font-weight: bold", CSS_Style.orange);
        loggen = false;
    }
}

/**
 * Возвращает cookie с именем name, если есть, если нет, то undefined
 * @param name
 */
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

/**
 * Установка куки:
 * @param name - название cookie
 * @param value - значение cookie (строка)
 * @param options - объект с дополнительными свойствами для установки cookie:
 *      expires -   Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
 *                          Число – количество секунд до истечения. Например, expires: 3600 – кука на час.
 *                          Объект типа Date – дата истечения.
 *                  Если expires в прошлом, то cookie будет удалено.
 *                  Если expires отсутствует или 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
 *      path    -   Путь для cookie.
 *      domain  -   Домен для cookie.
 *      secure  - Если true, то пересылать cookie только по защищенному соединению.
 */
function setCookie (name, value, options) {
    if(loggen) {
        console.group("setCookie");
        console.time("setCookie");
    }
    options = options || {};
    if (!options.domain && cookie_domain) options.domain = cookie_domain;
    if (!options.path && cookie_path) options.path = cookie_path;
    if (!options.expires && cookie_expires) options.expires = cookie_expires;
    let expires = options.expires;
    if (typeof expires === "number" && expires) {
        let d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }
    if(loggen) {
        console.log("%cCookie options", CSS_Style.h3);
        console.table(options);
    }
    value = encodeURIComponent(value);
    let updatedCookie = name + "=" + value;
    for (let propName in options) {
        updatedCookie += "; " + propName;
        let propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }
    if (cookie_simesite === 'Strict' || cookie_simesite === 'strict') {
        updatedCookie += '; samesite=strict';
    }
    else if (cookie_simesite === 'Lax' || cookie_simesite === 'lax') {
        updatedCookie += '; samesite=lax';
    }
    else {
        cookie_secure = true;
        updatedCookie += '; samesite=none';
    }
    if (cookie_secure) updatedCookie += '; secure';
    if(loggen) console.log("Cookie string: %c"+updatedCookie, CSS_Style.green);
    document.cookie = updatedCookie;
    if (loggen) {
        console.timeEnd("setCookie");
        console.groupEnd();
    }
}

/**
 * Удаление куки по имени
 * @param name - имя куки
 */
function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

/**
 * Подпись в консоли
 */
let copy    = b64DecodeUnicode("4pK4IEZZTiAoUGlsZ3JpbSk=");
let text    = b64DecodeUnicode("CkhpIGZyb20gIkxpY2h0YXJ5ayIgZGV2ZWxvcGVyIHRlYW0hCg==");
let image   = b64DecodeUnicode("CiAgICAgICAgICAoXF8vKQogICAgICAgICAoPScuJz0pCiAgICAgICAgICgiKV8oIikK");
function signature () {
    console.log("%c" + image + "%c" + text + "%c" + copy, "color: #ef9e00", "color: #00ff00;", "color: #cf1313");
}

/**
 * Эмуляция нажатия (клика мышкой) на объект
 *
 * @param id - ID объекта
 * @param time - время в мс, через которое сработает функция
 */
function clickMenuButton (id, time) {
    if (!id) id = 'open-button';
    id = '#'+id;
    if (!time || time < 1) time = 1000;
    setTimeout(function () {
        $(id).trigger('click');
    }, time);
}

/**
 * Определение текущей позиции курсора относительно объекта
 * @param id - ID объекта
 * @returns {*}
 */
function getCurrentPosition (id) {
    let obj = document.getElementById(id);
    // IE < 9 Support
    if (document.selection) {
        obj.focus();
        let range = document.selection.createRange();
        let rangelen = range.text.length;
        range.moveStart ('character', -obj.value.length);
        let start = range.text.length - rangelen;
        return {'start': start, 'end': start + rangelen };
    }
    // IE >=9 and other browsers
    else if (typeof obj.selectionStart !== "undefined") {
        return {'start': obj.selectionStart, 'end': obj.selectionEnd };
    }
    else {
        return {'start': 0, 'end': 0};
    }
}

/**
 * Установка курсора|выделение части текста в объекте
 * @param id - ID объекта
 * @param start - начало позиции
 * @param end - конец позиции
 */
function setPosition(id, start, end) {
    let obj = document.getElementById(id);
    // IE >= 9 and other browsers
    if(obj.setSelectionRange) {
        obj.focus();
        obj.setSelectionRange(start, end);
    }
    // IE < 9
    else if (obj.createTextRange) {
        let range = obj.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
}

/**
 * Отслеживаем нажатие клавиш
 * Alt + u - подпись в консоли
 * Alt + q - подпись во всплывающем окне
 * Ctrl + * - включение/выключение логирования
 * e.shiftKey, e.ctrlKey и e.altKey - отслеживание нажатия соответствующих клавиш
 * @param e
 */
function keyCheck (e) {
    if (e.altKey && e.keyCode === 85) signature();
    else if (e.altKey && e.keyCode === 81) alert(image+text+copy);
    else if (e.ctrlKey && e.keyCode === 106) {
        // переключение состояния логирования
        // сохраняем состояние в куки
        if (loggen) {
            console.log("JavaScript log "+"%c"+"OFF\n%cTo enable logging, press the key combination \"Ctrl+*\"", "color: #cf1313; font-weight: bold", CSS_Style.orange);
            loggen = false;
            deleteCookie('loggen');
            setCookie('loggen', false);
        }
        else {
            console.log("JavaScript log "+"%c"+"ON\n%cTo disable logging, press the key combination \"Ctrl+*\"", "color: #00ff00; font-weight: bold", CSS_Style.orange);
            loggen = true;
            deleteCookie('loggen');
            setCookie('loggen', true);
        }
    }
    return true;
}

/**
 * Показать или спрятать объект на странице
 * @param id - ID блока
 * @param type - что сделать с блоком: hide - спрятать, show - показать, по умолчанию или toggle - определить состояние и в зависимости от этого спрятать или показать
 * @param time - время анимации в милисекундах, может принимать значения "slow" и "fast"
 * @constructor
 */
function ShowHide (id, type, time) {
    let use_json = false;   // использовать функции библиотеки JQuery
    let use_slide = true;   // использовать эффект проявления (при использовании библиотеки JQuery)
    if (!type || (type !== 'hide' && type !== 'show')) type = 'toggle';
    if (!time) time = "slow";
    if (loggen) console.log("ShowHide: %c"+id+" => "+type, CSS_Style.green);
    if (id !== show_hide.id || type !== show_hide.type || type === 'toggle' || send_status) {
        show_hide.count++;
        if (use_json) {
            if (type === 'show' && use_slide) $("#" + id).slideDown(time);
            else if (type === 'show') $("#" + id).fadeIn(time);
            else if (type === 'hide' && use_slide) $("#" + id).slideUp(time);
            else if (type === 'hide') $("#" + id).fadeOut(time);
            else $("#" + id).fadeToggle(time);
        }
        else {
            if (document.getElementById(id)) {
                if (type === 'show') document.getElementById(id).style.display = 'block';
                else document.getElementById(id).style.display = 'none';
            }
        }
        // небольшой костыль для того, чтобы продолжал работать после перезагрузки меню по AJAX
        if (show_hide.count > 2) send_status = false;
        show_hide['id'] = id;
        show_hide['type'] = type;
    }
}

addEventListener("keyup", keyCheck);

/**
 * Обновление страницы при нажатии кнопок "назад/вперёд"
 * Отработка изменения истории
 */
window.onpopstate = function(){
    if (loggen) {
        console.group("backHistory");
        console.time("backHistory");
    }
    let data = window.history.state;
    let func = '';
    let url = '';
    if (data) {
        func = data.function;
        url = data.url.replace(/&js=1/, '');
    }
    if (loggen) {
        console.log("History data:");
        console.table(data);
        console.log("Call to function: %c"+func, CSS_Style.green);
        console.log("Use URL: %c"+url, CSS_Style.blue);
        console.timeEnd("backHistory");
        console.groupEnd();
    }
    switch (func) {
        case "getPageID":
            no_history = 1; // не записывать переход в историю
            getPageURL(url, data.content_id);
            break;
        case "getPageURL":
            no_history = 1; // не записывать переход в историю
            getPageURL(data.page_id, data.content_id);
            break;
        case "sendForm":
            no_history = 1;
            if (data.data) url += "&"+data.data;
            getPageURL(url, data.content_id);
            break;
    }
};

/**
 * Скрипты, вызываемые после загрузки страницы
 */
window.onload = function () {
    signature();    // Шутка. Подпись ;)
    checkLog();     // Проверка состояния логирования
    getLanguage();  // Подключение языковых файлов
};

