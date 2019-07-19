// Copyright 2019, University of Colorado Boulder

/**
 * base class for scene views in the "Scenes" screen, includes check boxes, comparison statement, and some other UI
 * elements that are common to all scenes
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const CHECK_BOX_FONT = new PhetFont( 16 );
  const COMPARISON_STATEMENT_BOX_WIDTH = 300; // empirically determined to look decent

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const comparisonStatementString = require( 'string!NUMBER_LINE_INTEGERS/comparisonStatement' );
  const numberLineString = require( 'string!NUMBER_LINE_INTEGERS/numberLine' );

  class SceneView extends Node {

    constructor( sceneModel, layoutBounds ) {

      super();

      // @protected (read-only) {Bounds2}
      this.layoutBounds = layoutBounds;

      // @protected {VBox} - node containing the checkboxes that control common model properties
      this.checkboxGroup = new VBox( {
        children: [
          new Checkbox(
            new Text( absoluteValueString, { font: CHECK_BOX_FONT } ),
            sceneModel.numberLine.showAbsoluteValuesProperty
          ),
          new Checkbox(
            new Text( numberLineString, { font: CHECK_BOX_FONT } ),
            sceneModel.showNumberLineProperty
          )
        ],
        spacing: 15,
        align: 'left',
        left: layoutBounds.maxX - 175,
        top: layoutBounds.minY + 10
      } );
      this.addChild( this.checkboxGroup );

      // add the comparison statement
      const comparisonStatementNode = new ComparisonStatementNode( sceneModel.numberLine );

      // enclose the comparison statement in an accordion box
      const comparisonStatementAccordionBox = new AccordionBox( comparisonStatementNode, {
        fill: 'white',
        titleNode: new Text( comparisonStatementString, {
          font: new PhetFont( 16 ),
          maxWidth: COMPARISON_STATEMENT_BOX_WIDTH * 0.8
        } ),
        showTitleWhenExpanded: false,
        cornerRadius: 5,
        contentAlign: 'right',
        centerX: this.layoutBounds.centerX,
        top: 10,
        minWidth: COMPARISON_STATEMENT_BOX_WIDTH,
        maxWidth: COMPARISON_STATEMENT_BOX_WIDTH
      } );
      this.addChild( comparisonStatementAccordionBox );

      // @protected (read-only) {NumberLine} - view of the number line
      this.numberLineNode = new NumberLineNode( sceneModel.numberLine );
      sceneModel.showNumberLineProperty.linkAttribute( this.numberLineNode, 'visible' );
      this.addChild( this.numberLineNode );
    }
  }

  return numberLineIntegers.register( 'SceneView', SceneView );
} );