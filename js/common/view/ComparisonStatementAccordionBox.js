// Copyright 2019, University of Colorado Boulder

/**
 * ComparisonStatementAccordionBox is an accordion box that contains a comparison statement, both of which are
 * configured with the default values used in the "Number Line: Integers" sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementNode' );
  const merge = require( 'PHET_CORE/merge' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const comparisonStatementString = require( 'string!NUMBER_LINE_INTEGERS/comparisonStatement' );

  // constants
  const TITLE_FONT = new PhetFont( 18 );
  const COMPARISON_STATEMENT_BOX_WIDTH = 340; // empirically determined to look decent
  const DEFAULT_OPTIONS = {
    fill: 'white',
    showTitleWhenExpanded: false,
    cornerRadius: 5,
    contentAlign: 'right',
    centerX: 512, // taken from default layoutBounds.centerX
    top: 10,
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
     */
    constructor( numberLine ) {

      // create the comparison statement node
      const comparisonStatementNode = new ComparisonStatementNode( numberLine );

      // embed the comparison statement in an accordion box
      super( comparisonStatementNode, merge( {}, DEFAULT_OPTIONS, {
        titleNode: new Text( comparisonStatementString, {
          font: TITLE_FONT,
          maxWidth: COMPARISON_STATEMENT_BOX_WIDTH * 0.8
        } )
      } ) );

      // @public (read-only) - make the comparison statement node visible to clients
      this.comparisonStatementNode = comparisonStatementNode;
    }

    reset() {
      this.comparisonStatementNode.selectedOperatorProperty.reset();
      this.expandedProperty.reset();
    }
  }

  return numberLineIntegers.register( 'ComparisonStatementAccordionBox', ComparisonStatementAccordionBox );
} );
