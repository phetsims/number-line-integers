// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that depicts a "comparison statement" between zero to three values, for example, "1 < 5 < 7".  It
 * also include a selector that allows users to choose between the greater than or less than comparison operator.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  class ComparisonStatementNode extends Node {

    /**
     *
     * @param {NumberLine} numberLine - the number line whose point values are being depicted
     */
    constructor( numberLine ) {

      super();

      const comparisonStatement = new Text( '0', { font: new PhetFont( 22 ) } );
      this.addChild( comparisonStatement );
    }

  }

  return numberLineIntegers.register( 'ComparisonStatementNode', ComparisonStatementNode );
} );