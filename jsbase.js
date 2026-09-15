/**
 * JavaScript functions
 * @author: Yuri Frantsevich (FYN)
 * Email: frantsevich@gmail.com | fyn@tut.by
 * Version: 3.2.0
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
let response_handlers   = {};

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
 * Creates the "Loading" object
 * Deactivates/activates the page while data is loading
 * The bg object is declared globally in the script body
 * -----------------------------------------------------------
 * The CSS style is required for display
 * CSS example:
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
 * @param stop - if a parameter is provided (true, !=0), removes the object and activates the page
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
                // create the object
                // see the function description for styles
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
 * Displays an information block and the supplied text
 * @param text - text to display
 * @param time - block display time
 * @param style - CSS class for the block
 * Possible style for the alert class:
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
    if (!/^[A-Za-z0-9_-]+$/.test(style)) style = 'alert';
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
    div.textContent = text;
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

function registerResponseHandler(name, handler) {
    if (typeof name !== 'string' || typeof handler !== 'function') return false;
    response_handlers[name] = handler;
    return true;
}

function runResponseHandler(script) {
    if (!script || typeof script.function !== 'string') return false;
    let handler = response_handlers[script.function];
    if (typeof handler !== 'function') return false;
    let args = Array.isArray(script.args) ? script.args : [];
    setTimeout(function () {
        handler.apply(null, args);
    }, animation_time / 5);
    return true;
}

function getSafeNavigationUrl(value) {
    try {
        let url = new URL(value, window.location.origin);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
    }
    catch (error) {
        return null;
    }
}

function getSafeScriptUrl(value) {
    let url = getSafeNavigationUrl(value);
    return url && new URL(url).origin === window.location.origin ? url : null;
}

function setResponseContent(element, value) {
    let content = value == null ? '' : String(value);
    let sanitized = window.DOMPurify ? window.DOMPurify.sanitize(content) : null;
    if (element.jquery) {
        if (sanitized !== null) element.html(sanitized);
        else element.text(content);
    }
    else if (sanitized !== null) element.innerHTML = sanitized;
    else element.textContent = content;
}

function escapeHtml(value) {
    let element = document.createElement('div');
    element.textContent = value == null ? '' : String(value);
    return element.innerHTML;
}

/**
 * AJAX function for submitting form data by ID
 * Validates that fields are complete and correctly filled in
 * All default parameters are specified in the "Global Variables" block
 *
 * Example:
 * <div id="content">
 * <form id="form_id" action="./?page=page_id" method="post" onsubmit="return sendForm(this.id, 'content');">
 *     <input ....>
 *     <button type="submit">Send</button>
 * </form>
 * </div>
 *
 * or in a JS function
 *
 * if (sendForm('form_id', 'content', true) {
 *      document.location = '/';
 * }
 *
 * +--------------------------------------------------+
 * |              Input parameters                   |
 * +--------------------------------------------------+
 * @param name  -   form ID
 * @param id    -   response output block ID; uses the default parameter if omitted
 * @param back  -   the response returned by the function (false by default):
 *                      true - returns true when there are no errors; otherwise, false
 *                      false - always returns false
 * @param type  -   data type used to send data to the server (json or jsonp); uses the default type if omitted
 *
 * -- optional parameters that may come from the form or, if missing, from the default variables
 * @param url       -   destination URL
 * @param method    -   method used to send data (GET/POST)
 *
 * +--------------------------------------------------+
 * |             Returned parameters                  |
 * +--------------------------------------------------+
 * The server may return a data array with the following keys:
 *          error {boolean}     -   an error occurred
 *          alert {string}      -   informational or error message text
 *          html {string}       -   HTML text to display
 *          url {string}        -   URL to redirect to (navigates to the specified URL)
 *          no_error {boolean}  -   do not show (true) or show the error message
 *          set_url {string}    -   address set in the browser address bar
 *          title {string}      -   new page title (<title>...</title>)
 *          script {object}     -   registered response handler to run afterward. Contains 'function' and an 'args' array. For example, { function: 'initEditor', args: ['text', true] }
 *
 * The returned array may also contain other data in this format: {key_id => html_text}, where
 *          key_id {string}     -   ID of the page block whose content will be replaced,
 *          html_text {string}  -   HTML text displayed in the block with the key_id identifier
 *
 * @returns {boolean}
 */
