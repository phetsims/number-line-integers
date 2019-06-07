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
  const ElevationPointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/ElevationPointControllerNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const RandomIconFactory = require( 'NUMBER_LINE_INTEGERS/common/view/RandomIconFactory' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const CHECK_BOX_FONT = new PhetFont( 16 );
  const COMPARISON_STATEMENT_BOX_WIDTH = 300; // empirically determined to look decent
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const balanceString = require( 'string!NUMBER_LINE_INTEGERS/balance' );
  const comparisonStatementString = require( 'string!NUMBER_LINE_INTEGERS/comparisonStatement' );
  const elevationString = require( 'string!NUMBER_LINE_INTEGERS/elevation' );
  const numberLineString = require( 'string!NUMBER_LINE_INTEGERS/numberLine' );

  // images
  const elevationBackground = require( 'image!NUMBER_LINE_INTEGERS/elevation-background.png' );
  const temperatureMap = require( 'image!NUMBER_LINE_INTEGERS/temporary-temperature-map.gif' );
  const fishInAir = require( 'image!NUMBER_LINE_INTEGERS/fish-air.png' );
  const fishInWater = require( 'image!NUMBER_LINE_INTEGERS/fish-water.png' );

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
          spacing: 6
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
        left: layoutBounds.maxX - 175,
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

      // @protected (read-only) {NumberLine} - view of the number line
      this.numberLineNode = new NumberLineNode( sceneModel.numberLine );
      sceneModel.showNumberLineProperty.linkAttribute( this.numberLineNode, 'visible' );
      this.addChild( this.numberLineNode );
    }
  }

  /**
   * view for the elevation scene
   */
  class ElevationSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds );

      // Create and add the background image for the area where the user will be able to place things and change their
      // elevation.  This is scaled to match the bounds defined in the model, so the resolution and aspect ratio of the
      // image needs to be close to what is shown or this won't look good.
      const elevationAreaImage = new Image( elevationBackground );
      elevationAreaImage.scale(
        sceneModel.elevationAreaBounds.width / elevationAreaImage.width,
        sceneModel.elevationAreaBounds.height / elevationAreaImage.height
      );
      elevationAreaImage.center = sceneModel.elevationAreaBounds.center;
      this.addChild( elevationAreaImage );

      // add the water
      this.addChild( new Rectangle(
        0,
        0,
        sceneModel.elevationAreaBounds.width,
        sceneModel.elevationAreaBounds.maxY - sceneModel.seaLevel,
        {
          left: sceneModel.elevationAreaBounds.minX,
          top: sceneModel.seaLevel,
          fill: 'rgba( 0, 204, 204, 0.25 )'
        }
      ) );

      // add the node that represents the box that will hold the items that the user can elevate
      this.addChild( new Rectangle.bounds( sceneModel.elevatableItemsBoxBounds, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } ) );

      // add label for the number line
      const numberLineLabel = new Text( elevationString, {
        font: NUMBER_LINE_LABEL_FONT,
        centerX: sceneModel.numberLine.centerPosition.x,
        bottom: this.numberLineNode.top - 5
      } );
      sceneModel.showNumberLineProperty.linkAttribute( numberLineLabel, 'visible' );
      this.addChild( numberLineLabel );

      // define a function that will be used to switch images based on its position in the model space
      const selectImageIndex = position => {
        let imageIndex;
        if ( position.y > sceneModel.seaLevel ) {
          imageIndex = 0;
        }
        else {
          imageIndex = 1;
        }
        return imageIndex;
      };

      // add the point controllers that allow the user to place items on the elevation background
      const fishImageWidth = 60; // empirically determined to look good
      sceneModel.pointControllers.forEach( pointController => {
        this.addChild( new ElevationPointControllerNode(
          pointController,
          [
            new Image( fishInWater, { maxWidth: fishImageWidth } ),
            new Image( fishInAir, { maxWidth: fishImageWidth } )
          ],
          { imageSelectionFunction: selectImageIndex }
        ) );
      } );
    }
  }

  /**
   * view for the elevation scene
   */
  class BankSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds );

      // number line label
      this.addChild( new Text( balanceString, {
        font: NUMBER_LINE_LABEL_FONT,
        right: this.numberLineNode.left - 4,
        centerY: sceneModel.numberLine.centerPosition.y
      } ) );
    }
  }

  /**
   * view for the temperature scene
   */
  class TemperatureSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds );

      // TODO: temporary version of the map image
      const temperatureMapImage = new Image( temperatureMap );
      temperatureMapImage.center = layoutBounds.center;
      this.addChild( temperatureMapImage );
    }
  }

  return numberLineIntegers.register( 'NLIScenesScreenView', NLIScenesScreenView );
} );