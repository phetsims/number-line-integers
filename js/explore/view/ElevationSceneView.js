// Copyright 2019-2021, University of Colorado Boulder

/**
 * view for the "Elevation" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import birdInAir from '../../../../number-line-common/images/bird-air_png.js';
import birdInWater from '../../../../number-line-common/images/bird-water_png.js';
import elevationBackground from '../../../images/elevation-background_png.js';
import fishInAir from '../../../../number-line-common/images/fish-air_png.js';
import fishInWater from '../../../../number-line-common/images/fish-water_png.js';
import girlInAir from '../../../images/girl-air_png.js';
import girlOnRock from '../../../images/girl-rock_png.js';
import girlInWater from '../../../images/girl-water_png.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import numberLineIntegersStrings from '../../numberLineIntegersStrings.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import ElevationPointControllerNode from './ElevationPointControllerNode.js';
import SceneView from './SceneView.js';

// constants
const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );

const elevationAmountString = numberLineIntegersStrings.elevationAmount;
const elevationString = numberLineIntegersStrings.elevation;


class ElevationSceneView extends SceneView {

  /**
   * @param {ElevationSceneModel} sceneModel
   * @param {Bounds2} layoutBounds
   * @public
   */
  constructor( sceneModel, layoutBounds ) {

    super( sceneModel, layoutBounds, {
      commonNumberLineNodeOptions: {
        numericalLabelTemplate: elevationAmountString,
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
    this.scenesLayer.addChild( elevationAreaImage );

    // Add the node that represents the box that will hold the items that the user can elevate.
    this.scenesLayer.addChild( Rectangle.bounds( sceneModel.elevatableItemsBoxBounds, {
      fill: 'white',
      stroke: 'black',
      cornerRadius: 6
    } ) );

    // Add label for the number line.
    const numberLineLabel = new Text( elevationString, {
      font: NUMBER_LINE_LABEL_FONT,
      centerX: sceneModel.numberLines[ 0 ].centerPositionProperty.value.x,
      bottom: this.numberLineNodes[ 0 ].top - 5,
      maxWidth: this.layoutBounds.width * 0.18
    } );
    sceneModel.showNumberLineProperty.linkAttribute( numberLineLabel, 'visible' );
    this.scenesLayer.addChild( numberLineLabel );

    // Define a function that will be used to switch images based on its position in the model space.
    const selectImageIndex = ( position, currentlySelectedImageIndex ) => {

      // This function is intended to have some hysteresis, i.e. the image doesn't change until the point controller
      // fully transitions from above to below sea level or vice versa.
      let index = currentlySelectedImageIndex;
      if ( position.y > sceneModel.seaLevel ) {
        index = 0;
      }
      else if ( position.y < sceneModel.seaLevel ) {
        index = 1;
      }
      return index;
    };

    // Add a layer where the elevation point controllers go.
    const elevationPointControllersLayer = new Node();
    this.scenesLayer.addChild( elevationPointControllersLayer );

    // Add the girl that the user can place in the elevation scene.
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
        imageSelectionFunction: ( position, currentlySelectedImageIndex ) => {

          // This function is intended to have some hysteresis, i.e. the image doesn't change until the point
          // controller fully transitions from above to below sea level or vice versa.
          let imageIndex = currentlySelectedImageIndex;
          if ( position.y > sceneModel.seaLevel ) {

            // image for underwater
            imageIndex = 0;
          }
          else if ( position.y < sceneModel.seaLevel ) {

            // The position is above sea level.  Decide whether to use the hiker or paraglider image.  This function
            // was empirically determined to match the background image and will have to be updated if the background
            // image for the scene changes.
            if ( position.x >
                 ( sceneModel.elevationAreaBounds.centerX + 40 + 0.6 * ( sceneModel.seaLevel - position.y ) ) ) {

              // hiker
              imageIndex = 2;
            }
            else {

              // paraglider
              imageIndex = 1;
            }
          }
          return imageIndex;
        },
        connectorLine: false
      }
    ) );

    // Add the bird that the user can place in the elevation scene.
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

    // Add the fish that the user can place in the elevation scene.
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

    // Add the water.
    this.scenesLayer.addChild( new Rectangle(
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

    // Add the layer where the attached point controllers go.
    const attachedPointControllersLayer = new Node();
    this.addChild( attachedPointControllersLayer );
    attachedPointControllersLayer.moveToBack(); // so that they are behind the number line in z-order

    // The visibility of the attached point controllers should be the same as the number line.
    sceneModel.showNumberLineProperty.linkAttribute( attachedPointControllersLayer, 'visible' );

    // Add/remove the nodes that represent the point controllers that are attached to the number line.
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

numberLineIntegers.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;
