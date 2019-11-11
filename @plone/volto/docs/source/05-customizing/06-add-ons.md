# Add-on packages

There are several advanced scenarios where we might want to have more control
and flexibility beyond using the plain Volto project to build a site.

## Use add-on products

We can build Volto add-on products and make them available as published
packages (from public/private npm repositories), or as checkouts from git
repositories using `mr-developer` helper.

We can use them to easily reuse components across projects, like custom tiles,
views, widgets, or any other Volto or React artifact.

### Mr. Developer

Eric Brehault ported this amazing tool from Python, which provides a way to pull
a package from git and set it up as a dependency for the current project
codebase.

https://www.npmjs.com/package/mr-developer

By doing this, you can develop both the project and the add-on product as if they
were both part of the current codebase. Once the add-on development is done,
you can publish the package to an npm repository.

Volto is also capable of using aliases for your (unreleased) package, so that once
you've released it, you don't need to change import paths, since you can use the
final ones from the very beginning.

## Configuring a Volto project to use a Volto add-on product

### Add mr-developer dependency and related script

```
$ yarn add mr-developer
```

and in `package.json`:

```json
  "scripts": {
    "develop": "mrdeveloper --config=jsconfig.json --no-config --output=addons",
    ...
  }
```

we can configure `mr-developer` to use any directory that you want. Here we are
telling it to create the directory `src/addons` and put the packages managed by
`mr-developer` inside.

### mr.developer.json

This is the configuration file that instructs `mr-developer` from where it has
to pull the packages. So, in `mr.developer.json`:

```json
{
  "@plone/my-volto-addon": {
      "url": "git@github.com:plone/my-volto-addon.git"
  }
}
```

If you want to know more about `mr-developer` config options, please refer to
[its npm page](https://www.npmjs.com/package/mr-developer).

### jsconfig.json

You can let `mr-developer` create this file for you or create it manually.
By default, the script in the above section will *not* create it.

```json
{
    "compilerOptions": {
        "paths": {
            "@plone/my-volto-addon": [
                "addons/@plone/my-volto-addon/src"
            ]
        },
        "baseUrl": "src"
    }
}
```

!!! warning
    Please note that both `paths` and `baseUrl` are required to match your
    project layout.

### Fix tests

We should let jest about our aliases and make them available to it to resolve
them, so in `package.json`:

```json hl_lines="6"
  "jest": {
    ...
    "moduleNameMapper": {
      "@plone/volto/(.*)$": "<rootDir>/node_modules/@plone/volto/src/$1",
      "@package/(.*)$": "<rootDir>/src/$1",
      "@plone/my-volto-addon/(.*)$": "<rootDir>/src/addons/@plone/my-volto-addon/src/$1",
      "~/(.*)$": "<rootDir>/src/$1"
    },
    ...
```

### .eslintrc

Add the path to the `eslintrc` file in order to the linter not to complain if
you import from a package that does not yet exist (since it's an alias).

```json hl_lines="9"
{
  "extends": "./node_modules/@plone/volto/.eslintrc",
  "settings": {
    "import/resolver": {
      "alias": {
        "map": [
          ["@plone/volto", "@plone/volto/src"],
          ["@package", "./src"],
          ["@plone/my-volto-addon", "./src/addons/@plone/my-volto-addon/src"]
        ],
        "extensions": [".js", ".jsx", ".json"]
      },
      "babel-plugin-root-import": {
        "rootPathSuffix": "src"
      }
    }
  }
}
```

## Add several layers of customizations

In `package.json` we can add more customization layers that will be added to the
current ones. These will be added to the aliases list, with the last ones
having more precedence. You have to keep sanity in the overriding layers, since
Volto is not yet ready to do it for you.

Set them up in the `customizationPaths` key in the `package.json` file on your
Volto project.

```json
"customizationPaths": ["src/customizations/", "src/addons/@plone/my-volto-addon/src/customizations/"],
```

!!! tip
    Do not forget the `/` at the end of both