function sendForm (name, id, back, url, method, type) {
    let show_error = true;      // whether to display an error message if the server returns an error
    //let is_json = true;         // response received in JSON format
    let use_animation = true;   // whether to use animation when switching pages
    send_status = false;
    // if additional parameters need to be added to the URL,
    // specify them in the param variable
    // for example: let param = 'param_1=value_1&param_2=value_2';
    let param = 'js='+getKeyDay();

    if (loggen) {
        console.group("sendForm");
        console.time("sendForm");
        console.log("Form ID: %c" + name, CSS_Style.green);
    }
    // check whether a form with the specified ID exists
    if (!document.getElementById(name)) {
        if (loggen) {
            console.timeEnd("sendForm");
            console.error("Form ID not found");
            console.groupEnd();
        }
        return false;
    }
    // show the loading overlay
    Loader();
    // check whether an output block with the specified ID exists
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
    // set the default response value
    if (!back) back = false;
    // create a reference to the form object
    let form = $("#"+name);
    // determine the data transfer method
    if (!method) method = form.attr('method');
    if (!method) method = default_method;
    // determine the URL
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
    // determine the title
    let title = 'Form';
    // determine the data type
    if (!type) type = default_type;
    // check whether required fields are completed
    let error = checkRequired(name);
    // check whether fields are filled in correctly
    if (!error) error = checkPattern(name);
    // create a navigation state object for browser history
    let state = {};
    let script = {};
    let run_script  = 0;
    // begin submitting the form
    if (!error) {
        $("#"+name).each(function(){ $(this).removeClass('error_filed'); });
        if (loggen) console.log("Begin sending to url: %c"+url, CSS_Style.blue);
        let dt;                                                             // data to send
        let c_type = "application/x-www-form-urlencoded; charset = UTF-8";  // content type
        let p_data = true;                                                  // process data
        let cache = true;
        // if the form can include file uploads, set additional parameters
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
                // result
                if (loggen) {
                    console.log("%cReturn data:", CSS_Style.h3);
                    console.table(data);
                }
                // the server returned an error
                if (data.error) {
                    if (loggen) console.warn("ERROR return from server!");
                    if (!data.no_error && show_error) {
                        let txt = (data.alert)?data.alert:'ERROR return from server!';
                        showAlert(txt, (animation_time*2));
                    }
                    back = false;
                }
                // the server returned an informational message
                else if (data.alert) {
                    if (loggen) console.info("Show alert from server");
                    showAlert(data.alert, (animation_time*2));
                }
                // a URL redirect was returned
                if (data.url) {
                    let safeUrl = getSafeNavigationUrl(data.url);
                    if (safeUrl) {
                        if (loggen) console.info("Go to URL: "+safeUrl);
                        document.location.href = safeUrl;
                        return true;
                    }
                    if (loggen) console.warn("Unsafe redirect URL rejected");
                }
                // the server returned HTML text
                if (data.html) {
                    if (output) {
                        if (loggen) console.log("Write HTML from server");
                        setResponseContent(document.getElementById(id), data.html);
                    }
                }
                if (data.show_hide && data.sh_type) {
                    if (loggen) console.info("ShowHide "+data.show_hide);
                    ShowHide(data.show_hide, data.sh_type);
                }
                // iterate over the returned data array (object)
                for (let key in data) {
                    if (key === 'error' || key === 'script' || key === 'alert' || key === 'set_url' || key === 'show_hide' || key === 'sh_type' || key === 'no_error' || key === 'html' || key === 'title' || key === 'error_field') continue;
                    if (!document.getElementById(key)) {
                        if (loggen) console.warn("ID %c"+key+"%c not found!", CSS_Style.orange, CSS_Style.clear);
                        continue;
                    }
                    let new_obj = $("#"+key);
                    if (use_animation) {
                        if (loggen) console.log("Set animation text for %c"+key, CSS_Style.green);
                        let value = data[key];
                        /*
                        // Alternative
                        new_obj.stop().fadeTo("slow", 0, function () {
                            new_obj.html(value);
                            new_obj.stop().fadeTo("slow", 1);
                        });
                        */
                        let type = new_obj.get(0).tagName.toLowerCase();
                        new_obj.fadeOut("slow", function () {
                            if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                            else setResponseContent(new_obj, value);
                            new_obj.fadeIn("slow");
                        });
                    }
                    else {
                        let value = data[key];
                        if (loggen) console.log("Set static text for ID: %c" + key, CSS_Style.green);
                        let type = new_obj.get(0).tagName.toLowerCase();
                        if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                        else setResponseContent(new_obj, value);
                    }
                }
                if (data.set_url) newurldata = data.set_url;
                if (data.title) document.title = data.title;
                if (data.script) {
                    run_script = 1;
                    script = data.script;
                }
                // highlight the error field
                if (data.error_field) {
                    let fld = $("[name='"+data.error_field+"']");
                    let info = fld.offset();
                    fld.focus().addClass("error_field");
                    setTimeout(function () {window.scrollTo(info['left'], (info['top']-50))}, 500);
                    back = false;
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
                    back = false;
                }
            }
        }).done(function () {
            send_status = true;
            // everything completed successfully
            state = { 'page_id': name, 'content_id': id, 'function': 'sendForm', 'url': url };
            if (loggen) {
                console.log("%cSave to browser history:", CSS_Style.h3);
                console.table({'state': state});
                console.table({'title': title, 'new_url': newurldata});
            }
            if (!no_history) window.history.pushState(state, title, newurldata);
            else no_history = 0;
            if (run_script) runResponseHandler(script);
            // hide the loader
            Loader(true);
            if (loggen) {
                console.log("%cSend status: %c"+send_status, CSS_Style.green, CSS_Style.red);
                console.log("%cSUCCESS", CSS_Style.green);
                console.log("%cReturn %c" + back, CSS_Style.green, CSS_Style.red);
                console.timeEnd("sendForm");
                console.groupEnd();
            }
        }).fail(function () {
            // an error occurred during the operation
            // hide the loader
            Loader(true);
            back = false;
            if (loggen) {
                console.error("FAIL");
                console.log("%cReturn %c" + back, CSS_Style.green, CSS_Style.red);
                console.timeEnd("sendForm");
                console.groupEnd();
            }
            back = false;
        });
    }
    // errors occurred while validating the form
    else {
        // hide the loader
        Loader(true);
        back = error;
        if (loggen) {
            console.error("Check form ERROR!");
            console.log("%cReturn %c" + back, CSS_Style.green, CSS_Style.red);
            console.timeEnd("sendForm");
            console.groupEnd();
        }
    }
    return back;
}

