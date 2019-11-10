# Customizing Components

You are able to customize the existing Volto components using an easy pattern
in the `customizations` folder. You have to identify and locate the component
that you want to customize, let's say the Logo component in [Volto source
code](https://github.com/plone/volto/tree/master/src).

!!! tip
    Those familiar with Plone's JBOT customizing add-on will recognize this
    pattern since it works the same way, except that here you have to create
    exactly the same folder structure of the original instead of using the dotted
    notation used in JBOT overrides.

You can override virtually any component that lives inside the `src` folder and
adapt it to your needs, without touching the original (source) one.
Components are named in a semantic and approachable way.

In order to identify them, you can use several approaches the main one using
[React Developer
Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
then you can inspect the app and find out the name of the component (the name
of the tag), then search for it in the Volto source code.

To override the component, use the same folder structure that
the original component has in the Volto source code and place it inside the
`customizations` folder.

## Customizing the Logo resource

So, for example, if we want to replace the Logo which is located in
Volto at `components/theme/Logo/Logo.svg`, the folder structure needs 
to match the folder structure of Volto in the `customizations` folder. 
So the final path of the new overrided component will
be: `customizations/components/theme/Logo/Logo.svg`.

## Change The Tags Component

When overriding components, we follow the same approach. We will
copy over the original component from the Volto source code, then amend the
imports (if any are required) to match the current folder structure. Point Volto
source code using `@plone/volto` module instead of relative paths and other
amendments required.

Locate the `Tags.jsx` file and override this file so that there is a label in front of the tags with: `Tags:`.

```js hl_lines="20"
    /**
    * Tags component.
    * @module components/theme/Tags/Tags
    */

    import React from 'react';
    import { Link } from 'react-router-dom';
    import PropTypes from 'prop-types';
    import { Container } from 'semantic-ui-react';

    /**
        * Tags component class.
        * @function Tags
        * @param {array} tags Array of tags.
        * @returns {string} Markup of the component.
        */
    const Tags = ({ tags }) =>
        tags && tags.length > 0 ? (
        <Container>
            Tags:
            {tags.map(tag => (
            <Link className="ui label" to={`/search?Subject=${tag}`} key={tag}>
                {tag}
            </Link>
            ))}
        </Container>
        ) : (
        <span />
        );

    /**
        * Property types.
        * @property {Object} propTypes Property types.
        * @static
        */
    Tags.propTypes = {
        tags: PropTypes.arrayOf(PropTypes.string),
    };

    /**
        * Default properties.
        * @property {Object} defaultProps Default properties.
        * @static
        */
    Tags.defaultProps = {
        tags: null,
    };

    export default Tags;
```

The final path of the overrided component will be
`customizations/components/theme/Tags/Tags.jsx`.

