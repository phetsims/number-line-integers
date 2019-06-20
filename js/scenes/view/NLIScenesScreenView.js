// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const AccordionBox = require( 'SUN/AccordionBox' );
  const BankPointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/BankPointControllerNode' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/generic/view/ComparisonStatementNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const ElevationPointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/ElevationPointControllerNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const Path = require( 'SCENERY/nodes/Path' );
  const piggyBankShapes = require( 'NUMBER_LINE_INTEGERS/scenes/view/piggyBankShapes' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const RandomIconFactory = require( 'NUMBER_LINE_INTEGERS/common/view/RandomIconFactory' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

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
  const birdInAir = require( 'image!NUMBER_LINE_INTEGERS/bird-air.png' );
  const birdInWater = require( 'image!NUMBER_LINE_INTEGERS/bird-water.png' );
  const girlInAir = require( 'image!NUMBER_LINE_INTEGERS/girl-air.png' );
  const girlInWater = require( 'image!NUMBER_LINE_INTEGERS/girl-water.png' );
  const girlOnRock = require( 'image!NUMBER_LINE_INTEGERS/girl-rock.png' );
  const elevationBackground = require( 'image!NUMBER_LINE_INTEGERS/elevation-background.png' );
  const fishInAir = require( 'image!NUMBER_LINE_INTEGERS/fish-air.png' );
  const fishInWater = require( 'image!NUMBER_LINE_INTEGERS/fish-water.png' );
  const temperatureMap = require( 'image!NUMBER_LINE_INTEGERS/temporary-temperature-map.gif' );

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
      const selectImageIndex = position => position.y > sceneModel.seaLevel ? 0 : 1;

      // add a layer where the elevation point controllers go
      const elevationPointControllersLayer = new Node();
      this.addChild( elevationPointControllersLayer );

      // add the girl that the user can place in the elevation scene
      elevationPointControllersLayer.addChild( new ElevationPointControllerNode(
        sceneModel.permanentPointControllers[ 0 ],
        [
          new Image( girlInWater, { maxWidth: 85, center: Vector2.ZERO } ),
          new Image( girlInAir, { maxWidth: 90, center: Vector2.ZERO } ),
          new Image( girlOnRock, { maxWidth: 30, center: Vector2.ZERO } )
        ],
        {
          // special highly tweaked function for having the hiker image show up over the cliff
          imageSelectionFunction: position => {
            let imageIndex;
            if ( position.y > sceneModel.seaLevel ) {
              imageIndex = 0;
            }
            else {
              if ( position.x >
                   ( sceneModel.elevationAreaBounds.centerX + 40 + 0.6 * ( sceneModel.seaLevel - position.y ) ) ) {
                imageIndex = 2;
              }
              else {
                imageIndex = 1;
              }
            }
            return imageIndex;
          },
          connectorLine: false
        }
      ) );

      // add the bird that the user can place in the elevation scene
      elevationPointControllersLayer.addChild( new ElevationPointControllerNode(
        sceneModel.permanentPointControllers[ 1 ],
        [
          new Image( birdInWater, { maxWidth: 65, center: Vector2.ZERO } ),
          new Image( birdInAir, { maxWidth: 60, center: Vector2.ZERO } )
        ],
        {
          imageSelectionFunction: selectImageIndex,
          connectorLine: false
        }
      ) );

      // add the fish that the user can place in the elevation scene
      elevationPointControllersLayer.addChild( new ElevationPointControllerNode(
        sceneModel.permanentPointControllers[ 2 ],
        [
          new Image( fishInWater, { maxWidth: 60, center: Vector2.ZERO } ),
          new Image( fishInAir, { maxWidth: 60, center: Vector2.ZERO } )
        ],
        {
          imageSelectionFunction: selectImageIndex,
          connectorLine: false
        }
      ) );

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

      // add the layer where the attached point controllers go
      const attachedPointControllersLayer = new Node();
      this.addChild( attachedPointControllersLayer );
      attachedPointControllersLayer.moveToBack(); // so that they are behind the number line in z-order

      // the visibility of the attached point controllers should be the same as the number line
      sceneModel.showNumberLineProperty.linkAttribute( attachedPointControllersLayer, 'visible' );

      // add/remove the nodes that represent the point controllers that are attached to the number line
      sceneModel.numberLineAttachedPointControllers.addItemAddedListener( addedPointController => {
        const pointControllerNode = new PointControllerNode( addedPointController );
        attachedPointControllersLayer.addChild( pointControllerNode );
        const handlePointControllerRemoved = removedPointController => {
          if ( addedPointController === removedPointController ) {
            attachedPointControllersLayer.removeChild( pointControllerNode );
            pointControllerNode.dispose();
            sceneModel.numberLineAttachedPointControllers.removeItemRemovedListener( handlePointControllerRemoved );
          }
        };
        sceneModel.numberLineAttachedPointControllers.addItemRemovedListener( handlePointControllerRemoved );
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

      // add the switch that controls whether one or two accounts are shown
      this.addChild( new AccountVisibilityControlSwitch( sceneModel.showComparisonAccountProperty, {
        right: this.layoutBounds.maxX - INSET,
        centerY: this.numberLineNode.centerY
      } ) );

      // add node to represent the point controller that is always visible
      const permanentPointControllerNode = new BankPointControllerNode( sceneModel.primaryAccountPointController, 'flowers' );
      this.addChild( permanentPointControllerNode );
      permanentPointControllerNode.moveToBack(); // make sure this is behind the number line point that it controls

      // add and remove a node for the comparison account point controller as it comes and goes
      let comparisonAccountPointControllerNode = null;
      sceneModel.comparisonAccountPointControllerProperty.lazyLink( pointController => {
        if ( pointController ) {
          comparisonAccountPointControllerNode = new BankPointControllerNode( pointController, 'lightning' );
          this.addChild( comparisonAccountPointControllerNode );
          comparisonAccountPointControllerNode.moveToBack(); // make sure this is behind the number line point that it controls
        }
        else {
          this.removeChild( comparisonAccountPointControllerNode );
          comparisonAccountPointControllerNode.dispose();
        }
      } );
    }
  }

  /**
   * switch for controlling whether one or two account balances are shown
   * @private
   */
  class AccountVisibilityControlSwitch extends ABSwitch {

    constructor( property, options ) {

      options = _.extend( {
        switchSize: new Dimension2( 50, 15 )
      }, options );

      const lineWidth = 2;

      super(
        property,
        false,
        new Path( piggyBankShapes.SMALL_PIGGY_BANK_SHAPE, {
          maxWidth: 30,
          fill: 'white',
          stroke: 'blue',
          lineWidth: lineWidth
        } ),
        true,
        new HBox( {
          children: [
            new Path( piggyBankShapes.SMALL_PIGGY_BANK_SHAPE, {
              maxWidth: 20,
              fill: 'white',
              stroke: 'blue',
              lineWidth: lineWidth
            } ),
            new Path( piggyBankShapes.SMALL_PIGGY_BANK_SHAPE, {
              maxWidth: 30,
              fill: 'white',
              stroke: 'orange',
              lineWidth: lineWidth
            } )
          ],
          spacing: 10
        } ),
        options
      );
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