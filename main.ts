import { hasPseudoElements, parseRulesets, parseSelector, splitPseudoElements } from 'not-a-real-css-parser';
import { Plugin } from 'obsidian';

const CLASSNAME_TAG = 'classname:';

const makeScopedStyles = (rootSelector: string, source: string): string =>
    parseRulesets(source).map(({ selector, declarations }) => {
        if (hasPseudoElements(selector)) {
            return parseSelector(selector).map((selector) => {
                const [selectorHead, pseudoElement] = splitPseudoElements(selector);
                return `${rootSelector} :is(${selectorHead})${pseudoElement ?? ''} {${declarations}}`;
            })
            .join(',');
        }
        return `${rootSelector} :is(${selector}) {${declarations}}`;
    })
    .join('\n');

export default class extends Plugin {
    private lastClassName: string | undefined;

    onload() {
        this.registerMarkdownCodeBlockProcessor('style', (source, element) => {
            element.createEl('style', {
                text: makeScopedStyles('.markdown-preview-view', source)
            });
        });

        this.registerMarkdownPostProcessor((element) => {
            if (element.hasClass('next-class-skip')) {
                return;
            }

            if (this.lastClassName !== undefined) {
                element.classList.add(...this.lastClassName.split(/\s+/));
                this.lastClassName = undefined;
            }

            const codeElements = element.querySelectorAll('code');

            const classElement = [...codeElements].find(
                (element) => element.innerText.trim().startsWith(CLASSNAME_TAG)
            );

            if (classElement) {
                this.lastClassName = classElement.innerText.slice(CLASSNAME_TAG.length);
                if (classElement.parentElement?.childElementCount === 1) {
                    classElement.parentElement.remove();
                }
                element.classList.add('next-class-skip');
            }
        });
    }
}
