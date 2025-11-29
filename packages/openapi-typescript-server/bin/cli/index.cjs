#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// ../../node_modules/ansi-colors/symbols.js
var require_symbols = __commonJS({
  "../../node_modules/ansi-colors/symbols.js"(exports2, module2) {
    "use strict";
    var isHyper = typeof process !== "undefined" && process.env.TERM_PROGRAM === "Hyper";
    var isWindows = typeof process !== "undefined" && process.platform === "win32";
    var isLinux = typeof process !== "undefined" && process.platform === "linux";
    var common = {
      ballotDisabled: "\u2612",
      ballotOff: "\u2610",
      ballotOn: "\u2611",
      bullet: "\u2022",
      bulletWhite: "\u25E6",
      fullBlock: "\u2588",
      heart: "\u2764",
      identicalTo: "\u2261",
      line: "\u2500",
      mark: "\u203B",
      middot: "\xB7",
      minus: "\uFF0D",
      multiplication: "\xD7",
      obelus: "\xF7",
      pencilDownRight: "\u270E",
      pencilRight: "\u270F",
      pencilUpRight: "\u2710",
      percent: "%",
      pilcrow2: "\u2761",
      pilcrow: "\xB6",
      plusMinus: "\xB1",
      question: "?",
      section: "\xA7",
      starsOff: "\u2606",
      starsOn: "\u2605",
      upDownArrow: "\u2195"
    };
    var windows = Object.assign({}, common, {
      check: "\u221A",
      cross: "\xD7",
      ellipsisLarge: "...",
      ellipsis: "...",
      info: "i",
      questionSmall: "?",
      pointer: ">",
      pointerSmall: "\xBB",
      radioOff: "( )",
      radioOn: "(*)",
      warning: "\u203C"
    });
    var other = Object.assign({}, common, {
      ballotCross: "\u2718",
      check: "\u2714",
      cross: "\u2716",
      ellipsisLarge: "\u22EF",
      ellipsis: "\u2026",
      info: "\u2139",
      questionFull: "\uFF1F",
      questionSmall: "\uFE56",
      pointer: isLinux ? "\u25B8" : "\u276F",
      pointerSmall: isLinux ? "\u2023" : "\u203A",
      radioOff: "\u25EF",
      radioOn: "\u25C9",
      warning: "\u26A0"
    });
    module2.exports = isWindows && !isHyper ? windows : other;
    Reflect.defineProperty(module2.exports, "common", { enumerable: false, value: common });
    Reflect.defineProperty(module2.exports, "windows", { enumerable: false, value: windows });
    Reflect.defineProperty(module2.exports, "other", { enumerable: false, value: other });
  }
});

