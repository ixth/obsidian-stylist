# Obsidian Stylist

*Stylist* is a plugin for Obsidian that allows to add classes and styles on markdown.


> **Note**
> This plugin doesn't work in Live Preview mode.


## Examples

For example, if you want to add underline for headings on one particular page, you can do it like this:

````markdown
```style
h2 {
    text-decoration: underline;
}
```

## Does wood sink in water?
````

Result:

![Style tag render](./style-dark.png#gh-dark-mode-only)
![Style tag render](./style-light.png#gh-light-mode-only)

> **Note**
> All styles are processed to prevent messing up the rest of the Obsidian app.

Or if you want certain blocks on your page to use multi-column layout, you can just add class on containing block:

````markdown
```style
.multicol-3 ul {
    columns: 3;
}
```

## What also floats in water?

%% Class will be added not to the list element itself,
    but to section container, so you should write styles respectively %%

`classname:multicol-3`

* Bread
* Apples
* Very small rocks
* Cider
* Grape gravy
* Cherries
* Mum
* Churches
* Lead
* A duck
````

Result:

![Class render](./class-dark.png#gh-dark-mode-only)
![Class render](./class-light.png#gh-light-mode-only)
