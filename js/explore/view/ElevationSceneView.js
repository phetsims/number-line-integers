// Copyright 2019, University of Colorado Boulder

/**
 * view for the "Elevation" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ElevationPointControllerNode = require( 'NUMBER_LINE_INTEGERS/explore/view/ElevationPointControllerNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/explore/view/SceneView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  // strings
  const elevationAmountString = require( 'string!NUMBER_LINE_INTEGERS/elevationAmount' );
  const elevationString = require( 'string!NUMBER_LINE_INTEGERS/elevation' );

  // images
  const birdInAir = require( 'image!NUMBER_LINE_INTEGERS/bird-air.png' );
  const birdInWater = require( 'image!NUMBER_LINE_INTEGERS/bird-water.png' );
  const girlInAir = require( 'image!NUMBER_LINE_INTEGERS/girl-air.png' );
  const girlInWater = require( 'image!NUMBER_LINE_INTEGERS/girl-water.png' );
  const girlOnRock = require( 'image!NUMBER_LINE_INTEGERS/girl-rock.png' );
  const elevationBackground = require( 'image!NUMBER_LINE_INTEGERS/elevation-background.png' );
  const fishInAir = require( 'image!NUMBER_LINE_INTEGERS/fish-air.png' );
  const fishInWater = require( 'image!NUMBER_LINE_INTEGERS/fish-water.png' );

  class ElevationSceneView extends SceneView {

    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds, {
        numberLineNodeOptions: {
          numberDisplayTemplate: elevationAmountString,
          tickMarkLabelPositionWhenVertical: 'left'
        }
      } );

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
          new Image( girlInWater, { maxWidth: 85, center: new Vector2( 3, 5 ) } ),
          new Image( girlInAir, { maxWidth: 90, center: new Vector2( 6, -25 ) } ),
          new Image( girlOnRock, { maxWidth: 30, center: new Vector2( 0, 0 ) } )
        ],
        sceneModel.seaLevel,
        [
          new Vector2( 3, 30 ),
          new Vector2( -25, 25 ),
          new Vector2( -25, 20 )
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
          new Image( birdInAir, { maxWidth: 60, center: new Vector2( 0, -10 ) } )
        ],
        sceneModel.seaLevel,
        [
          new Vector2( 6, 11 ),
          new Vector2( 5, 10 )
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
        sceneModel.seaLevel,
        [
          new Vector2( 5, 0 ),
          new Vector2( 5, 5 )
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
          fill: 'rgba( 0, 204, 204, 0.15 )'
        }
      ) );

      // add the layer where the attached point controllers go
      const attachedPointControllersLayer = new Node();
      this.addChild( attachedPointControllersLayer );
      attachedPointControllersLayer.moveToBack(); // so that they are behind the number line in z-order
      this.comparisonStatementAccordionBox.moveToFront(); // so that the comparison statement is ahead of everything else

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

  return numberLineIntegers.register( 'ElevationSceneView', ElevationSceneView );
} );
