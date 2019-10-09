// Copyright 2019, University of Colorado Boulder

/**
 * base class for scene views in the "Explore" screen, includes check boxes, comparison statement, and some other UI
 * elements that are common to all scenes
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Checkbox = require( 'SUN/Checkbox' );
  const Color = require( 'SCENERY/util/Color' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementNode' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const CHECKBOX_FONT = new PhetFont( 16 );

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const numberLineString = require( 'string!NUMBER_LINE_INTEGERS/numberLine' );

  class SceneView extends Node {

    constructor( sceneModel, layoutBounds, options ) {

      options = _.extend( {
        numberLineNodeOptions: {}
      }, options );

      super();

      // @protected (read-only) {Bounds2}
      this.layoutBounds = layoutBounds;

      // @protected {VBox} - node containing the checkboxes that control common model properties
      this.checkboxGroup = new VBox( {
        children: [
          new Checkbox(
            new Text( absoluteValueString, { font: CHECKBOX_FONT } ),
            sceneModel.numberLine.showAbsoluteValuesProperty
          ),
          new Checkbox(
            new Text( numberLineString, { font: CHECKBOX_FONT } ),
            sceneModel.showNumberLineProperty
          )
        ],
        spacing: 15,
        align: 'left',
        left: layoutBounds.maxX - 175,
        top: layoutBounds.minY + 10
      } );
      this.addChild( this.checkboxGroup );

      // @protected - comparison statement
      this.comparisonStatementNode = new ComparisonStatementNode( sceneModel.numberLine );

      // @protected - enclose the comparison statement in an accordion box
      this.comparisonStatementAccordionBox = new AccordionBox(
        this.comparisonStatementNode,
        NLIConstants.COMPARISON_STATEMENT_ACCORDION_BOX_OPTIONS
      );
      this.addChild( this.comparisonStatementAccordionBox );

      // @protected (read-only) {NumberLine} - view of the number line
      this.numberLineNode = new NumberLineNode( sceneModel.numberLine, options.numberLineNodeOptions );
      sceneModel.showNumberLineProperty.linkAttribute( this.numberLineNode, 'visible' );
      this.addChild( this.numberLineNode );

      // button that restores the scene to its initial state but doesn't reset all aspects of the scene like the reset
      // all button does
      const sceneResetButton = new ResetButton( {
        listener: function() {
          sceneModel.resetScene();
        },
        baseColor: Color.lightGray,
        scale: 0.65,
        touchAreaDilation: 5,

        // position just above the scene selection buttons and left aligned with them
        right: layoutBounds.maxX - 115,
        bottom: layoutBounds.maxY - 150
      } );
      this.addChild( sceneResetButton );
    }

    /**
     * @public
     */
    reset() {
      this.comparisonStatementNode.selectedOperatorProperty.reset();
    }
  }

  return numberLineIntegers.register( 'SceneView', SceneView );
} );