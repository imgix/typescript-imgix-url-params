import { schema, Schema } from './generated/schema';

type Params = Schema['parameters'];
type ParamSpec = Params[keyof Params];
type Expects = ParamSpec['expects'];
type Expect = Expects[number];
type CategoryValues = Schema['categoryValues'];
type CategoryValue = CategoryValues[number];

export function getSource(): string {
  return `
  export namespace ImgixUrl {
    ${getTypes()}
  }
  `;
}

export function getTypes(): string {
  const allEntries: [string, ParamSpec][] = Object.entries(schema.parameters);
  const allEntriesWithAliases = [...allEntries];

  /*
    Construct a modified verson of allEntries that contains duplicate entries
    for each alias of a given parameter

    Example: if 'w' has an alias 'width', make a separate entry for 'width' with
    the same spec value
  */
  allEntries.map(([_key, value]) => {
    if ('aliases' in value) {
      value.aliases.map((alias: string) => {
        /*
          Take the current list of aliases, replace the current one inline with
          the current key

          Example:

            txtlinecolor has aliases
              [ 'txt-line-color', 'txt-line-clr', 'txtlineclr' ]

            When creating an entry for 'txt-line-color', it should have the
            following aliases: [ 'txtlinecolor', 'txt-line-clr', 'txtlineclr' ]

        */
        const cleanedValue = JSON.parse(JSON.stringify(value));
        const currentAlias = cleanedValue.aliases;
        const currentAliasIndex = currentAlias.indexOf(alias);
        currentAlias[currentAliasIndex] = _key;
        allEntriesWithAliases.push([alias, cleanedValue])
      })
    }
  });

  return [
    getHexColorType(),
    getColorKeywordValueType(schema),
    getFontValueType(schema),
    ...schema.categoryValues.map(
      (category) =>
        `/** @see {@link https://docs.imgix.com/apis/rendering/${category}} */
        ${getParamsInterface(
          getCategoryInterfaceName(category),
          allEntriesWithAliases.filter(([_key, value]) => value.category === category),
        )}`,
    ),
    getImgixUrlParamsType(schema),
  ].join('\n\n');
}

function getImgixUrlParamsType(schema: Schema): string {
  return `
  /** @see {@link https://docs.imgix.com/apis/rendering} */
  export type Params = Partial<${schema.categoryValues
    .map((category) => getCategoryInterfaceName(category))
    .join(' & ')}>`;
}

function getCategoryInterfaceName(category: CategoryValue): string {
  return `${kebabToPascalCase(category)}Params`;
}

function kebabToPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
    .join('');
}

function getParamsInterface(
  name: string,
  entries: [string, ParamSpec][],
): string {
  const props: string[] = entries.map(([key, value]) => {
    const type = getPropTypes(value);

    // construct alias list per parameter
    let aliasTsdocLins: string[] = [];
    if('aliases' in value) {
      aliasTsdocLins = Array.from(value.aliases.map((alias: string) => `@see alias - ${alias}`))
    }

    // construct dependency list per parameter
    let dependencyTsdocLines: string[] = [];
    if ('depends' in value) {
      const dependencies: string[][] = Array.from(value.depends.map((depend: string) => [depend.includes("=") ? depend.split("=")[0] : depend, depend]))
      dependencyTsdocLines = Array.from(dependencies.map(dependency => `@see Depends on: {@link ${dependency[0]} | ${dependency[1]}}`));
    }

    const tsdocLines = [
      value.short_description,
      ...dependencyTsdocLines,
      ...aliasTsdocLins,
      'url' in value && `@see {@link ${value.url}}`,
    ]
      .filter(Boolean)
      .map((line) => ` * ${line}`);
    const tsdoc = ['/**', ...tsdocLines, ' */'].join('\n');
    return [tsdoc, `'${key}': ${type};`].join('\n');
  });

  // return [`export type ${name} = Partial<{`, ...props, '}>'].join('\n\n');
  return [`export interface ${name} {`, ...props, '}'].join('\n\n');
}

function getHexColorType(): string {
  return 'export type HexColor = `#${string}`';
}

function getColorKeywordValueType(schema: Schema): string {
  return `export type ColorKeywordValue = ${schema.colorKeywordValues
    .map((s) => `'${s}'`)
    .join(' | ')}`;
}

function getFontValueType(schema: Schema): string {
  return `export type FontValue = ${schema.fontValues
    .map((s) => `'${s}'`)
    .join(' | ')}`;
}

function getPropTypes({ expects }: ParamSpec): string {
  if (!Array.isArray(expects)) return 'unknown';
  const types = Array.from(
    new Set(expects.map((expect) => getPropType(expect))),
  );
  return (
    types.length > 1 && types.includes('unknown')
      ? types.filter((type) => type !== 'unknown')
      : types
  ).join(' | ');
}

function getPropType(expect: Expect): string {
  if (!expect || typeof expect !== 'object') return 'unknown';
  if ('0' in expect || '1' in expect || '2' in expect || '3' in expect)
    return 'unknown';
  if (expect.type === 'boolean') return 'boolean';
  if (expect.type === 'color_keyword') return 'ColorKeywordValue';
  if (expect.type === 'font') return 'FontValue';
  if (expect.type === 'hex_color') return 'HexColor';
  if (expect.type === 'integer') return 'number';
  if (expect.type === 'list')
    return expect.possible_values.map((s) => `'${s}'`).join(' | ');
  if (expect.type === 'number') return 'number';
  if (expect.type === 'path') return 'string';
  if (expect.type === 'ratio') return 'number | `${string}:${string}`';
  if (expect.type === 'string') {
    if ('possible_values' in expect) {
      return expect.possible_values.map((s) => `'${s}'`).join(' | ');
    }
    return 'string';
  }
  if (expect.type === 'timestamp') return 'string';
  if (expect.type === 'unit_scalar') return 'number';
  if (expect.type === 'url') return 'string';
  return 'unknown';
}
