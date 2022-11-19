import { Plugin } from 'obsidian';

const CLASSNAME_TAG = 'classname:';

// not a real CSS parser, but works in most cases
const makeScopedStyles = (rootSelector: string, source: string): string =>
    source.trim().split(/(?<=\})/).map((ruleset) => {
        const [selector, declaraions] = ruleset.split(/(?=\{)/);
        return `:where(${rootSelector}) :where(${selector.trim().replace(/\n/, ' ')}) ${declaraions}`;
    })
    .join('');

export default class extends Plugin {
    private lastClassName: string | undefined;

    onload() {
        this.registerMarkdownCodeBlockProcessor('style', (source, element) => {
            const style = element.ownerDocument.createElement('style');
            style.innerHTML = makeScopedStyles('.markdown-preview-view', source);
            element.replaceWith(style);
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
};