// ../../node_modules/ansi-colors/index.js
var require_ansi_colors = __commonJS({
  "../../node_modules/ansi-colors/index.js"(exports2, module2) {
    "use strict";
    var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;
    var hasColor = () => {
      if (typeof process !== "undefined") {
        return process.env.FORCE_COLOR !== "0";
      }
      return false;
    };
    var create = () => {
      const colors = {
        enabled: hasColor(),
        visible: true,
        styles: {},
        keys: {}
      };
      const ansi = (style2) => {
        let open = style2.open = `\x1B[${style2.codes[0]}m`;
        let close = style2.close = `\x1B[${style2.codes[1]}m`;
        let regex = style2.regex = new RegExp(`\\u001b\\[${style2.codes[1]}m`, "g");
        style2.wrap = (input, newline) => {
          if (input.includes(close)) input = input.replace(regex, close + open);
          let output = open + input + close;
          return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output;
        };
        return style2;
      };
      const wrap = (style2, input, newline) => {
        return typeof style2 === "function" ? style2(input) : style2.wrap(input, newline);
      };
      const style = (input, stack) => {
        if (input === "" || input == null) return "";
        if (colors.enabled === false) return input;
        if (colors.visible === false) return "";
        let str = "" + input;
        let nl = str.includes("\n");
        let n = stack.length;
        if (n > 0 && stack.includes("unstyle")) {
          stack = [.../* @__PURE__ */ new Set(["unstyle", ...stack])].reverse();
        }
        while (n-- > 0) str = wrap(colors.styles[stack[n]], str, nl);
        return str;
      };
      const define = (name, codes, type) => {
        colors.styles[name] = ansi({ name, codes });
        let keys = colors.keys[type] || (colors.keys[type] = []);
        keys.push(name);
        Reflect.defineProperty(colors, name, {
          configurable: true,
          enumerable: true,
          set(value) {
            colors.alias(name, value);
          },
          get() {
            let color = (input) => style(input, color.stack);
            Reflect.setPrototypeOf(color, colors);
            color.stack = this.stack ? this.stack.concat(name) : [name];
            return color;
          }
        });
      };
      define("reset", [0, 0], "modifier");
      define("bold", [1, 22], "modifier");
      define("dim", [2, 22], "modifier");
      define("italic", [3, 23], "modifier");
      define("underline", [4, 24], "modifier");
      define("inverse", [7, 27], "modifier");
      define("hidden", [8, 28], "modifier");
      define("strikethrough", [9, 29], "modifier");
      define("black", [30, 39], "color");
      define("red", [31, 39], "color");
      define("green", [32, 39], "color");
      define("yellow", [33, 39], "color");
      define("blue", [34, 39], "color");
      define("magenta", [35, 39], "color");
      define("cyan", [36, 39], "color");
      define("white", [37, 39], "color");
      define("gray", [90, 39], "color");
      define("grey", [90, 39], "color");
      define("bgBlack", [40, 49], "bg");
      define("bgRed", [41, 49], "bg");
      define("bgGreen", [42, 49], "bg");
      define("bgYellow", [43, 49], "bg");
      define("bgBlue", [44, 49], "bg");
      define("bgMagenta", [45, 49], "bg");
      define("bgCyan", [46, 49], "bg");
      define("bgWhite", [47, 49], "bg");
      define("blackBright", [90, 39], "bright");
      define("redBright", [91, 39], "bright");
      define("greenBright", [92, 39], "bright");
      define("yellowBright", [93, 39], "bright");
      define("blueBright", [94, 39], "bright");
      define("magentaBright", [95, 39], "bright");
      define("cyanBright", [96, 39], "bright");
      define("whiteBright", [97, 39], "bright");
      define("bgBlackBright", [100, 49], "bgBright");
      define("bgRedBright", [101, 49], "bgBright");
      define("bgGreenBright", [102, 49], "bgBright");
      define("bgYellowBright", [103, 49], "bgBright");
      define("bgBlueBright", [104, 49], "bgBright");
      define("bgMagentaBright", [105, 49], "bgBright");
      define("bgCyanBright", [106, 49], "bgBright");
      define("bgWhiteBright", [107, 49], "bgBright");
      colors.ansiRegex = ANSI_REGEX;
      colors.hasColor = colors.hasAnsi = (str) => {
        colors.ansiRegex.lastIndex = 0;
        return typeof str === "string" && str !== "" && colors.ansiRegex.test(str);
      };
      colors.alias = (name, color) => {
        let fn = typeof color === "string" ? colors[color] : color;
        if (typeof fn !== "function") {
          throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
        }
        if (!fn.stack) {
          Reflect.defineProperty(fn, "name", { value: name });
          colors.styles[name] = fn;
          fn.stack = [name];
        }
        Reflect.defineProperty(colors, name, {
          configurable: true,
          enumerable: true,
          set(value) {
            colors.alias(name, value);
          },
          get() {
            let color2 = (input) => style(input, color2.stack);
            Reflect.setPrototypeOf(color2, colors);
            color2.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;
            return color2;
          }
        });
      };
      colors.theme = (custom) => {
        if (!isObject(custom)) throw new TypeError("Expected theme to be an object");
        for (let name of Object.keys(custom)) {
          colors.alias(name, custom[name]);
        }
        return colors;
      };
      colors.alias("unstyle", (str) => {
        if (typeof str === "string" && str !== "") {
          colors.ansiRegex.lastIndex = 0;
          return str.replace(colors.ansiRegex, "");
        }
        return "";
      });
      colors.alias("noop", (str) => str);
      colors.none = colors.clear = colors.noop;
      colors.stripColor = colors.unstyle;
      colors.symbols = require_symbols();
      colors.define = define;
      return colors;
    };
    module2.exports = create();
    module2.exports.create = create;
  }
});

// src/cli/index.ts
var import_commander = require("commander");
var import_fs = __toESM(require("fs"), 1);
var import_openapi_typescript_server_runtime = require("openapi-typescript-server-runtime");
var import_js_yaml = __toESM(require("js-yaml"), 1);

