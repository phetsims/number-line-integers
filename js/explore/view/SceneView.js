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
  const Checkbox = require( 'SUN/Checkbox' );
  const ComparisonStatementAccordionBox = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementAccordionBox' );
  const merge = require( 'PHET_CORE/merge' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const CHECKBOX_DILATION = 6;
  const CHECKBOX_OPTIONS = { boxWidth: NLIConstants.CHECKBOX_BOX_WIDTH };

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const numberLineString = require( 'string!NUMBER_LINE_INTEGERS/numberLine' );

  class SceneView extends Node {

    constructor( sceneModel, layoutBounds, options ) {

      options = merge( {
        numberLineNodeOptions: {}
      }, options );

      super();

      // @protected (read-only) {Bounds2}
      this.layoutBounds = layoutBounds;

      // @protected (read-only) {Node} - layer where the controls go
      this.controlsLayer = new Node();
      this.addChild( this.controlsLayer );

      // @protected (read-only) {Node} - layer where the scene elements go, populated primarily in sub-classes
      this.scenesLayer = new Node();
      this.addChild( this.scenesLayer );

      // checkboxes that control common model properties
      const checkboxes = [
        new Checkbox(
          new Text( numberLineString, { font: NLIConstants.CHECKBOX_FONT } ),
          sceneModel.showNumberLineProperty,
          CHECKBOX_OPTIONS
        ),
        new Checkbox(
          new Text( absoluteValueString, { font: NLIConstants.CHECKBOX_FONT } ),
          sceneModel.numberLine.showAbsoluteValuesProperty,
          CHECKBOX_OPTIONS
        )
      ];

      // @protected {VBox} - node containing the checkboxes that control common model properties
      this.checkboxGroup = new VBox( {
        children: checkboxes,
        spacing: 15,
        align: 'left',
        left: layoutBounds.maxX - NLIConstants.EXPLORE_SCREEN_CONTROLS_LEFT_SIDE_INSET,
        top: layoutBounds.minY + 10
      } );
      this.controlsLayer.addChild( this.checkboxGroup );

      // adds touch dilations to the checkboxes in the checkboxGroup
      checkboxes.forEach( checkbox => { checkbox.touchArea = checkbox.localBounds.dilated( CHECKBOX_DILATION ); } );

      // @protected
      this.comparisonStatementAccordionBox = new ComparisonStatementAccordionBox( sceneModel.numberLine );
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
        baseColor: '#f2f2f2',
        scale: 0.65,
        touchAreaDilation: 5,

        // position centered just above the scene selection buttons
        centerX: layoutBounds.maxX - 93,
        bottom: layoutBounds.maxY - 165
      } );
      this.controlsLayer.addChild( sceneResetButton );
    }

    /**
     * @public
     */
    reset() {
      this.comparisonStatementAccordionBox.reset();
    }
  }

  return numberLineIntegers.register( 'SceneView', SceneView );
} );
