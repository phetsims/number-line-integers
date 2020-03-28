// Copyright 2019-2020, University of Colorado Boulder

/**
 * ComparisonStatementAccordionBox is an accordion box that contains a "comparison statement", which is a mathematical
 * statement comparing up to three values.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberLineIntegersStrings from '../../number-line-integers-strings.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import ComparisonStatementNode from './ComparisonStatementNode.js';

const comparisonStatementString = numberLineIntegersStrings.comparisonStatement;

// constants
const TITLE_FONT = new PhetFont( 18 );
const COMPARISON_STATEMENT_BOX_WIDTH = 340; // empirically determined to look decent
const DEFAULT_OPTIONS = {
  fill: 'white',
  showTitleWhenExpanded: false,
  cornerRadius: 5,
  contentAlign: 'right',
  minWidth: COMPARISON_STATEMENT_BOX_WIDTH,
  maxWidth: COMPARISON_STATEMENT_BOX_WIDTH,
  buttonXMargin: 8,
  buttonYMargin: 6,
  expandCollapseButtonOptions: {
    touchAreaXDilation: 15,
    touchAreaYDilation: 15,
    mouseAreaXDilation: 5,
    mouseAreaYDilation: 5
  }
};

class ComparisonStatementAccordionBox extends AccordionBox {

  /**
   * @param {NumberLine} numberLine - the number line whose point values are being depicted
   * @param {Object} [options]
   * @public
   */
  constructor( numberLine, options ) {

    // create the comparison statement node
    const comparisonStatementNode = new ComparisonStatementNode( numberLine );

    // embed the comparison statement in an accordion box
    super( comparisonStatementNode, merge( {}, DEFAULT_OPTIONS, options, {
      titleNode: new Text( comparisonStatementString, {
        font: TITLE_FONT,
        maxWidth: COMPARISON_STATEMENT_BOX_WIDTH * 0.8
      } )
    } ) );

    // @public (read-only) - make the comparison statement node visible to clients
    this.comparisonStatementNode = comparisonStatementNode;
  }

  /**
   * @public
   */
  reset() {
    this.comparisonStatementNode.selectedOperatorProperty.reset();
    this.expandedProperty.reset();
  }
}

numberLineIntegers.register( 'ComparisonStatementAccordionBox', ComparisonStatementAccordionBox );
export default ComparisonStatementAccordionBox;