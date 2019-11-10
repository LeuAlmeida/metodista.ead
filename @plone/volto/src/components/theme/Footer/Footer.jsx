/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, Divider, List, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */

const Footer = ({ intl }) => (
  <Segment vertical padded inverted color="blue" textAlign="left">
    <Container>
      <List horizontal inverted>
        <List.Item href="/sitemap">
          <FormattedMessage id="Site Map" defaultMessage="Educação Metodista" />
        </List.Item>
      </List>
    </Container>
  </Segment>
);

/**
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Footer);