// src/cli/generate.ts
var import_ts_morph = require("ts-morph");
function generate(spec, types, outpath, version) {
  const project = new import_ts_morph.Project();
  const sourceFile = project.createSourceFile(outpath, "", {
    overwrite: true
  });
  sourceFile.addImportDeclaration({
    namedImports: ["paths"],
    moduleSpecifier: types,
    isTypeOnly: true
  });
  sourceFile.addImportDeclaration({
    namedImports: ["Route"],
    moduleSpecifier: "openapi-typescript-server-runtime",
    isTypeOnly: true
  });
  sourceFile.addImportDeclaration({
    namedImports: ["NotImplementedError"],
    moduleSpecifier: "openapi-typescript-server-runtime"
  });
  const operationsById = {};
  for (const path in spec.paths) {
    const pathSpec = spec.paths[path];
    for (const method in pathSpec) {
      const operation = pathSpec[method];
      if (!operation) {
        throw new Error("no operation");
      }
      const operationId = getOperationId({
        operationId: operation.operationId,
        path,
        method
      });
      const argProperties = [
        {
          name: "parameters",
          type: `paths['${path}']['${method}']['parameters']`
        },
        {
          name: "contentType",
          type: "string"
        },
        {
          name: "req",
          type: "Req"
        },
        {
          name: "res",
          type: "Res"
        }
      ];
      if (operation.requestBody) {
        const type = Object.keys(operation.requestBody.content).map((key) => {
          var _a;
          if ((_a = operation.requestBody) == null ? void 0 : _a.required) {
            return `{
  mediaType: "${key}";
  content: paths['${path}']['${method}']['requestBody']['content']['${key}']
}
`;
          }
          return `{
  mediaType: "${key}";
  content?: NonNullable<paths['${path}']['${method}']['requestBody']>['content']['${key}']
}
`;
        }).join(" | ");
        argProperties.push({
          name: "requestBody",
          type
        });
      }
      const argsInterface = sourceFile.addInterface({
        name: `${capitalize(operationId)}Args`,
        isExported: true,
        typeParameters: [{ name: "Req" }, { name: "Res" }],
        properties: argProperties
      });
      const responseVariantInterfaceNames = [];
      for (const responseVariant in operation.responses) {
        const responseVariantProperties = [
          {
            name: "content",
            type: `{${responseVariant}: paths['${path}']['${method}']['responses']['${responseVariant}']['content']}`
          },
          {
            name: "headers",
            type: "{ [name: string]: any }",
            hasQuestionToken: true
          }
        ];
        if (responseVariant === "default" || responseVariant.includes("XX")) {
          responseVariantProperties.push({
            name: "status",
            type: "number"
          });
        }
        const responseVariantInterface = sourceFile.addInterface({
          name: `${capitalize(operationId)}Result${capitalize(
            responseVariant
          )}`,
          properties: responseVariantProperties
        });
        responseVariantInterfaceNames.push(responseVariantInterface.getName());
      }
      const resultType = sourceFile.addTypeAlias({
        name: `${capitalize(operationId)}Result`,
        isExported: true,
        type: `Promise<${responseVariantInterfaceNames.join(" | ")}>`
      });
      operationsById[operationId] = {
        path,
        method,
        args: argsInterface.getName(),
        result: resultType.getName(),
        summary: operation.summary,
        description: operation.description
      };
      sourceFile.addFunction({
        name: `${operationId}Unimplemented`,
        isExported: true,
        isAsync: true,
        returnType: resultType.getName(),
        statements: (writer) => {
          writer.writeLine("throw new NotImplementedError()");
        }
      });
    }
  }
  const serverInterface = sourceFile.addInterface({
    name: "Server",
    isExported: true,
    typeParameters: [
      { name: "Req", default: "unknown" },
      { name: "Res", default: "unknown" }
    ]
  });
  Object.entries(operationsById).forEach(
    ([operationId, { args, result, summary, description }]) => {
      const p = serverInterface.addProperty({
        name: operationId,
        type: `(
          args: ${args}<Req, Res>
          ) => ${result}`
      });
      if (summary || description) {
        let buffer = summary || "";
        if (summary && description) {
          buffer += "\n\n";
        }
        if (description) {
          buffer += `@description ${description}`;
        }
        p.addJsDoc({
          description: buffer
        });
      }
    }
  );
  sourceFile.addFunction({
    name: "registerRouteHandlers",
    isExported: true,
    parameters: [
      { name: "server", type: `${serverInterface.getName()}<Req, Res>` }
    ],
    typeParameters: [{ name: "Req" }, { name: "Res" }],
    returnType: "Route[]",
    statements: (writer) => {
      writer.writeLine("return [");
      Object.entries(operationsById).forEach(
        ([operationId, { path, method }]) => {
          writer.writeLine("{");
          writer.writeLine(`method: "${method}",`);
          writer.writeLine(`path: "${path}",`);
          writer.writeLine(
            `handler: server.${operationId} as Route["handler"],`
          );
          writer.writeLine("},");
        }
      );
      writer.writeLine("]");
    }
  });
  sourceFile.insertText(
    0,
    `/**
 * This file was auto-generated by openapi-typescript-server@${version || "unknown"}.
 * Do not make direct changes to the file.
 */

  `
  );
  sourceFile.formatText({
    indentMultiLineObjectLiteralBeginningOnBlankLine: true,
    ensureNewLineAtEndOfFile: true,
    indentSize: 2
  });
  return sourceFile;
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function getOperationId({
  operationId,
  path,
  method
}) {
  if (operationId) {
    return operationId;
  }
  const pathParts = path.replace("{", "").replace("}", "").split("/").map((part) => capitalize(part)).join("");
  return `${method}${pathParts}`;
}

// src/cli/index.ts
var import_ansi_colors = __toESM(require_ansi_colors(), 1);

// ../../node_modules/supports-color/index.js
var import_node_process = __toESM(require("process"), 1);
var import_node_os = __toESM(require("os"), 1);
var import_node_tty = __toESM(require("tty"), 1);
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = import_node_process.default;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if (!("FORCE_COLOR" in env)) {
    return;
  }
  if (env.FORCE_COLOR === "true") {
    return 1;
  }
  if (env.FORCE_COLOR === "false") {
    return 0;
  }
  if (env.FORCE_COLOR.length === 0) {
    return 1;
  }
  const level = Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  if (![0, 1, 2, 3].includes(level)) {
    return;
  }
  return level;
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, __spreadValues({
    streamIsTTY: stream && stream.isTTY
  }, options));
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
};
var supports_color_default = supportsColor;

