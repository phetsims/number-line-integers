// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/generic/view/ComparisonStatementNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const RandomIconFactory = require( 'NUMBER_LINE_INTEGERS/common/view/RandomIconFactory' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const CHECK_BOX_FONT = new PhetFont( 20 );
  const COMPARISON_STATEMENT_BOX_WIDTH = 300; // empirically determined to look decent

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const comparisonStatementString = require( 'string!NUMBER_LINE_INTEGERS/comparisonStatement' );
  const numberLineString = require( 'string!NUMBER_LINE_INTEGERS/numberLine' );

  // images
  const elevationBackground = require( 'image!NUMBER_LINE_INTEGERS/elevation-background.png' );

  // constants
  const INSET = 10;
  const ICON_FACTORY = new RandomIconFactory( 900005 );

  class NLIScenesScreenView extends ScreenView {

    /**
     * @param {NLIScenes} model
     */
    constructor( model ) {

      super();

      // create the root nodes for each of the scenes
      const elevationScene = new ElevationSceneView( model.elevationSceneModel, this.layoutBounds );
      this.addChild( elevationScene );
      const bankScene = new BankSceneView( model.bankSceneModel, this.layoutBounds );
      this.addChild( bankScene );
      const temperatureScene = new TemperatureSceneView( model.temperatureSceneModel, this.layoutBounds );
      this.addChild( temperatureScene );

      // control the visibility of the scenes
      model.selectedSceneProperty.link( selectedScene => {
        elevationScene.visible = selectedScene === NLIScene.ELEVATION;
        bankScene.visible = selectedScene === NLIScene.BANK;
        temperatureScene.visible = selectedScene === NLIScene.TEMPERATURE;
      } );

      // map the scene selection icons to their enum values (used in the radio buton group)
      const orientationButtonsContent = [
        {
          value: NLIScene.ELEVATION,
          node: ICON_FACTORY.createIcon().setScaleMagnitude( 0.07, 0.1 )
        },
        {
          value: NLIScene.BANK,
          node: ICON_FACTORY.createIcon().setScaleMagnitude( 0.07, 0.1 )
        },
        {
          value: NLIScene.TEMPERATURE,
          node: ICON_FACTORY.createIcon().setScaleMagnitude( 0.07, 0.1 )
        }
      ];

      // create scene selector radio buttons
      const sceneSelectorRadioButtonGroup = new RadioButtonGroup(
        model.selectedSceneProperty,
        orientationButtonsContent,
        {
          buttonContentXMargin: 5,
          buttonContentYMargin: 5,
          right: this.layoutBounds.maxX - INSET,
          bottom: this.layoutBounds.maxY - 100,
          baseColor: 'white',
          selectedLineWidth: 2,
          deselectedLineWidth: .5,
          deselectedButtonOpacity: 0.25,
          orientation: 'horizontal',
          spacing: 10
        }
      );
      this.addChild( sceneSelectorRadioButtonGroup );


      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - INSET,
        bottom: this.layoutBounds.maxY - INSET
      } );
      this.addChild( resetAllButton );
    }

    // @public
    step( dt ) {
      //TODO Handle view animation here.
    }
  }

  /**
   * base class for scene views, includes check boxes, comparison statement, et cetera
   */
  class SceneView extends Node {

    constructor( sceneModel, layoutBounds ) {

      super();

      // @protected (read-only) {Bounds2}
      this.layoutBounds = layoutBounds;

      // add the checkboxes that control common model properties
      this.addChild( new VBox( {
        children: [
          new Checkbox(
            new Text( absoluteValueString, { font: CHECK_BOX_FONT } ),
            sceneModel.showAbsoluteValuesProperty
          ),
          new Checkbox(
            new Text( numberLineString, { font: CHECK_BOX_FONT } ),
            sceneModel.showNumberLineProperty
          )
        ],
        spacing: 15,
        align: 'left',
        left: layoutBounds.maxX - 250,
        top: layoutBounds.minY + 10
      } ) );

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

      // add the number line
      const numberLineNode = new NumberLineNode( sceneModel.numberLine );
      sceneModel.showNumberLineProperty.linkAttribute( numberLineNode, 'visible' );
      this.addChild( numberLineNode );
    }
  }

  /**
   * view for the elevation scene
   */
  class ElevationSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds );

      // add the background image that depicts elevation
      this.addChild( new Image( elevationBackground, {
        maxWidth: 500,
        centerX: this.layoutBounds.centerX,
        centerY: this.layoutBounds.centerY
      } ) );
    }
  }

  /**
   * view for the elevation scene
   */
  class BankSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds );

      // TODO: temp
      this.addChild( new Text( 'Bank Scene', {
        font: new PhetFont( 40 ),
        center: this.layoutBounds.center
      } ) );
    }
  }

  /**
   * view for the temperature scene
   */
  class TemperatureSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds );

      // TODO: temp
      this.addChild( new Text( 'Temperature Scene', {
        font: new PhetFont( 40 ),
        center: this.layoutBounds.center
      } ) );
    }
  }

  return numberLineIntegers.register( 'NLIScenesScreenView', NLIScenesScreenView );
} );