/**
 * AJAX function for navigating between pages using a hyperlink ID without reloading the browser page
 * Retrieves content from the server and displays it on the page
 * All default parameters are defined in the "Global variables" block
 * The requested page address (URL) is taken from the data-href or href attribute
 *
 * Example:
 * <div id="id_1" data-href="/index.php?param_x=value_x" onclick="return getPageID(this.id)" data-title="New page title">
 *     or
 * <a id="id_2" href="/index.php?param_x=value_x" onclick="return getPageID(this.id)" data-title="New page title" title="Link title">
 *
 * +--------------------------------------------------+
 * |                 Input parameters                 |
 * +--------------------------------------------------+
 * @param name      -   hyperlink ID
 * @param id        -   response output block ID; uses the default parameter when omitted
 * @param method    -   method used to send data (GET/POST); uses the default method when omitted
 * @param type      -   data type used when sending data to the server; uses the default type when omitted
 *
 * +--------------------------------------------------+
 * |                Returned parameters                |
 * +--------------------------------------------------+
 * The server can return a data array with the following predefined keys
 *          error {boolean}     -   whether an error occurred
 *          alert {string}      -   informational or error message text
 *          html {string}       -   HTML text to display
 *          url {string}        -   URL to redirect to (navigates to the specified URL)
 *          no_error {boolean}  -   hide (true) or show the error message
 *          title {string}      -   new page title (<title>); when omitted,
 *                                  it is taken from the data-title or title attribute of the hyperlink (by the name parameter)
 *          set_url {string}    -   URL displayed in the address bar
 *          script {object}     -   registered response handler to run afterward. Contains 'function' and an 'args' array. For example, { function: 'initEditor', args: ['text', true] }
 *
 * The returned array may also contain other data in this format: {key_id => html_text}, where
 *          key_id {string}     -   ID of the page block whose content will be replaced,
 *          html_text {string}  -   HTML text displayed in the block identified by key_id
 *
 * @returns {boolean}
 */