// package.json
var package_default = {
  name: "openapi-typescript-server",
  version: "0.0.14-0",
  description: "Codegenerator for OpenAPI server stubs in TypeScript",
  author: "jasonblanchard",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/jasonblanchard/openapi-typescript-server.git",
    directory: "packages/openapi-typescript-server"
  },
  keywords: [
    "swagger",
    "typescript",
    "ts",
    "dts",
    "openapi",
    "codegen",
    "generation",
    "openapi 3",
    "node",
    "express",
    "web",
    "http",
    "rest",
    "restful",
    "router",
    "app",
    "api"
  ],
  type: "module",
  bin: "./bin/cli/index.cjs",
  exports: {
    import: "./dist/index.js",
    require: "./dist/index.cjs"
  },
  main: "dist/index.cjs",
  module: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    test: "node --test",
    build: "tsup src/cli/index.ts --format cjs --out-dir bin/cli --clean"
  },
  dependencies: {
    commander: "^14.0.2",
    "js-yaml": "^4.1.1",
    "openapi-typescript-server-runtime": "0.0.14-0",
    "ts-morph": "^27.0.2",
    zod: "^4.1.13"
  },
  devDependencies: {
    "@types/js-yaml": "^4.0.9",
    tsup: "^8.5.1"
  }
};

// src/cli/index.ts
var program = new import_commander.Command();
if (!supports_color_default.stdout || supports_color_default.stdout.hasBasic === false) {
  import_ansi_colors.default.enabled = false;
}
program.name("openapi-typescript-server").description("CLI to generate Open API server stub").version(package_default.version).argument("<spec>", "Path to Open API spec file").description("Output generated code").option(
  "-t, --types <types>",
  "Import path (relative to generated output) for type schema generated by open-api-typescript"
).option("-o, --output <dir>", "output directory", "").action((spec, options) => __async(null, null, function* () {
  let specS = "";
  try {
    specS = import_fs.default.readFileSync(spec, "utf-8");
  } catch (e) {
    console.error("Error reading spec file", e.message);
    process.exit(1);
  }
  const specPojo = import_js_yaml.default.load(specS);
  const validateSpecResponse = import_openapi_typescript_server_runtime.OpenAPISpec.safeParse(specPojo);
  if (!validateSpecResponse.success) {
    console.error(validateSpecResponse.error.issues);
    return;
  }
  const sourceFile = generate(
    validateSpecResponse.data,
    options.types,
    options.output,
    package_default.version
  );
  if (options.output) {
    console.log(
      `\u{1F916} ${import_ansi_colors.default.bold("openapi-typescript-server")} ${import_ansi_colors.default.dim(package_default.version)} ${import_ansi_colors.default.green(spec)} \u2192 ${import_ansi_colors.default.green(import_ansi_colors.default.bold(options.output))}`
    );
    sourceFile.saveSync();
    return;
  }
  console.log(sourceFile.print());
}));
program.parse();
