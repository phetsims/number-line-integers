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
  const SpatializedNumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/SpatializedNumberLineNode' );
  const ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const CHECKBOX_DILATION = 6;
  const CHECKBOX_OPTIONS = { boxWidth: NLIConstants.CHECKBOX_BOX_WIDTH };

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const labelsString = require( 'string!NUMBER_LINE_INTEGERS/labels' );
  const numberLineString = require( 'string!NUMBER_LINE_INTEGERS/numberLine' );

  class SceneView extends Node {

    constructor( sceneModel, layoutBounds, options ) {

      options = merge( {

        // automatically add number line nodes to the scene graph, set to false if subclasses need more control
        automaticallyAddNLNodes: true,

        // {Object) - common options for the number line node(s)
        commonNumberLineNodeOptions: {},

        // {Object[]|null} - unique options for each of the number lines, null if only one or all are the same
        uniqueNumberLineNodeOptionsList: null

      }, options );

      // options checking
      assert && assert(
        !options.uniqueNumberLineNodeOptionsList || options.uniqueNumberLineNodeOptionsList.length === sceneModel.numberLines.length,
        'the number of option objects for number line nodes does not match the number of number lines'
      );

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
          new Text( numberLineString, NLIConstants.CHECKBOX_TEXT_OPTIONS ),
          sceneModel.showNumberLineProperty,
          CHECKBOX_OPTIONS
        ),
        new Checkbox(
          new Text( labelsString, NLIConstants.CHECKBOX_TEXT_OPTIONS ),
          sceneModel.numberLineLabelsVisibleProperty,
          merge( { enabledProperty: sceneModel.showNumberLineProperty }, CHECKBOX_OPTIONS )
        ),
        new Checkbox(
          new Text( absoluteValueString, NLIConstants.CHECKBOX_TEXT_OPTIONS ),
          sceneModel.numberLineAbsValIndicatorsVisibleProperty,
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
      this.comparisonStatementAccordionBoxes = [];
      sceneModel.numberLines.forEach( numberLine => {
        const comparisonStatementAccordionBox = new ComparisonStatementAccordionBox( numberLine );
        this.comparisonStatementAccordionBoxes.push( comparisonStatementAccordionBox );
        this.addChild( comparisonStatementAccordionBox );
      } );

      // @protected (read-only) {NumberLine} - views of the number lines
      this.numberLineNodes = [];

      // create and, if options dictate, add the number line to the view
      sceneModel.numberLines.forEach( ( numberLine, index ) => {
        const numberLineNode = new SpatializedNumberLineNode(
          numberLine,
          merge(
            {},
            options.commonNumberLineNodeOptions,
            options.uniqueNumberLineNodeOptionsList ? options.uniqueNumberLineNodeOptionsList[ index ] : {}
          )
        );
        sceneModel.showNumberLineProperty.linkAttribute( numberLineNode, 'visible' );
        this.numberLineNodes.push( numberLineNode );
        if ( options.automaticallyAddNLNodes ) {
          this.addChild( numberLineNode );
        }
      } );

      // button that restores the scene to its initial state but doesn't reset the model and view for the whole screen
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
      this.comparisonStatementAccordionBoxes.forEach( csab => { csab.reset(); } );
    }
  }

  return numberLineIntegers.register( 'SceneView', SceneView );
} );