function getPageID (name, id, method, type) {
    // script settings
    let show_error = true;      // whether to show an error message when the server returns an error
    let use_animation = true;   // whether to use animation when changing pages
    send_status = false;
    // If additional parameters must be added to the URL,
    // specify them in the param variable.
    // For example: let param = 'param_1=value_1&param_2=value_2';
    let param = 'js='+getKeyDay();
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
    // show the loader
    Loader();
    let run_script  = 0;
    let obj = document.getElementById(name);
    // check that the output block exists for the supplied ID
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
    // determine the URL
    let newurldata = (obj.dataset.href)?obj.dataset.href:obj.href;
    // determine the data transfer method
    if (!method) method = default_method;
    // determine the data type
    if (!type) type = default_type;
    let reg = /\#/;
    if (document.getElementById('check_menu')) {
        let check = document.getElementById('check_menu');
        if (check.checked) check.checked = false;
    }
    if (reg.test(newurldata)) {
        reg = /([^\#]+)\#([^\#\?\&]+)/;
        let anchor = newurldata.replace(reg, "$2");
        console.log(newurldata + " == %c" + anchor, CSS_Style.red);
        let anchorElement = document.getElementById(anchor);
        if (anchorElement) {
            console.log("OK ID - "+anchor);
            anchorElement.scrollIntoView({
                behavior: 'smooth',
            });
        }
        else if (anchor == 'top') {
            window.scrollTo({top: 0, left: 0, behavior: "smooth"});
        }
        else if (document.getElementsByName(anchor)[0]) {
            console.log("OK Name - "+anchor);
            let topobj = document.getElementById('text');
            let styles = window.getComputedStyle(topobj);
            reg = /px/;
            let koe = styles.getPropertyValue('padding-top').replace(reg, "");
            let obj = document.getElementsByName(anchor)[0];
            let coordinate = obj.getBoundingClientRect();
            let scrollY = window.scrollY;
            let space = $('#block00s').height();
            let goto = coordinate.y - koe + space + scrollY;
            window.scrollTo({left: 0, top: goto, behavior: "smooth"});
        }
        else console.log("FALSE - "+anchor);
        Loader(true);
        if (loggen) {
            console.timeEnd("getPageID");
            console.groupEnd();
        }
        return false;
    }
    let urldata = '';
    reg = /^(.+)?(\/?\?.+)$/;
    if (param) {
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
    // determine the title
    let title = obj.dataset.title;
    if (!title) title = obj.title;
    // create a navigation object for browser history
    let state = {}; // 'page_id': name, 'content_id': id };
    if (loggen) console.log("Get from link ID %c"+name+"%c to URL: %c"+urldata, CSS_Style.green, CSS_Style.clear, CSS_Style.blue);
    $.ajax({
        url:        urldata,
        method:     method,
        dataType:   type,
        success: function( data ) {
            // operation result
            if (loggen) {
                console.log("%cReturn DATA:", CSS_Style.h3);
                console.table(data);
            }
            // the server returned an error
            if (data.error) {
                if (loggen) console.warn("ERROR return from server!");
                if (!data.no_error && show_error) {
                    let txt = (data.alert)?data.alert:'ERROR return from server!';
                    showAlert(txt, (animation_time*2));
                }
            }
            // an informational message arrived from the server
            else if (data.alert) {
                if (loggen) console.info("Show alert from server");
                showAlert(data.alert, (animation_time*2));
            }
            // a URL redirect arrived
            if (data.url) {
                let safeUrl = getSafeNavigationUrl(data.url);
                if (safeUrl) {
                    if (loggen) console.info("Go to URL: "+safeUrl);
                    document.location.href = safeUrl;
                    return true;
                }
                if (loggen) console.warn("Unsafe redirect URL rejected");
            }
            // HTML text arrived from the server
            if (data.html) {
                if (loggen) console.log("Write HTML from server");
                let new_obj = $("#"+id);
                if (use_animation) {
                    if (loggen) console.log("Set animation text for %c"+id, CSS_Style.green);
                    new_obj.fadeOut("slow", function () {
                        setResponseContent(new_obj, data.html);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    if (loggen) console.log("Set static text for %c"+id, CSS_Style.green);
                    setResponseContent(new_obj, data.html);
                }
            }
            // a document title arrived from the server
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
            // iterate through the supplied data array (object)
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
                            else setResponseContent(new_obj, value);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    let value = data[key];
                    if (loggen) console.log("Set static text for ID: %c" + key, CSS_Style.green);
                    let type = new_obj.get(0).tagName.toLowerCase();
                    if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                    else setResponseContent(new_obj, value);
                    if (!document.getElementById(key)) {
                        if (loggen) console.warn("Not found ID: %c" + key, CSS_Style.red);
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
        // operation completed successfully
        send_status = true;
        // hide the loader
        Loader(true);
        // save navigation to the new page in browser history
        state = { 'page_id': name, 'content_id': id, 'function': 'getPageID', 'url': urldata, 'data': [] };
        if (loggen) {
            console.log("%cSave to browser history:", CSS_Style.h3);
            console.table({'state': state});
            console.table({'title': title, 'new_url': newurldata});
        }
        if (!no_history) window.history.pushState(state, title, newurldata);
        else no_history = 0;
        if (run_script) runResponseHandler(script);
        if (loggen) {
            console.log("%cSend status: %c"+send_status, CSS_Style.green, CSS_Style.red);
            console.log("%cSUCCESS", CSS_Style.green);
            console.timeEnd("getPageID");
            console.groupEnd();
        }
    }).fail (function () {
        // an error occurred during the operation
        // hide the loader
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
 * AJAX function for navigating between pages using the supplied URL without reloading the browser page
 * Similar to getPageID, but uses the supplied URL for the request
 * Retrieves content from the server and displays it on the page
 * All default parameters are defined in the "Global variables" block
 *
 * +--------------------------------------------------+
 * |                 Input parameters                 |
 * +--------------------------------------------------+
 * @param url       -   requested URL
 * @param id        -   response output block ID; uses the default parameter when omitted
 * @param method    -   method used to send data (GET/POST); uses the default method when omitted
 * @param type      -   data type used when sending data to the server; uses the default type when omitted
 *
 * +--------------------------------------------------+
 * |                Returned parameters                |
 * +--------------------------------------------------+
 * The server can return a data array with the following predefined keys
 *          error {boolean}     -   whether an error occurred
 *          alert {string}      -   informational or error message text
 *          html {string}       -   HTML text to display
 *          url {string}        -   URL to redirect to (navigates to the specified URL)
 *          no_error {boolean}  -   hide (true) or show the error message
 *          title {string}      -   new page title; when omitted,
 *                                  it is taken from the data-title or title attribute of the hyperlink (by the name parameter)
 *          set_url {string}    -   URL displayed in the address bar
 *          script {object}     -   registered response handler to run afterward. Contains 'function' and an 'args' array. For example, { function: 'initEditor', args: ['text', true] }
 *
 * The returned array may also contain other data in this format: {key_id => html_text}, where
 *          key_id {string}     -   ID of the page block whose content will be replaced,
 *          html_text {string}  -   HTML text displayed in the block identified by key_id
 *
 * @returns {boolean}
 */
function getPageURL (url, id, method, type) {
    // script settings
    let show_error = true;      // whether to show an error message when the server returns an error
    let use_animation = true;   // whether to use animation when changing pages
    let title = 'Title '+url;   // page title for browser history
    send_status = false;
    // If additional parameters must be added to the URL,
    // specify them in the param variable.
    // For example: let param = 'param_1=value_1&param_2=value_2';
    let param = 'js=1';
    if (loggen) {
        console.group("getPageURL");
        console.time("getPageURL");
        console.log("URL: %c" + url, CSS_Style.green);
    }
    // show the loader
    Loader();
    let run_script  = 0;
    // check that the output block exists for the supplied ID
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
    // determine the URL
    let newurldata = url;
    // determine the data transfer method
    if (!method) method = default_method;
    // determine the data type
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
    // create a navigation object for browser history
    let state = {}; // 'page_url': url, 'content_id': id };
    if (loggen) console.log("Get to URL: %c"+urldata, CSS_Style.blue);
    $.ajax({
        url:        urldata,
        method:     method,
        dataType:   type,
        success: function( data ) {
            // operation result
            if (loggen) {
                console.log("%cReturn DATA:", CSS_Style.h3);
                console.table(data);
            }
            // the server returned an error
            if (data.error) {
                if (loggen) console.warn("ERROR return from server!");
                if (!data.no_error && show_error) {
                    let txt = (data.alert)?data.alert:'ERROR return from server!';
                    showAlert(txt, (animation_time*2));
                }
            }
            // an informational message arrived from the server
            else if (data.alert) {
                if (loggen) console.info("Show alert from server");
                showAlert(data.alert, (animation_time*2));
            }
            // a URL redirect arrived
            if (data.url) {
                let safeUrl = getSafeNavigationUrl(data.url);
                if (safeUrl) {
                    if (loggen) console.info("Go to URL: "+safeUrl);
                    document.location.href = safeUrl;
                    return true;
                }
                if (loggen) console.warn("Unsafe redirect URL rejected");
            }
            // HTML text arrived from the server
            if (data.html) {
                if (loggen) console.log("Write HTML from server");
                let new_obj = $("#"+id);
                if (use_animation) {
                    if (loggen) console.log("Set animation text for %c"+id, CSS_Style.green);
                    new_obj.fadeOut("slow", function () {
                        setResponseContent(new_obj, data.html);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    if (loggen) console.log("Set static text for %c"+id, CSS_Style.green);
                    setResponseContent(new_obj, data.html);
                }
            }
            // a document title arrived from the server
            if (data.title) {
                if (loggen) console.log("Set document Title: %c" + data.title, CSS_Style.orange);
                document.title = data.title;
                title = data.title;
            }
            // iterate through the supplied data array (object)
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
                        else setResponseContent(new_obj, value);
                        new_obj.fadeIn("slow");
                    });
                }
                else {
                    let value = data[key];
                    if (loggen) console.log("Set static text for ID: %c" + key, CSS_Style.green);
                    let type = new_obj.get(0).tagName.toLowerCase();
                    if (type === "textarea" || type === "input" || type === "hidden") new_obj.val(value);
                    else setResponseContent(new_obj, value);
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
        // save navigation to the new page in browser history
        state = { 'page_id': url, 'content_id': id, 'function': 'getPageURL', 'url': urldata, 'data': [] };
        if (loggen) {
            console.log("%cSave to browser history:", CSS_Style.h3);
            console.table({'state': state});
            console.table({'title': title, 'new_url': newurldata});
        }
        if (!no_history) window.history.pushState(state, title, newurldata);
        else no_history = 0;// operation completed successfully
        if (loggen) console.log("getPageURL() SUCCESS");// hide the loader
        if (run_script) runResponseHandler(script);
        Loader(true);
        if (loggen) {
            console.log("%cSend status: %c"+send_status, CSS_Style.green, CSS_Style.red);
            console.log("%cSUCCESS", CSS_Style.green);
            console.timeEnd("getPageURL");
            console.groupEnd();
        }
    }).fail (function () {
        // an error occurred during the operation
        // hide the loader
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
 * Navigate to a URL by ID
 * When triggered, navigates to the URL specified in the object's data-href or href attribute
 *
 * Example:
 * <div id="id_1" data-href="/index.php?param_x=value_x" onclick="return goToURL(this.id, true, 'width=600,height=400')">
 *     or
 * <a id="id_2" href="/index.php?param_x=value_x" onclick="return goToURL(this.id)" title="Link title">
 *
 * @param id - object ID
 * @param blank - open in a new window (true) or the current one (false)
 * @param options - new window options
 * @returns {boolean}
 */
function goToURL(id, blank, options) {
    // If additional parameters must be added to the URL,
    // specify them in the param variable.
    // For example: let param = 'param_1=value_1&param_2=value_2';
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
    // determine the URL
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
    let safeUrl = getSafeNavigationUrl(url);
    if (!safeUrl) return false;
    if (blank) {
        let opened = window.open(safeUrl, '_blank', options);
        if (opened) opened.opener = null;
    }
    else document.location.href = safeUrl;
}

/**
 * Include an external JS file
 * @param url - file address
 * @return {boolean}
 */
function includeJS(url) {
    if (loggen) {
        console.group("includeJS");
        console.time("includeJS");
        console.log("Included URL: %c" + url, CSS_Style.blue);
    }
    let safeUrl = getSafeScriptUrl(url);
    if (!safeUrl) return false;
    let script = document.createElement('script');
    script.src = safeUrl;
    document.getElementsByTagName('head')[0].appendChild(script);
    if (loggen) {
        console.log("%cDone", CSS_Style.orange);
        console.timeEnd("includeJS");
        console.groupEnd();
    }
    return true;
}

/**
 * Get an array containing the user's language preference order set in the browser
 * and include language files
 *
 * Example:
 *      getLanguage();
 *    or
 *      let lang = getLanguage('',false);
 *    or
 *      let srv = JSON.parse('<?php echo strtr(json_encode($_SERVER), array('\\\\'=>'\\/')); ?>');
 *      str = srv.HTTP_ACCEPT_LANGUAGE;
 *      getLanguage(str, true);
 *
 * @param str - string listing language settings (optional parameter)
 *      str can be obtained from PHP code using the _SERVER variable:
 *          str = '<?php echo $_SERVER['HTTP_ACCEPT_LANGUAGE']; ?>';
 *        or
 *          let srv = JSON.parse('<?php echo strtr(json_encode($_SERVER), array('\\\\'=>'\\/')); ?>');
 *          str = srv.HTTP_ACCEPT_LANGUAGE;
 *          (in this case, the srv variable contains all browser Headers available in PHP)
 * @param include - whether to include language files (true/false)
 * @param cookie_name - name of the cookie containing the language setting
 *
 * --------------------------------------+
 * LANGUAGE ABBREVIATION (CODE) REFERENCE: |
 * --------------------------------------+
 * Abkhaz                          ab
 * Azerbaijani                     az
 * Aymara                          ay
 * Albanian                        sq
 * English                         en
 * American English                en-us
 * Arabic                          ar
 * Armenian                        hy
 * Assamese                        as
 * Afrikaans                       af
 * Bashkir                         ba
 * Belarusian                      be
 * Bengali                         bn
 * Bulgarian                       bg
 * Breton                          br
 * Welsh                           cy
 * Hungarian                       hu
 * Vietnamese                      vi
 * Galician                        gl
 * Dutch                           nl
 * Greek                           el
 * Georgian                        ka
 * Guarani                         gn
 * Danish                          da
 * Zulu                            zu
 * Hebrew                          iw
 * Yiddish                         ji
 * Indonesian                      in
 * Interlingua (artificial language) ia
 * Irish                           ga
 * Icelandic                       is
 * Spanish                         es
 * Italian                         it
 * Kazakh                          kk
 * Cambodian                       km
 * Catalan                         ca
 * Kashmiri                        ks
 * Quechua                         qu
 * Kyrgyz                          ky
 * Chinese                         zh
 * Korean                          ko
 * Corsican                        co
 * Kurdish                         ku
 * Lao                             lo
 * Latvian                         lv
 * Latin                           la
 * Lithuanian                      lt
 * Malagasy                        mg
 * Malay                           ms
 * Maltese                         mt
 * Maori                           mi
 * Macedonian                      mk
 * Moldavian                       mo
 * Mongolian                       mn
 * Nauru                           na
 * German                          de
 * Nepali                          ne
 * Norwegian                       no
 * Punjabi                         pa
 * Persian                         fa
 * Polish                          pl
 * Portuguese                      pt
 * Pashto                          ps
 * Romansh                         rm
 * Romanian                        ro
 * Russian                         ru
 * Samoan                          sm
 * Sanskrit                        sa
 * Serbian                         sr
 * Slovak                          sk
 * Slovenian                       sl
 * Somali                          so
 * Swahili                         sw
 * Sundanese                       su
 * Tagalog                         tl
 * Tajik                           tg
 * Thai                            th
 * Tamil                           ta
 * Tatar                           tt
 * Tibetan                         bo
 * Tongan                          to
 * Turkish                         tr
 * Turkmen                         tk
 * Uzbek                           uz
 * Ukrainian                       uk
 * Urdu                            ur
 * Fijian                          fj
 * Finnish                         fi
 * French                          fr
 * Frisian                         fy
 * Hausa                           ha
 * Hindi                           hi
 * Croatian                        hr
 * Czech                           cs
 * Swedish                         sv
 * Esperanto (artificial language) eo
 * Estonian                        et
 * Javanese                        jw
 * Japanese                        ja
 * --------------------------------------+
 * @return array - array ordered by key, where key "0" is the browser's first language (language code), "1" is the second, and so on
 */
function getLanguage (str, include, cookie_name) {
    // function settings
    let include_local = true;                           // default setting for including language files
    let delete_cookie = true;                           // delete temporary language cookies
    // regular expressions
    let lng_str;
    let reg_1 = /,/;
    let reg_2 = /;/;
    let reg_3 = /q\=/;
    let reg_4 = /-.+/;
    // local variables
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
    // if data is supplied in a string
    if (str) {
        // process parameters supplied in the string
        lng_str = str;
        lng_array_1 = lng_str.split(reg_1);
        for (lng_str in lng_array_1) {
            lng_array_2 = lng_array_1[lng_str].split(reg_2);
            l_key = lng_array_2[0];
            l_key = l_key.replace(reg_4, '');
            l_val = lng_array_2[1]?lng_array_2[1]:"1";
            if (typeof(l_val) === 'string') l_val = l_val.replace(reg_3, '');
            if (!lng_nm[l_key]) lng_nm[l_key] = (10-(l_val*10));
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
    // if no data was supplied in a string
    else {
        // use local parameters
        if (loggen) console.info("Use local parameters");
        if (!cookie_name) cookie_name = 'this_site_language';
        let cookie_lng = getCookie(cookie_name);
        if (delete_cookie) deleteCookie(cookie_name);
        if (loggen) {
            console.info("Check cookie: "+cookie_name);
            console.info("Cookie lng: "+cookie_lng);
        }
        lng_str = (window.navigator.language || window.navigator.browserLanguage);
        if (loggen) console.log("Local: %c"+lng_str, CSS_Style.orange);
        lng_str = lng_str.substr(0, 2).toLowerCase();
        if (cookie_lng) {
            lng[0] = cookie_lng;
            if (lng_str != cookie_lng) lng[1] = lng_str;
        }
        else lng[0] = lng_str;

        if (include === true || (include !== false && include_local)) includeLanguage(lng);
        Loader(true);
        if (loggen) {
            console.log("%cDone", CSS_Style.orange);
            console.timeEnd("getLanguage");
            console.groupEnd();
        }
    }
    return lng;
}

/**
 * Include language JS files
 * Checks whether language files exist and includes the first available one
 * If none of the language files in the supplied array are found, the default language file is included
 * @param lng   - array returned by getLanguage(); see above
 * @param dir   - path to the directory (folder) containing language JS files
 * @param file  - language JS file name prefix
 * @return {boolean}
 */
function includeLanguage (lng, dir, file) {
    // local variables
    let url;                                    // generated file path
    let res = {};                               // asynchronous request results array
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
    // callbacks for correctly handling asynchronous requests when checking whether files exist
    // the file exists
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
            let included = false;       // indicates whether a file is included
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
    // the file does not exist
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
            let included = false;       // indicates whether a file is included
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
                // check whether the file exists
                checkFile(url, successCallback, errorCallback, ln);
                inc = true;
                break;
            }
        }
        if (loggen && !inc) console.log("Key "+lang_key+"%c not passed", CSS_Style.red);
    }
    if (!inc) {
        // Iterate through the supplied array of browser-supported languages
        for (key in lng) {
            ln = lng[key];
            url = dir + '' + file + '' + ln + '.js';
            if (loggen) console.log("Include file: %c" + url, CSS_Style.green);
            // Check whether the file exists
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
 * Check whether a language file exists
 * @param url       - requested URL
 * @param successF  - reference to the function invoked if the file exists at the specified URL
 * @param errorF    - reference to the function invoked if the file does not exist at the specified URL
 * @param ln        - additional parameter returned to the function invoked with the request result
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
 * Function that calculates the size of the provided object/array
 * @param obj - object/array
 * @return {number}
 */
function ObjLen (obj) {
    let sum = 0;
    let key;
    for (key in obj) sum++;
    return sum;
}

/**
 * jQuery function for centering an element on the page
 * Usage: $("#block_id").center();
 * @returns {jQuery}
 */
jQuery.fn.center = function () {
    this.css("position", "relative");
    this.css("display", "flex");
    this.css("display", "-webkit-flex");
    this.css("justify-content", "center");
    this.css("top", "-50px");
    return this;
}

/**
 * Replacement for the standard confirm dialog
 * @param text - text displayed on screen
 * @param title - title
 * @param func - reference to the function called when the OK button is pressed
 *
 * Usage in JS:
 * if (MyConfirm(confirm_text, title, function () {
 *      //actions performed when the OK button is pressed;
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
    // Message form
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
        "<div class='confirm_title'><p>" + escapeHtml(title) + "</p></div>" +
        "<div class='confirm_text'>" + escapeHtml(text) + "</div>" +
        "<div class='confirm_buttons'>" +
        "<button id='OkAction' class='confirm_button button_ok'>" + escapeHtml(language[lang_use]['confirm_ok']) + "</button>" +
        "<button id='CancelAction' class='confirm_button button_cancel'>" + escapeHtml(language[lang_use]['confirm_cancel']) + "</button>" +
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
        if (typeof func === 'function') func();
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
 * Detect browser information
 * @return {checkBrowser}
 */
function checkBrowser() {
    let winNav = window.navigator;
    // Boolean values (true/false)
    this.dom = document.getElementById?1:0;                             // Whether DOM is supported (older browsers, such as IE4, did not support it)
    this.isOpera = winNav.userAgent.indexOf("OPR") > -1;                // Opera browser
    this.isIEedge = winNav.userAgent.indexOf("Edge") > -1;              // MS Edge browser
    this.isMSIE = winNav.userAgent.indexOf("MSIE") > -1;                // Legacy MS IE browser
    this.isIE = winNav.userAgent.indexOf("InfoPath") > -1;              // MS IE browser
    this.isFF = winNav.userAgent.indexOf("Firefox") > -1;               // Firefox browser
    // TODO: verify
    this.isSafari = winNav.userAgent.indexOf("Mac") > -1;               // Safari browser
    this.isChrome = window.chrome;                                      // Chrome browser
    this.isChromium = false;                                            // Chromium browser
    // String values
    this.device = getPlatform();                                        // Operating system platform
    this.version = "0";                                                 // Browser version
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
    this.isMS = (this.isIE || this.isIEedge || this.isMSIE)?true:false; // Microsoft product
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
 * Helper function for detecting Chromium
 * @return {boolean}
 */
function isWithChromePDFReader() {
    for (let i = 0; i < window.navigator.plugins.length; i++) {
        if (window.navigator.plugins[i].name == 'Chrome PDF Viewer') return true;
    }
    return false;
}

/**
 * Detect the operating system platform
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
    return 'Unknown platform!';
}

/**
 * Encode a string as Base64
 * @param str - string to encode
 * @return {string}
 */
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

/**
 * Decode a Base64 string
 * @param str - string to decode
 * @return {string}
 */
function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * Check logging settings
 * Keyboard toggles are saved in cookies
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
 * Returns the cookie named name if it exists; otherwise, undefined
 * @param name
 */
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

/**
 * Set a cookie:
 * @param name - cookie name
 * @param value - cookie value (string)
 * @param options - object with additional properties for setting the cookie:
 *      expires -   Cookie expiration time. It is interpreted differently depending on the type:
 *                          Number - number of seconds until expiration. For example, expires: 3600 - cookie for one hour.
 *                          Date object - expiration date.
 *                  If expires is in the past, the cookie will be deleted.
 *                  If expires is missing or 0, the cookie will be set as a session cookie and disappear when the browser closes.
 *      path    -   Cookie path.
 *      domain  -   Cookie domain.
 *      secure  - If true, send the cookie only over a secure connection.
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
 * Delete a cookie by name
 * @param name - cookie name
 */
function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

/**
 * Console signature
 */
let copy    = b64DecodeUnicode("4pK4IEZZTiAoUGlsZ3JpbSk=");
let text    = b64DecodeUnicode("CkhpIGZyb20gIkxpY2h0YXJ5ayIgZGV2ZWxvcGVyIHRlYW0hCg==");
let image   = b64DecodeUnicode("CiAgICAgICAgICAoXF8vKQogICAgICAgICAoPScuJz0pCiAgICAgICAgICgiKV8oIikK");
function signature () {
    console.log("%c" + image + "%c" + text + "%c" + copy, "color: #ef9e00", "color: #00ff00;", "color: #cf1313");
}

/**
 * Simulate pressing (clicking) an object
 *
 * @param id - object ID
 * @param time - time in milliseconds before the function runs
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
 * Determine the current cursor position within an object
 * @param id - object ID
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
 * Set the cursor position or select part of the text in an object
 * @param id - object ID
 * @param start - starting position
 * @param end - ending position
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
 * Track key presses
 * Alt + u - console signature
 * Alt + q - signature in a pop-up window
 * Ctrl + * - enable/disable logging
 * e.shiftKey, e.ctrlKey, and e.altKey - track the corresponding key presses
 * @param e
 */
function keyCheck (e) {
    if (e.altKey && e.keyCode === 85) signature();
    else if (e.altKey && e.keyCode === 81) alert(image+text+copy);
    else if (e.ctrlKey && e.keyCode === 106) {
        // Switch the logging state
        // Save the state in a cookie
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
 * Show or hide an object on the page
 * @param id - block ID
 * @param type - action for the block: hide - hide, show - show, default or toggle - determine the current state and hide or show accordingly
 * @param time - animation duration in milliseconds; can be "slow" or "fast"
 * @constructor
 */
function ShowHide (id, type, time) {
    let use_json = false;   // use jQuery library functions
    let use_slide = true;   // use the slide effect (when using the jQuery library)
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
                else if (type === 'toggle') {
                    if (getComputedStyle(document.getElementById(id)).display == 'none') document.getElementById(id).style.display = 'block';
                    else document.getElementById(id).style.display = 'none';
                }
                else document.getElementById(id).style.display = 'none';
            }
        }
        // Small workaround to keep this working after reloading the menu via AJAX
        if (show_hide.count > 2) send_status = false;
        show_hide['id'] = id;
        show_hide['type'] = type;
    }
    return false;
}

/**
 * Generate a key
 * @returns {*}
 */
function getKeyDay() {
    let code = 'bNbCode';
    let dateToday = new Date();
    let myDay = dateToday.getDate();
    let myMonth = dateToday.getMonth()+1;
    let myYear = dateToday.getFullYear();
    let str = myYear+''+myMonth+''+myDay+''+code;
    return MD5(b64EncodeUnicode(str));
}

/**
 * Change the keyboard layout from Latin to Cyrillic
 * @param str
 * @returns {*}
 * @constructor
 */
function changeKeyboard ( str ) {
    let replacer = {
        "q":"й", "w":"ц", "e":"у", "r":"к", "t":"е", "y":"н", "u":"г",
        "i":"ш", "o":"щ", "p":"з", "[":"х", "]":"ъ", "a":"ф", "s":"ы",
        "d":"в", "f":"а", "g":"п", "h":"р", "j":"о", "k":"л", "l":"д",
        ";":"ж", "'":"э", "z":"я", "x":"ч", "c":"с", "v":"м", "b":"и",
        "n":"т", "m":"ь", ",":"б", ".":"ю", "/":".", ":":"Ж", '"':"Э",
        "{":"Х", "}":"Ъ", ">":"Ю", "<":"Б", "~":"Ё"
    };
    return str.replace(/[A-z\/\,\.;\'\]\[\{\}><\~:]/g, function ( x ){
        const reg = new RegExp('[A-Z]+');
        if (reg.test(x)) {
            return  replacer[ x.toLowerCase() ].toUpperCase();
        }
        else return replacer[ x ]
    });
}

/**
 * Functions for calculating MD5
 * @param d
 * @returns {string}
 * @constructor
 */
let MD5 = function(d) {
    d = unescape(encodeURIComponent(d));
    let result = M(V(Y(X(d), 8 * d.length)));
    return result.toLowerCase();
};
function M(d) {
    let _ = '';
    let m, f, r;
    for (_, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
    return f
}
function X(d) {
    let _ = '';
    let m;
    for ( _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
    for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
    return _
}
function V(d) {
    let _ = '';
    let m;
    for ( _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
    return _
}
function Y(d, _) {
    d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
    let m, f, r, i, n;
    for (m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
        let h = m,
            t = f,
            g = r,
            e = i;
        f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
    }
    return Array(m, f, r, i)
}
function md5_cmn(d, _, m, f, r, i) {
    return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m)
}
function md5_ff(d, _, m, f, r, i, n) {
    return md5_cmn(_ & m | ~_ & f, d, _, r, i, n)
}
function md5_gg(d, _, m, f, r, i, n) {
    return md5_cmn(_ & f | m & ~f, d, _, r, i, n)
}
function md5_hh(d, _, m, f, r, i, n) {
    return md5_cmn(_ ^ m ^ f, d, _, r, i, n)
}
function md5_ii(d, _, m, f, r, i, n) {
    return md5_cmn(m ^ (_ | ~f), d, _, r, i, n)
}
function safe_add(d, _) {
    let m = (65535 & d) + (65535 & _);
    return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m
}
function bit_rol(d, _) {
    return d << _ | d >>> 32 - _
}

addEventListener("keyup", keyCheck);

/**
 * Update the page when the "back/forward" buttons are pressed
 * Handle history changes
 */
window.addEventListener('popstate', function () {
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
            no_history = 1; // do not record the navigation in history
            getPageURL(url, data.content_id);
            break;
        case "getPageURL":
            no_history = 1; // do not record the navigation in history
            getPageURL(data.page_id, data.content_id);
            break;
        case "sendForm":
            no_history = 1;
            if (data.data) url += "&"+data.data;
            getPageURL(url, data.content_id);
            break;
    }
});

/**
 * Scripts called after the page loads
 */
window.onload = function () {
    signature();    // A little joke. Signature ;)
    checkLog();     // Check logging state
    getLanguage();  // Include language files
};
