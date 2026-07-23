// Reads the two Figma native token exports (tokens/primitives.json, tokens/semantic.json),
// resolves each semantic token's alias to its primitive (via $extensions.aliasData.targetVariableName,
// per DS-Decision-Log §6d — $value alone is a resolved copy, not a live reference),
// and writes the flattened result into src/app/globals.css between marker comments.
//
// Run with: npm run tokens:build

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PRIMITIVES_PATH = path.join(ROOT, "tokens", "primitives.json");
const SEMANTIC_PATH = path.join(ROOT, "tokens", "semantic.json");
const GLOBALS_CSS_PATH = path.join(ROOT, "src", "app", "globals.css");

const BEGIN_MARKER = "/* BEGIN GENERATED TOKENS — do not hand-edit, run `npm run tokens:build` */";
const END_MARKER = "/* END GENERATED TOKENS */";

// DS-Decision-Log §6b — semantic token path -> shadcn/code CSS var name.
// text/size/* intentionally omitted: unused until path (b) per the doc.
const SEMANTIC_TO_CSS_VAR = {
  "color/primary/default": "--primary",
  "color/primary/hover": "--primary-hover",
  "color/primary/foreground": "--primary-foreground",
  "color/surface/background": "--background",
  "color/surface/foreground": "--foreground",
  "color/border/default": "--border",
  "color/accent/default": "--accent",
  "color/accent/foreground": "--accent-foreground",
  "color/focus/ring": "--ring",
  "radius/default": "--radius",
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Walks a Figma token export tree, returning a flat map keyed by slash-delimited
// path (e.g. "color/brand/500") -> the raw token leaf ($type/$value/$extensions).
function flattenLeaves(node, prefix, out) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (value && typeof value === "object" && "$value" in value) {
      out[prefix ? `${prefix}/${key}` : key] = value;
    } else if (value && typeof value === "object") {
      flattenLeaves(value, prefix ? `${prefix}/${key}` : key, out);
    }
  }
  return out;
}

// Extracts a CSS-ready value from a token leaf: hex string for colors, "<n>px" for numbers.
function toCssValue(leaf) {
  if (leaf.$type === "color") {
    return leaf.$value.hex;
  }
  if (leaf.$type === "number") {
    return `${leaf.$value}px`;
  }
  throw new Error(`Unhandled $type "${leaf.$type}" — extend toCssValue() to support it.`);
}

function main() {
  const primitives = flattenLeaves(readJson(PRIMITIVES_PATH), "", {});
  const semantic = flattenLeaves(readJson(SEMANTIC_PATH), "", {});

  const rootLines = [];
  const themeLines = [];

  for (const [semanticPath, cssVar] of Object.entries(SEMANTIC_TO_CSS_VAR)) {
    const leaf = semantic[semanticPath];
    if (!leaf) {
      throw new Error(`Semantic token "${semanticPath}" not found in ${SEMANTIC_PATH}`);
    }

    const targetVariableName = leaf.$extensions?.["com.figma.aliasData"]?.targetVariableName;
    if (!targetVariableName) {
      throw new Error(
        `Semantic token "${semanticPath}" has no $extensions["com.figma.aliasData"].targetVariableName — ` +
          `it must alias a primitive (see DS-Decision-Log §6d).`
      );
    }

    const primitiveLeaf = primitives[targetVariableName];
    if (!primitiveLeaf) {
      throw new Error(
        `Semantic token "${semanticPath}" aliases "${targetVariableName}", but that primitive was not found in ${PRIMITIVES_PATH}`
      );
    }

    const cssValue = toCssValue(primitiveLeaf);
    rootLines.push(`  ${cssVar}: ${cssValue};`);

    if (leaf.$type === "color") {
      themeLines.push(`  --color-${cssVar.slice(2)}: var(${cssVar});`);
    }
  }

  const block = [
    BEGIN_MARKER,
    ":root {",
    ...rootLines,
    "}",
    "",
    "@theme inline {",
    ...themeLines,
    "}",
    END_MARKER,
  ].join("\n");

  const existing = fs.readFileSync(GLOBALS_CSS_PATH, "utf8");
  const beginIdx = existing.indexOf(BEGIN_MARKER);
  const endIdx = existing.indexOf(END_MARKER);

  let updated;
  if (beginIdx !== -1 && endIdx !== -1) {
    updated = existing.slice(0, beginIdx) + block + existing.slice(endIdx + END_MARKER.length);
  } else {
    updated = existing.trimEnd() + "\n\n" + block + "\n";
  }

  fs.writeFileSync(GLOBALS_CSS_PATH, updated);
  console.log(`Wrote ${Object.keys(SEMANTIC_TO_CSS_VAR).length} token(s) into ${path.relative(ROOT, GLOBALS_CSS_PATH)}`);
}

main();
