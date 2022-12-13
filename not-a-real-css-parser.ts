// not a real CSS parser, but works in most cases

interface Ruleset {
    selector: string;
    declarations: string;
}

const PSEUDO_ELEMENT_REGEX = /(?=::(?:before|after|first-letter))/;

export const parseRulesets = (source: string): Ruleset[] =>
    source.trim().split('}')
        .filter((ruleset) => ruleset.contains('{'))
        .map((ruleset) => {
            const [selector, declarations] = ruleset.split('{');
            const trimmedSelector = selector.trim().replace(/\n/g, ' ');
            return {
                selector: trimmedSelector,
                declarations
            };
        });

export const parseSelector = (selector: string) =>
    selector.split(',').map((selector) => selector.trim());

export const hasPseudoElements = (selector: string): boolean =>
    PSEUDO_ELEMENT_REGEX.test(selector);

export const splitPseudoElements = (selector: string): string[] =>
    selector.split(PSEUDO_ELEMENT_REGEX);
