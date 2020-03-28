/**
 * 基于版本1.0.18修改
 * 搜索 @修改 可以查看 修改部分
 * 兼容:key="item.id" => wx:key="id"
 * */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex; }

const deindent = _interopDefault(require('de-indent'));
const he = _interopDefault(require('he'));
const babel = _interopDefault(require('babel-core'));
const prettier = _interopDefault(require('prettier'));
const t = require('babel-types');
const generate = _interopDefault(require('babel-generator'));
const template = _interopDefault(require('babel-template'));

/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining


/**
 * Check if value is primitive
 */


/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

const _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}


/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
  const n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */


/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */


/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(
  str,
  expectsLowerCase
) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
const isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
const isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  const cache = Object.create(null);
  return (function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
const camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */


/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /([^-])([A-Z])/g;
const hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */


/**
 * Convert an Array-like object to a real Array.
 */


/**
 * Mix properties into target object.
 */
function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */


/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop(a, b, c) { }

/**
 * Always return false.
 */
const no = function (a, b, c) { return false; };

/**
 * Return same value
 */
const identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys(modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */


/**
 * Ensure a function is called only once.
 */

/*  */

const isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
const canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
const isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
const singleAttrIdentifier = /([^\s"'<>/=]+)/;
const singleAttrAssign = /(?:=)/;
const singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
const attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
const startTagOpen = new RegExp('^<' + qnameCapture);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
const doctype = /^<!DOCTYPE [^>]+>/i;
const comment = /^<!--/;
const conditionalComment = /^<!\[/;

let IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
const isPlainTextElement = makeMap('script,style,textarea', true);
const reCache = {};

const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
const encodedAttr = /&(?:lt|gt|quot|amp);/g;
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

// #5992
const isIgnoreNewlineTag = makeMap('pre,textarea', true);
const shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr(value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML(html, options) {
  const stack = [];
  const expectHTML = options.expectHTML;
  const isUnaryTag$$1 = options.isUnaryTag || no;
  const canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  let index = 0;
  let last,
    lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      if (shouldIgnoreFirstNewline(lastTag, html)) {
        advance(1);
      }
      let textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        const doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        const endTagMatch = html.match(endTag);
        if (endTagMatch) {
          const curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        const startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      let text = (void 0),
        rest = (void 0),
        next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      const rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      let end,
        attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag(match) {
    const tagName = match.tagName;
    const unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    const unary = isUnaryTag$$1(tagName) || !!unarySlash;

    const l = match.attrs.length;
    const attrs = new Array(l);
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      const value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag(tagName, start, end) {
    let pos,
      lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

const splitRE = /\r?\n/g;
const replaceRE = /./g;
const isSpecialTag = makeMap('script,style,template', true);


/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent(
  content,
  options
) {
  if (options === void 0) options = {};

  const sfc = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  };
  let depth = 0;
  let currentBlock = null;

  function start(
    tag,
    attrs,
    unary,
    start,
    end
  ) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce(function (cumulated, ref) {
          const name = ref.name;
          const value = ref.value;

          cumulated[name] = value || true;
          return cumulated
        }, Object.create(null))
      };
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs);
        if (tag === 'style') {
          sfc.styles.push(currentBlock);
        } else {
          sfc[tag] = currentBlock;
        }
      } else { // custom blocks
        sfc.customBlocks.push(currentBlock);
      }
    }
    if (!unary) {
      depth++;
    }
  }

  function checkAttrs(block, attrs) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (attr.name === 'lang') {
        block.lang = attr.value;
      }
      if (attr.name === 'scoped') {
        block.scoped = true;
      }
      if (attr.name === 'module') {
        block.module = attr.value || true;
      }
      if (attr.name === 'src') {
        block.src = attr.value;
      }
    }
  }

  function end(tag, start, end) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start;
      let text = deindent(content.slice(currentBlock.start, currentBlock.end));
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text;
      }
      currentBlock.content = text;
      currentBlock = null;
    }
    depth--;
  }

  function padContent(block, pad) {
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    }
    const offset = content.slice(0, block.start).split(splitRE).length;
    const padChar = block.type === 'script' && !block.lang
      ? '//\n'
      : '\n';
    return Array(offset).join(padChar)
  }

  parseHTML(content, {
    start,
    end
  });

  return sfc
}

/* globals renderer */

const isPreTag = function (tag) { return tag === 'pre'; };

const isReservedTag = makeMap(
  'template,script,style,element,content,slot,link,meta,svg,view,' +
  'a,div,img,image,text,span,richtext,input,switch,textarea,spinner,select,' +
  'slider,slider-neighbor,indicator,trisition,trisition-group,canvas,' +
  'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
  'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown',
  true
);

// these are reserved for web because they are directly compiled away
// during template compilation
const isReservedAttr = makeMap('style,class');

// Elements that you can, intentionally, leave open (and which close themselves)
// more flexable than web
const canBeLeftOpenTag$1 = makeMap(
  'web,spinner,switch,video,textarea,canvas,' +
  'indicator,marquee,countdown',
  true
);

const isUnaryTag$1 = makeMap(
  'embed,img,image,input,link,meta',
  true
);

function mustUseProp() { /* console.log('mustUseProp') */ }
function getTagNamespace() { /* console.log('getTagNamespace') */ }


// 用于小程序的 event type 到 web 的 event

/*  */

const validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters(exp) {
  let inSingle = false;
  let inDouble = false;
  let inTemplateString = false;
  let inRegex = false;
  let curly = 0;
  let square = 0;
  let paren = 0;
  let lastFilterIndex = 0;
  let c,
    prev,
    i,
    expression,
    filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        let j = i - 1;
        let p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter() {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter(exp, filter) {
  const i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  }
  const name = filter.slice(0, i);
  const args = filter.slice(i + 1);
  return ("_f(\"" + name + "\")(" + exp + "," + args)
}

/*  */

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

const buildRegex = cached(function (delimiters) {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&');
  const close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText(
  text,
  delimiters
) {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  const tokens = [];
  let lastIndex = tagRE.lastIndex = 0;
  let match,
    index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    const exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function baseWarn(msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction(
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp(el, name, value) {
  (el.props || (el.props = [])).push({ name, value });
}

function addAttr(el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name, value });
}

function addDirective(
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name, rawName, value, arg, modifiers });
}

function addHandler(
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  let events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  const newHandler = { value, modifiers };
  const handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr(
  el,
  name,
  getStatic
) {
  const dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    const staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr(el, name) {
  let val;
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList;
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

function transformNode(el, options) {
  const warn = options.warn || baseWarn;
  const staticClass = getAndRemoveAttr(el, 'class');
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    const expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  const classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData(el) {
  let data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

const klass = {
  staticKeys: ['staticClass'],
  transformNode,
  genData
};

/*  */

const parseStyleText = cached(function (cssText) {
  const res = {};
  const listDelimiter = /;(?![^(]*\))/g;
  const propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object


/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */

/*  */

function transformNode$1(el, options) {
  const warn = options.warn || baseWarn;
  const staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      const expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1(el) {
  let data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

const style = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

const modules = [
  klass,
  style
];

const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated', 'onLaunch',
  'onLoad',
  'onShow',
  'onReady',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
  'onPageScroll',
  'onTabItemTap',
  'attached',
  'ready',
  'moved',
  'detached'
];

/*  */

const config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel(
  el,
  value,
  modifiers
) {
  const ref = modifiers || {};
  const number = ref.number;
  const trim = ref.trim;

  const baseValueExpression = '$$v';
  let valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
      "? " + baseValueExpression + ".trim()" +
      ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  const assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode(
  value,
  assignment
) {
  const modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  }
  return ("$set(" + (modelRs.exp) + ", " + (modelRs.idx) + ", " + assignment + ")")
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

let len;
let str;
let chr;
let index;
let expressionPos;
let expressionEndPos;

function parseModel(val) {
  str = val;
  len = str.length;
  index = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next() {
  return str.charCodeAt(++index)
}

function eof() {
  return index >= len
}

function isStringStart(chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket(chr) {
  let inBracket = 1;
  expressionPos = index;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index;
      break
    }
  }
}

function parseString(chr) {
  const stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

let warn;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
const RANGE_TOKEN = '__r';
const CHECKBOX_RADIO_TOKEN = '__c';

function model(
  el,
  dir,
  _warn
) {
  warn = _warn;
  const value = dir.value;
  const modifiers = dir.modifiers;
  const tag = el.tag;
  const type = el.attrsMap.type;

  if (process.env.NODE_ENV !== 'production') {
    const dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel(
  el,
  value,
  modifiers
) {
  const number = modifiers && modifiers.number;
  const valueBinding = getBindingAttr(el, 'value') || 'null';
  const trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  const falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
    '$$el=$event.target,' +
    "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
    "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
    '$$i=_i($$a,$$v);' +
    "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
    "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel(
  el,
  value,
  modifiers
) {
  const number = modifiers && modifiers.number;
  let valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect(
  el,
  value,
  modifiers
) {
  const number = modifiers && modifiers.number;
  const selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  let code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel(
  el,
  value,
  modifiers
) {
  const type = el.attrsMap.type;
  const ref = modifiers || {};
  const lazy = ref.lazy;
  const number = ref.number;
  const trim = ref.trim;
  const needCompositionGuard = !lazy && type !== 'range';
  const event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  let valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  let code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

function text(el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html(el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

const directives = {
  model,
  text,
  html
};

/*  */

const isUnaryTag$2 = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
const canBeLeftOpenTag$2 = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
const isNonPhrasingTag$1 = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

const baseOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag: isUnaryTag$2,
  mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag$2,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
};

/*  */

let warn$2 = noop;
let tip = noop;
let formatComponentName = (null); // work around flow check

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined';
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = function (str) {
    return str
      .replace(classifyRE, function (c) { return c.toUpperCase(); })
      .replace(/[-_]/g, '');
  };

  warn$2 = function (msg, vm) {
    const trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    let name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    const file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      const match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  const repeat = function (str, n) {
    let res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      const tree = [];
      let currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          const last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) {
          return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm)));
        })
        .join('\n')
    }
    return ("\n\n(found in " + (formatComponentName(vm)) + ")")
  };
}

/*  */

function handleError(err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn$2(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */

// can we use __proto__?
const hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
const UA = ['mpvue-runtime'].join();
const isIE = UA && /msie|trident/.test(UA);
const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
const isEdge = UA && UA.indexOf('edge/') > 0;
const isAndroid = UA && UA.indexOf('android') > 0;
const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefix has a "watch" function on Object.prototype...
const nativeWatch = ({}).watch;

let supportsPassive = false;
if (inBrowser) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) { }
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
let _isServer;
const isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global.process.env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools


/* istanbul ignore next */
function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
const nextTick = (function () {
  const callbacks = [];
  let pending = false;
  let timerFunc;

  function nextTickHandler() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    const logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    // } else if (typeof MutationObserver !== 'undefined' && (
    //   isNative(MutationObserver) ||
    //   // PhantomJS and iOS 7.x
    //   MutationObserver.toString() === '[object MutationObserverConstructor]'
    // )) {
    //   // use MutationObserver where native Promise is not available,
    //   // e.g. PhantomJS IE11, iOS7, Android 4.4
    //   var counter = 1
    //   var observer = new MutationObserver(nextTickHandler)
    //   var textNode = document.createTextNode(String(counter))
    //   observer.observe(textNode, {
    //     characterData: true
    //   })
    //   timerFunc = () => {
    //     counter = (counter + 1) % 2
    //     textNode.data = String(counter)
    //   }
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick(cb, ctx) {
    let _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
}());

let _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set() {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has(key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

const onRE = /^@|^v-on:/;
const dirRE = /^v-|^@|^:/;
const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

const argRE = /:(.*)$/;
const bindRE = /^:|^v-bind:/;
const modifierRE = /\.[^.]+/g;

const decodeHTMLCached = cached(he.decode);

// configurable state
let warn$1;
let delimiters;
let transforms;
let preTransforms;
let postTransforms;
let platformIsPreTag;
let platformMustUseProp;
let platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse(
  template$$1,
  options
) {
  warn$1 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  const stack = [];
  const preserveWhitespace = options.preserveWhitespace !== false;
  let root;
  let currentParent;
  let inVPre = false;
  let inPre = false;
  let warned = false;

  function warnOnce(msg) {
    if (!warned) {
      warned = true;
      warn$1(msg);
    }
  }

  function endPre(element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template$$1, {
    warn: warn$1,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    start: function start(tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      const element = {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        process.env.NODE_ENV !== 'production' && warn$1(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (let i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (let i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints(el) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          const name = element.slotTarget || '"default"'; (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (let i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end() {
      // remove trailing whitespace
      const element = stack[stack.length - 1];
      const lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars(text) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template$$1) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      const children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        let expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression,
            text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text
          });
        }
      }
    },
    comment: function comment(text) {
      currentParent.children.push({
        type: 3,
        text,
        isComment: true
      });
    }
  });
  return root
}

function processPre(el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs(el) {
  const l = el.attrsList.length;
  if (l) {
    const attrs = el.attrs = new Array(l);
    for (let i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey(el) {
  const exp = getBindingAttr(el, 'key');
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn$1("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef(el) {
  const ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor(el) {
  let exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' && warn$1(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    const alias = inMatch[1].trim();
    const iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf(el) {
  const exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions(el, parent) {
  const prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn$1(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement(children) {
  let i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    }
    if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
      warn$1(
        "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
        "will be ignored."
      );
    }
    children.pop();
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce(el) {
  const once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot(el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn$1(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    const slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent(el) {
  let binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs(el) {
  const list = el.attrsList;
  let i,
    l,
    name,
    rawName,
    value,
    modifiers,
    isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (!el.component && (
          isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$1);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        const argMatch = name.match(argRE);
        const arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        const expression = parseText(value, delimiters);
        if (expression) {
          warn$1(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor(el) {
  let parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers(name) {
  const match = name.match(modifierRE);
  if (match) {
    const ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap(attrs) {
  const map = {};
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$1('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag(el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag(el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

const ieNSBug = /^xmlns:NS\d+/;
const ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug(attrs) {
  const res = [];
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel(el, value) {
  let _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

let isStaticKey;
let isPlatformReservedTag;

const genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize(root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1(keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic(node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i];
      markStatic(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (let i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        const block = node.ifConditions[i$1].block;
        markStatic(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots(node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    }
    node.staticRoot = false;

    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (let i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic(node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor(node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

const fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
const keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  delete: [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
const genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

const modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers(
  events,
  isNative,
  warn
) {
  let res = isNative ? 'nativeOn:{' : 'on:{';
  for (const name in events) {
    const handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (process.env.NODE_ENV !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler(
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  const isMethodPath = simplePathRE.test(handler.value);
  const isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  }
  let code = '';
  let genModifierCode = '';
  const keys = [];
  for (const key in handler.modifiers) {
    if (modifierCode[key]) {
      genModifierCode += modifierCode[key];
      // left/right
      if (keyCodes[key]) {
        keys.push(key);
      }
    } else {
      keys.push(key);
    }
  }
  if (keys.length) {
    code += genKeyFilter(keys);
  }
  // Make sure modifiers like prevent and stop get executed after key filtering
  if (genModifierCode) {
    code += genModifierCode;
  }
  const handlerCode = isMethodPath
    ? handler.value + '($event)'
    : isFunctionExpression
      ? ("(" + (handler.value) + ")($event)")
      : handler.value;
  return ("function($event){" + code + handlerCode + "}")
}

function genKeyFilter(keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode(key) {
  const keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  const alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

const emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */


/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/*  */


let uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
const Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  const subs = this.subs.slice();
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
  .forEach(function (method) {
    // cache original method
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
      let args = [],
        len = arguments.length;
      while (len--) args[len] = arguments[len];

      const result = original.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

/*  */

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
const observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
const Observer = function Observer(value, key) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  if (key) {
    this.key = key;
  }
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    const augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk(obj) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray(items) {
  for (let i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, asRootData, key) {
  if (!isObject(value)) {
    return
  }
  let ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value, key);
    ob.__keyPath = ob.__keyPath ? ob.__keyPath : {};
    ob.__keyPath[key] = true;
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1(
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;

  let childOb = !shallow && observe(val, undefined, key);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal, undefined, key);
      dep.notify();
      obj.__keyPath = obj.__keyPath ? obj.__keyPath : {};
      obj.__keyPath[key] = true;
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  const ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn$2(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  // Vue.set 添加对象属性，渲染时候把 val 传给小程序渲染
  if (!target.__keyPath) {
    target.__keyPath = {};
  }
  target.__keyPath[key] = true;
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */


/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
  for (let e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
const strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn$2(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
  if (!from) { return to }
  let key,
    toVal,
    fromVal;
  const keys = Object.keys(from);
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn(
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn() {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      }
      return defaultData
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn$2(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook(
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  const ret = {};
  extend(ret, parentVal);
  for (const key in childVal) {
    let parent = ret[key];
    const child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (parentVal, childVal) {
    if (!childVal) { return Object.create(parentVal || null) }
    if (!parentVal) { return childVal }
    const ret = Object.create(null);
    extend(ret, parentVal);
    extend(ret, childVal);
    return ret
  };
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */


/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */

/*  */

/*  */

/*  */

function on(el, dir) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn$2("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1(el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

const baseDirectives = {
  on,
  bind: bind$1,
  cloak: noop
};

/*  */

const CodegenState = function CodegenState(options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  const isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};


function generate$1(
  ast,
  options
) {
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement(el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  }
  // component or element
  let code;
  if (el.component) {
    code = genComponent(el.component, el, state);
  } else {
    const data = el.plain ? undefined : genData$2(el, state);

    const children = el.inlineTemplate ? null : genChildren(el, state, true);
    code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
  }
  // module transforms
  for (let i = 0; i < state.transforms.length; i++) {
    code = state.transforms[i](el, code);
  }
  return code
}

// hoist static sub-trees out
function genStatic(el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce(el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    let key = '';
    let parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      process.env.NODE_ENV !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + (key ? ("," + key) : "") + ")")
  }
  return genStatic(el, state)
}

function genIf(
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions(
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  const condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  }
  return ("" + (genTernaryExp(condition.block)))


  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp(el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor(
  el,
  state,
  altGen,
  altHelper
) {
  const exp = el.for;
  const alias = el.alias;
  const iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  const iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
    "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2(el, state) {
  let data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    const inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives(el, state) {
  const dirs = el.directives;
  if (!dirs) { return }
  let res = 'directives:[';
  let hasRuntime = false;
  let i,
    l,
    dir,
    needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    const gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate(el, state) {
  const ast = el.children[0];
  if (process.env.NODE_ENV !== 'production' && (
    el.children.length > 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    const inlineRenderFns = generate$1(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots(
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
    return genScopedSlot(key, slots[key], state)
  }).join(',')) + "])")
}

function genScopedSlot(
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  return "{key:" + key + ",fn:function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el, state) || 'void 0'
      : genElement(el, state)) + "}}"
}

function genForScopedSlot(
  key,
  el,
  state
) {
  const exp = el.for;
  const alias = el.alias;
  const iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  const iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
    "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren(
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  const children = el.children;
  if (children.length) {
    const el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    const normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    const gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType(
  children,
  maybeComponent
) {
  let res = 0;
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
      (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
      (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization(el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  }
  return genText(node)
}

function genText(text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment(comment) {
  return ("_e('" + (comment.text) + "')")
}

function genSlot(el, state) {
  const slotName = el.slotName || '"default"';
  const children = genChildren(el, state);
  let res = "_t(" + slotName + (children ? ("," + children) : '');
  const attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  const bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent(
  componentName,
  el,
  state
) {
  const children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps(props) {
  let res = '';
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines(text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
const prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
const unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
const identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
const stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors(ast) {
  const errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode(node, errors) {
  if (node.type === 1) {
    for (const name in node.attrsMap) {
      if (dirRE.test(name)) {
        const value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent(exp, text, errors) {
  const stipped = exp.replace(stripStringRE, '');
  const keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor(node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier(ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression(exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    const keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function createFunction(code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code });
    return noop
  }
}

function createCompileToFunctionFn(compile) {
  const cache = Object.create(null);

  return function compileToFunctions(
    template$$1,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$2(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template$$1
      : template$$1;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    const compiled = compile(template$$1, options);

    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        warn$2(
          "Error compiling template:\n\n" + template$$1 + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    const res = {};
    const fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$2(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            const err = ref.err;
            const code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
          }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator(baseCompile) {
  return function createCompiler(baseOptions) {
    function compile(
      template$$1,
      options
    ) {
      const finalOptions = Object.create(baseOptions);
      const errors = [];
      const tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      const compiled = baseCompile(template$$1, finalOptions);
      if (process.env.NODE_ENV !== 'production') {
        errors.push(...detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

const tagMap = {
  br: 'view',
  hr: 'view',

  p: 'view',
  h1: 'view',
  h2: 'view',
  h3: 'view',
  h4: 'view',
  h5: 'view',
  h6: 'view',
  abbr: 'view',
  address: 'view',
  b: 'view',
  bdi: 'view',
  bdo: 'view',
  blockquote: 'view',
  cite: 'view',
  code: 'view',
  del: 'view',
  ins: 'view',
  dfn: 'view',
  em: 'view',
  strong: 'view',
  samp: 'view',
  kbd: 'view',
  var: 'view',
  i: 'view',
  mark: 'view',
  pre: 'view',
  q: 'view',
  ruby: 'view',
  rp: 'view',
  rt: 'view',
  s: 'view',
  small: 'view',
  sub: 'view',
  sup: 'view',
  time: 'view',
  u: 'view',
  wbr: 'view',

  // 表单元素
  form: 'form',
  input: 'input',
  textarea: 'textarea',
  button: 'button',
  select: 'picker',
  option: 'view',
  optgroup: 'view',
  label: 'label',
  fieldset: 'view',
  datalist: 'picker',
  legend: 'view',
  output: 'view',

  // 框架
  iframe: 'view',
  // 图像
  img: 'image',
  canvas: 'canvas',
  figure: 'view',
  figcaption: 'view',

  // 音视频
  audio: 'audio',
  source: 'audio',
  video: 'video',
  track: 'video',
  // 链接
  a: 'navigator',
  nav: 'view',
  link: 'navigator',
  // 列表
  ul: 'view',
  ol: 'view',
  li: 'view',
  dl: 'view',
  dt: 'view',
  dd: 'view',
  menu: 'view',
  command: 'view',

  // 表格table
  table: 'view',
  caption: 'view',
  th: 'view',
  td: 'view',
  tr: 'view',
  thead: 'view',
  tbody: 'view',
  tfoot: 'view',
  col: 'view',
  colgroup: 'view',

  // 样式 节
  div: 'view',
  main: 'view',
  span: 'label',
  header: 'view',
  footer: 'view',
  section: 'view',
  article: 'view',
  aside: 'view',
  details: 'view',
  dialog: 'view',
  summary: 'view',

  progress: 'progress',
  meter: 'progress', // todo
  head: 'view', // todo
  meta: 'view', // todo
  base: 'text', // todo
  // 'map': 'image', // TODO不是很恰当
  area: 'navigator', // j结合map使用

  script: 'view',
  noscript: 'view',
  embed: 'view',
  object: 'view',
  param: 'view',

  // https://mp.weixin.qq.com/debug/wxadoc/dev/component/
  // [...document.querySelectorAll('.markdown-section tbody td:first-child')].map(v => v.textContent).join(',\n')
  view: 'view',
  'scroll-view': 'scroll-view',
  swiper: 'swiper',
  icon: 'icon',
  text: 'text',
  // 'progress': 'progress',
  // 'button': 'button',
  // 'form': 'form',
  // 'input': 'input',
  checkbox: 'checkbox',
  radio: 'radio',
  picker: 'picker',
  'picker-view': 'picker-view',
  slider: 'slider',
  switch: 'switch',
  // 'label': 'label',
  navigator: 'navigator',
  // 'audio': 'audio',
  image: 'image',
  // 'video': 'video',
  map: 'map',
  // 'canvas': 'canvas',
  'contact-button': 'contact-button',
  block: 'block'
};

function maybeTag(tagName) {
  return tagMap[tagName]
}

function getWxEleId(index, arr) {
  if (!arr || !arr.length) {
    return ("'" + index + "'")
  }

  const str = arr.join("+'-'+");
  return ("'" + index + "-'+" + str)
}

// 检查不允许在 v-for 的时候出现2个及其以上相同 iterator1
function checkRepeatIterator(arr, options) {
  const len = arr.length;
  if (len > 1 && len !== new Set(arr).size) {
    options.warn(("同一组件内嵌套的 v-for 不能连续使用相同的索引，目前为: " + arr), false);
  }
}

function fixDefaultIterator(path) {
  const forText = path.for;
  const iterator1 = path.iterator1;
  if (forText && !iterator1) {
    path.iterator1 = 'index';
  }
}

function addAttr$1(path, key, value, inVdom) {
  path[key] = value;
  path.plain = false;
  // path.attrsMap[key] = value
  if (!inVdom) {
    path.attrsMap[("data-" + key)] = "{{" + value + "}}";
  }

  // if (!path.attrsList) {
  //   path.attrsList = []
  // }
  // path.attrsList.push({ name: `':${key}'`, value })

  if (!path.attrs) {
    path.attrs = [];
  }
  path.attrs.push({ name: key, value });
}

function mark(path, options, deps, iteratorArr) {
  if (iteratorArr === void 0) iteratorArr = [];

  fixDefaultIterator(path);

  const tag = path.tag;
  const children = path.children;
  const iterator1 = path.iterator1;
  const events = path.events;
  const directives = path.directives;
  const ifConditions = path.ifConditions;

  const currentArr = Object.assign([], iteratorArr);

  if (iterator1) {
    currentArr.push(iterator1);
  }

  checkRepeatIterator(currentArr, options);

  // 递归子节点
  if (children && children.length) {
    children.forEach(function (v, i) {
      // const counterIterator = children.slice(0, i).filter(v => v.for).map(v => v.for + '.length').join(`+'-'+`)
      mark(v, options, deps, currentArr);
    });
  }

  // fix: v-else events
  if (ifConditions && ifConditions.length > 1) {
    ifConditions.slice(1).forEach(function (v, i) {
      mark(v.block, options, deps, currentArr);
    });
  }

  // for mpvue-template-compiler
  // events || v-model
  const hasModel = directives && directives.find(function (v) { return v.name === 'model'; });
  const needEventsID = events || hasModel;

  if (needEventsID) {
    const eventId = getWxEleId(deps.eventIndex, currentArr);
    // const eventId = getWxEleId(eIndex, currentArr)
    addAttr$1(path, 'eventid', eventId);
    path.attrsMap['data-comkey'] = '{{$k}}';
    deps.eventIndex += 1;
    // eIndex += 1
  }

  // 子组件
  if (!tag || maybeTag(tag)) {
    return
  }

  // eg. '1-'+i+'-'+j
  const value = getWxEleId(deps.comIndex, currentArr);
  addAttr$1(path, 'mpcomid', value, true);
  path.mpcomid = value;
  deps.comIndex += 1;
}

// 全局的事件触发器 ID
// let eIndex = 0
function markComponent(ast, options) {
  const deps = { comIndex: 0, eventIndex: 0 };
  mark(ast, options, deps);

  return ast
}

/*  */

// for mp
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
const createCompiler = createCompilerCreator(function baseCompile(
  template$$1,
  options
) {
  const originAst = parse(template$$1.trim(), options);
  const ast = markComponent(originAst, options);
  optimize(ast, options);
  const code = generate$1(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

// type：
// 0, 默认值, 拼接 ${name}={{ ${content} }}
// 1, 拼接 ${name}
// 2, 拼接 ${map[key]}={{ '${content}' }}
// 3, 拼接 {{ ${content} }}
// 4, 拼接为空字符串
// 5, 不需要在wxml上表现出来，可直接清除

const noSupport = {
  type: 4,
  check(k, v, errors) {
    errors(("不支持此指令: " + k + "=\"" + v + "\""));
    return false
  }
};
const wxmlDirectiveMap = {
  'v-if': {
    name: 'wx:if',
    type: 0
  },
  'v-else-if': {
    name: 'wx:elif',
    type: 0
  },
  'v-else': {
    name: 'wx:else',
    type: 1
  },
  'v-text': {
    name: '',
    type: 1
  },
  'v-html': {
    name: '',
    type: 1
  },
  'v-on': {
    name: '',
    map: {
      click: 'tap',
      touchstart: 'touchstart',
      touchmove: 'touchmove',
      touchcancel: 'touchcancel',
      touchend: 'touchend',
      tap: 'tap',
      longtap: 'longtap',
      input: 'input',
      change: 'change',
      submit: 'submit',
      blur: 'blur',
      focus: 'focus',
      reset: 'reset',
      confirm: 'confirm',
      columnchange: 'columnchange',
      linechange: 'linechange',
      error: 'error',
      scrolltoupper: 'scrolltoupper',
      scrolltolower: 'scrolltolower',
      scroll: 'scroll',
      load: 'load'
    },
    type: 2
  },
  'v-bind': {
    name: '',
    map: {
      href: 'url'
    },
    type: 3
  },
  href: {
    name: 'url',
    type: 2
  },
  'v-pre': noSupport,
  'v-cloak': noSupport,
  'v-once': {
    name: '',
    type: 5
  }
};

const tagConfig = {
  virtualTag: ['slot', 'template', 'block']
};

// babel-plugin-transform-object-to-ternary-operator.js

function getStrByNode(node, onlyStr) {
  if (onlyStr === void 0) onlyStr = false;

  if (onlyStr) {
    return node.value || node.name || ''
  }
  return node.type === 'StringLiteral' ? node : t.stringLiteral(node.name || '')
}

// 把 { key: value } 转换成 [ value ? 'key' : '' ]
const objectVisitor = {
  ObjectExpression(path) {
    const elements = path.node.properties.map(function (propertyItem) {
      return t.conditionalExpression(propertyItem.value, getStrByNode(propertyItem.key), t.stringLiteral(''))
    });
    path.replaceWith(t.arrayExpression(elements));
  }
};

function transformObjectToTernaryOperator(babel$$1) {
  return { visitor: objectVisitor }
}

// 把 { key: value } 转换成 'key:' + value + ';'
const objectToStringVisitor = {
  ObjectExpression(path) {
    const expression = path.node.properties.map(function (propertyItem) {
      const keyStr = getStrByNode(propertyItem.key, true);
      const key = keyStr ? hyphenate(keyStr) : keyStr;
      const ref = generate(t.ExpressionStatement(propertyItem.value));
      const val = ref.code;
      return ("'" + key + ":' + (" + (val.slice(0, -1)) + ") + ';'")
    }).join('+');

    const p = template(expression)({});
    path.replaceWith(p.expression);
  }
};
function transformObjectToString(babel$$1) {
  return { visitor: objectToStringVisitor }
}

function transformDynamicClass(staticClass, clsBinding) {
  if (staticClass === void 0) staticClass = '';

  const result = babel.transform(("!" + clsBinding), { plugins: [transformObjectToTernaryOperator] });
  // 先实现功能，再优化代码
  // https://github.com/babel/babel/issues/7138
  const cls = prettier.format(result.code, { semi: false, singleQuote: true }).slice(1).slice(0, -1).replace(/\n|\r/g, '');
  return (staticClass + " {{" + cls + "}}")
}

function transformDynamicStyle(staticStyle, styleBinding) {
  if (staticStyle === void 0) staticStyle = '';

  const result = babel.transform(("!" + styleBinding), { plugins: [transformObjectToString] });
  const cls = prettier.format(result.code, { semi: false, singleQuote: true }).slice(1).slice(0, -1).replace(/\n|\r/g, '');
  return (staticStyle + " {{" + cls + "}}")
}

const attrs = {
  format: function format(attrs) {
    if (attrs === void 0) attrs = {};

    const obj = {};

    Object.keys(attrs).map(function (key) {
      const val = attrs[key];
      obj[key.replace('@', 'v-on:').replace(/^:/, 'v-bind:')] = val;
    });

    return obj
  },

  convertAttr: function convertAttr(ast, log) {
    const this$1 = this;

    let attrsMap = ast.attrsMap; if (attrsMap === void 0) attrsMap = {};
    const tag = ast.tag;
    const staticClass = ast.staticClass;
    let attrs = {};
    const wxClass = this.classObj(attrsMap['v-bind:class'], staticClass);
    wxClass.length ? attrsMap.class = wxClass : '';
    const wxStyle = this.styleObj(attrsMap['v-bind:style'], attrsMap.style);
    wxStyle.length ? attrsMap.style = wxStyle : '';

    Object.keys(attrsMap).map(function (key) {
      const val = attrsMap[key];
      if (key === 'v-bind:class' || key === 'v-bind:style') {
        return
      }
      if (key === 'v-text') {
        ast.children.unshift({
          text: ("{{" + val + "}}"),
          type: 3
        });
      } else if (key === 'v-html') {
        ast.tag = 'rich-text';
        attrs.nodes = "{{" + val + "}}";
      } else if (key === 'v-show') {
        attrs.hidden = "{{!(" + val + ")}}";
      } else if (/^v\-on\:/i.test(key)) {
        attrs = this$1.event(key, val, attrs, tag);
      } else if (/^v\-bind\:/i.test(key)) {
        attrs = this$1.bind(key, val, attrs, tag, attrsMap['wx:key']);
      } else if (/^v\-model/.test(key)) {
        attrs = this$1.model(key, val, attrs, tag, log);
      } else if (wxmlDirectiveMap[key]) {
        const ref = wxmlDirectiveMap[key] || {};
        let name = ref.name; if (name === void 0) name = '';
        const type = ref.type;
        let map = ref.map; if (map === void 0) map = {};
        const check = ref.check;
        if (!(check && !check(key, val, log)) && !(!name || typeof type !== 'number')) {
          // 见 ./wxmlDirectiveMap.js 注释
          if (type === 0) {
            attrs[name] = "{{" + val + "}}";
          }

          if (type === 1) {
            attrs[name] = undefined;
          }

          if (type === 2) {
            attrs[name] = val;
          }

          if (type === 3) {
            attrs[map[name] || name] = "{{" + val + "}}";
          }
        }
      } else if (/^v\-/.test(key)) {
        log(("不支持此属性-> " + key + "=\"" + val + "\""), 'waring');
      } else {
        if ((tagConfig.virtualTag.indexOf(tag) > -1) && (key === 'class' || key === 'style' || key === 'data-mpcomid')) {
          if (key !== 'data-mpcomid') {
            log(("template 不支持此属性-> " + key + "=\"" + val + "\""), 'waring');
          }
        } else {
          attrs[key] = val;
        }
      }
    });
    ast.attrsMap = attrs;
    return ast
  },

  event: function event(key, val, attrs, tag) {
    // 小程序能力所致，bind 和 catch 事件同时绑定时候，只会触发 bind ,catch 不会被触发。
    // .stop 的使用会阻止冒泡，但是同时绑定了一个非冒泡事件，会导致该元素上的 catchEventName 失效！
    // .prevent 可以直接干掉，因为小程序里没有什么默认事件，比如submit并不会跳转页面
    // .capture 不能做，因为小程序没有捕获类型的事件
    // .self 没有可以判断的标识
    // .once 也不能做，因为小程序没有 removeEventListener, 虽然可以直接在 handleProxy 中处理，但非常的不优雅，违背了原意，暂不考虑
    const name = key.replace(/^v\-on\:/i, '').replace(/\.prevent/i, '');
    const ref = name.split('.');
    const eventName = ref[0];
    const eventNameMap = ref.slice(1);
    const eventMap = wxmlDirectiveMap['v-on'];
    const check = wxmlDirectiveMap.check;

    if (check) {
      check(key, val);
    }
    let wxmlEventName = '';
    if (eventName === 'change' && (tag === 'input' || tag === 'textarea')) {
      wxmlEventName = 'blur';
    } else {
      wxmlEventName = eventMap.map[eventName];
    }

    let eventType = 'bind';
    const isStop = eventNameMap.includes('stop');
    if (eventNameMap.includes('capture')) {
      eventType = isStop ? 'capture-catch:' : 'capture-bind:';
    } else if (isStop) {
      eventType = 'catch';
    }

    wxmlEventName = eventType + (wxmlEventName || eventName);
    attrs[wxmlEventName] = 'handleProxy';

    return attrs
  },

  bind: function bind(key, val, attrs, tag, isIf) {
    const name = key.replace(/^v\-bind\:/i, '');

    if (isIf && name === 'key') {
      attrs['wx:key'] = val;
    }

    if (tag === 'template') {
      return attrs
    }

    if (name === 'href') {
      attrs.url = "{{" + val + "}}";
    } else {
      attrs[name] = "{{" + val + "}}";
    }

    return attrs
  },

  classObj: function classObj(clsBinding, staticCls) {
    if (clsBinding === void 0) clsBinding = '';

    if (!clsBinding && !staticCls) {
      return ''
    }
    if (!clsBinding && staticCls) {
      return staticCls
    }

    return transformDynamicClass(staticCls, clsBinding)
  },

  styleObj: function styleObj(styleBinding, staticStyle) {
    if (styleBinding === void 0) styleBinding = '';

    if (!styleBinding && !staticStyle) {
      return ''
    }
    if (!styleBinding && staticStyle) {
      return staticStyle
    }

    return transformDynamicStyle(staticStyle, styleBinding)
  },

  model: function model(key, val, attrs, tag) {
    const isFormInput = tag === 'input' || tag === 'textarea';
    attrs.value = "{{" + val + "}}";
    if (key === 'v-model.lazy') {
      if (isFormInput) {
        attrs.bindblur = 'handleProxy';
      } else {
        attrs.bindchange = 'handleProxy';
      }
    } else {
      if (isFormInput) {
        attrs.bindinput = 'handleProxy';
      } else {
        attrs.bindchange = 'handleProxy';
      }
    }

    return attrs
  }
};

function getSlotsName(obj) {
  if (!obj) {
    return ''
  }
  // wxml模板中 data="{{ a:{a1:'string2'}, b:'string'}}" 键a不能放在最后，会出错
  return tmplateSlotsObj(obj)
    .concat(
      Object.keys(obj).map(function (k) {
        return '$slot' + k + ":'" + obj[k] + "'"
      })
    )
    .join(',')
}

function tmplateSlotsObj(obj) {
  if (!obj) {
    return []
  }
  // wxml模板中 data="{{ a:{a1:'string2'}, b:'string'}}" 键a1不能写成 'a1' 带引号的形式，会出错
  const $for = Object.keys(obj)
    .map(function (k) {
      return (k + ":'" + (obj[k]) + "'")
    })
    .join(',');
  return $for ? [("$for:{" + $for + "}")] : []
}

const component = {
  isComponent: function isComponent(tagName, components) {
    if (components === void 0) components = {};

    return !!components[tagName]
  },
  convertComponent: function convertComponent(ast, components, slotName) {
    const attrsMap = ast.attrsMap;
    const tag = ast.tag;
    const mpcomid = ast.mpcomid;
    const slots = ast.slots;
    if (slotName) {
      attrsMap.data = "{{...$root[$p], ...$root[$k], $root}}";
      // bindedName is available when rendering slot in v-for
      const bindedName = attrsMap['v-bind:name'];
      if (bindedName) {
        attrsMap.is = "{{$for[" + bindedName + "]}}";
      } else {
        attrsMap.is = "{{" + slotName + "}}";
      }
    } else {
      const slotsName = getSlotsName(slots);
      const restSlotsName = slotsName ? (", " + slotsName) : '';
      attrsMap.data = "{{...$root[$kk+" + mpcomid + "], $root" + restSlotsName + "}}";
      attrsMap.is = components[tag].name;
    }
    return ast
  }
};

const tag = function (ast, options) {
  const tag = ast.tag;
  const elseif = ast.elseif;
  const elseText = ast.else;
  const forText = ast.for;
  let staticClass = ast.staticClass; if (staticClass === void 0) staticClass = '';
  let attrsMap = ast.attrsMap; if (attrsMap === void 0) attrsMap = {};
  const components = options.components;
  const ifText = attrsMap['v-if'];
  const href = attrsMap.href;
  const bindHref = attrsMap['v-bind:href'];
  const name = attrsMap.name;

  if (!tag) {
    return ast
  }
  const isComponent = component.isComponent(tag, components);
  if (tag !== 'template' && tag !== 'block' && tag !== 'slot' && !isComponent) {
    ast.staticClass = staticClass ? ("_" + tag + " " + staticClass) : ("_" + tag);
  }
  ast.tag = tagMap[tag] || tag;

  const isSlot = tag === 'slot';

  if ((ifText || elseif || elseText || forText) && tag === 'template') {
    ast.tag = 'block';
  } else if (isComponent || isSlot) {
    const originSlotName = name || 'default';
    const slotName = isSlot ? ("$slot" + originSlotName + " || '" + originSlotName + "'") : undefined;

    // 用完必须删除，不然会被编译成 <template name="xxx"> 在小程序中就会表示这是一个模版申明而不是使用，小程序中不能同时申明和使用模版
    delete ast.attrsMap.name;
    ast = component.convertComponent(ast, components, slotName);
    ast.tag = 'template';
  } else if (tag === 'a' && !(href || bindHref)) {
    ast.tag = 'view';
  } else if (ast.events && ast.events.scroll) {
    ast.tag = 'scroll-view';
  } else if (tag === 'input') {
    const type = attrsMap.type;
    if (type && ['button', 'checkbox', 'radio'].indexOf(type) > -1) {
      delete ast.attrsMap.type;
      ast.tag = type;
    }
    if (type === 'button') {
      ast.children.push({
        text: attrsMap.value || '',
        type: 3
      });
      delete ast.attrsMap.value;
    }
  }
  return ast
};

const astMap = {
  if: 'wx:if',
  iterator1: 'wx:for-index',
  key: 'wx:key',
  alias: 'wx:for-item',
  'v-for': 'wx:for'
};

const convertFor = function (ast) {
  const iterator1 = ast.iterator1;
  const forText = ast.for;
  let key = ast.key;
  const alias = ast.alias;
  const attrsMap = ast.attrsMap;

  if (forText) {
    attrsMap[astMap['v-for']] = "{{" + forText + "}}";
    if (iterator1) {
      attrsMap[astMap.iterator1] = iterator1;
    }
    if (key) {
      // @修改 兼容:key="item.id" => wx:key="id"
      key = key.replace(/([\s\S]*)[.]/, '')
      attrsMap[astMap.key] = key;
    }
    if (alias) {
      attrsMap[astMap.alias] = alias;
    }

    delete attrsMap['v-for'];
  }

  return ast
};

function convertAst(node, options, util) {
  if (options === void 0) options = {};

  const children = node.children;
  const ifConditions = node.ifConditions;
  let staticClass = node.staticClass; if (staticClass === void 0) staticClass = '';
  const mpcomid = node.mpcomid;
  let tagName = node.tag;
  const log = util.log;
  const deps = util.deps;
  const slots = util.slots;
  const slotTemplates = util.slotTemplates;
  let wxmlAst = Object.assign({}, node);
  const moduleId = options.moduleId;
  const components = options.components;
  wxmlAst.tag = tagName = tagName ? hyphenate(tagName) : tagName;
  // 引入 import, isSlot 是使用 slot 的编译地方，意即 <slot></slot> 的地方
  const isSlot = tagName === 'slot';
  if (isSlot) {
    deps.slots = 'slots';
    // 把当前 slot 节点包裹 template
    const defSlot = Object.assign({}, wxmlAst);
    defSlot.tag = 'template';
    const templateName = "" + (defSlot.attrsMap.name || 'default');
    defSlot.attrsMap.name = templateName;
    wxmlAst.children = [];
    defSlot.parent = node.parent.parent;
    slotTemplates[templateName] = defSlot;
  }

  const currentIsComponent = component.isComponent(tagName, components);
  if (currentIsComponent) {
    deps[tagName] = tagName;
  }

  if (moduleId && !currentIsComponent && tagConfig.virtualTag.indexOf(tagName) < 0) {
    wxmlAst.staticClass = staticClass ? (moduleId + " " + staticClass).replace(/\"/g, '') : moduleId;
  } else {
    wxmlAst.staticClass = staticClass.replace(/\"/g, '');
  }

  // 组件内部的node节点全部是 slot
  wxmlAst.slots = {};
  if (currentIsComponent && children && children.length) {
    // 只检查组件下的子节点（不检查孙子节点）是不是具名 slot，不然就是 default slot
    children
      .reduce(function (res, n) {
        const ref = n.attrsMap || {};
        const slot = ref.slot;
        // 不是具名的，全部放在第一个数组元素中
        const arr = slot ? res : res[0];
        arr.push(n);
        return res
      }, [[]])
      .forEach(function (n) {
        const isDefault = Array.isArray(n);
        const slotName = isDefault ? 'default' : n.attrsMap.slot;
        const slotId = moduleId + "-" + slotName + "-" + (mpcomid.replace(/\'/g, ''));
        const node = isDefault ? { tag: 'slot', attrsMap: {}, children: n } : n;

        node.tag = 'template';
        node.attrsMap.name = slotId;
        delete node.attrsMap.slot;
        // 缓存，会集中生成一个 slots 文件
        slots[slotId] = { node: convertAst(node, options, util), name: slotName, slotId };
        wxmlAst.slots[slotName] = slotId;
      });
    // 清理当前组件下的节点信息，因为 slot 都被转移了
    children.length = 0;
    wxmlAst.children.length = 0;
  }

  wxmlAst.attrsMap = attrs.format(wxmlAst.attrsMap);
  wxmlAst = tag(wxmlAst, options);
  wxmlAst = convertFor(wxmlAst, options);
  wxmlAst = attrs.convertAttr(wxmlAst, log);
  if (children && !isSlot) {
    wxmlAst.children = children.map(function (k) { return convertAst(k, options, util); });
  }

  if (ifConditions) {
    const length = ifConditions.length;
    for (let i = 1; i < length; i++) {
      wxmlAst.ifConditions[i].block = convertAst(ifConditions[i].block, options, util);
    }
  }

  return wxmlAst
}

function wxmlAst(compiled, options, log) {
  if (options === void 0) options = {};

  const ast = compiled.ast;
  const deps = {
    // slots: 'slots'
  };
  const slots = {
    // slotId: nodeAst
  };
  const slotTemplates = {
  };

  const wxast = convertAst(ast, options, { log, deps, slots, slotTemplates });
  const children = Object.keys(slotTemplates).map(function (k) { return convertAst(slotTemplates[k], options, { log, deps, slots, slotTemplates }); });
  wxast.children = children.concat(wxast.children);
  return {
    wxast,
    deps,
    slots
  }
}

function generate$2(obj, options) {
  if (options === void 0) options = {};

  const tag = obj.tag;
  let attrsMap = obj.attrsMap; if (attrsMap === void 0) attrsMap = {};
  const children = obj.children;
  const text = obj.text;
  const ifConditions = obj.ifConditions;
  if (!tag) { return text }
  let child = '';
  if (children && children.length) {
    // 递归子节点
    child = children.map(function (v) { return generate$2(v, options); }).join('');
  }

  // v-if 指令
  const ifConditionsArr = [];
  if (ifConditions) {
    const length = ifConditions.length;
    for (let i = 1; i < length; i++) {
      ifConditionsArr.push(generate$2(ifConditions[i].block, options));
    }
  }

  const attrs = Object.keys(attrsMap).map(function (k) { return convertAttr(k, attrsMap[k]); }).join(' ');

  const tags = ['progress', 'checkbox', 'switch', 'input', 'radio', 'slider', 'textarea'];
  if (tags.indexOf(tag) > -1 && !(children && children.length)) {
    return ("<" + tag + (attrs ? ' ' + attrs : '') + " />" + (ifConditionsArr.join('')))
  }
  return ("<" + tag + (attrs ? ' ' + attrs : '') + ">" + (child || '') + "</" + tag + ">" + (ifConditionsArr.join('')))
}

function convertAttr(key, val) {
  return (val === '' || typeof val === 'undefined') ? key : (key + "=\"" + val + "\"")
}

const utils = {
  toLowerCase: function toLowerCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase().trim()
  },

  getChar: function getChar(index) {
    return String.fromCharCode(0x61 + index)
  },

  log: function log(compiled) {
    compiled.mpErrors = [];
    compiled.mpTips = [];

    return function (str, type) {
      if (type === 'waring') {
        compiled.mpTips.push(str);
      } else {
        compiled.mpErrors.push(str);
      }
    }
  }
};

function compileToWxml(compiled, options) {
  if (options === void 0) options = {};

  // TODO, compiled is undefined
  let components = options.components; if (components === void 0) components = {};
  const log = utils.log(compiled);

  const ref = wxmlAst(compiled, options, log);
  const wxast = ref.wxast;
  let deps = ref.deps; if (deps === void 0) deps = {};
  let slots = ref.slots; if (slots === void 0) slots = {};
  let code = generate$2(wxast, options);

  // 引用子模版
  const importCode = Object.keys(deps).map(function (k) { return components[k] ? ("<import src=\"" + (components[k].src) + "\" />") : ''; }).join('');
  code = importCode + "<template name=\"" + (options.name) + "\">" + code + "</template>";

  // 生成 slots code
  Object.keys(slots).forEach(function (k) {
    const slot = slots[k];
    slot.code = generate$2(slot.node, options);
  });

  // TODO: 后期优化掉这种暴力全部 import，虽然对性能没啥大影响
  return { code, compiled, slots, importCode }
}

/*  */

const ref = createCompiler(baseOptions);
const compile = ref.compile;
const compileToFunctions = ref.compileToFunctions;

/*  */

exports.parseComponent = parseComponent;
exports.compile = compile;
exports.compileToFunctions = compileToFunctions;
exports.compileToWxml = compileToWxml;
