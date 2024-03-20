// Copyright 2019-2024, University of Colorado Boulder

/**
 * a Scenery node that is used to control point positions in the "Elevation" scene of the Number Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import merge from '../../../../phet-core/js/merge.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Path, Text } from '../../../../scenery/js/imports.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';

// constants
const IMAGE_DILATION = 20;
const DISTANCE_TEXT_MAX_WIDTH = 250;

const amountAboveSeaLevelStringProperty = NumberLineIntegersStrings.amountAboveSeaLevelStringProperty;
const amountBelowSeaLevelStringProperty = NumberLineIntegersStrings.amountBelowSeaLevelStringProperty;
const seaLevelStringProperty = NumberLineIntegersStrings.seaLevelStringProperty;

class ElevationPointControllerNode extends PointControllerNode {

  /**
   * @param {ElevationPointController} pointController
   * @param {Image[]} imageList - an array of images used to depict this node
   * @param {number} seaLevel - the y value in view coordinates of the sea level
   * @param {Vector2[]} textOffsets - the offsets for the centerLeft positions of the absolute value texts relative to the image rightCenter
   * @param {Object} [options]
   * @public
   */
  constructor( pointController, imageList, seaLevel, textOffsets, options ) {

    assert && assert( !options || !options.node, 'options should not include a node for this constructor' );

    // Dilate each image's touch area for easier interaction on touch screens.
    imageList.forEach( image => { image.touchArea = image.localBounds.dilated( IMAGE_DILATION ); } );

    // Create a node with all the images that will be used to depict this elevatable item.
    const compositeImageNode = new Node( { children: imageList } );

    options = merge( {

      // Pass in the parent node that includes all images as the node that will control the point.
      node: compositeImageNode,

      // {function} - A function that takes a position and a currently selected image index and returns the index
      // of the image that should be visible.  This enables fairly complex appearance changes to the point controller
      // node.
      imageSelectionFunction: ( position, currentlySelectedImageIndex ) => {
        return currentlySelectedImageIndex;
      }
    }, options );

    let textOffset;

    // Update the visibility of the images as the position changes.
    pointController.positionProperty.link( position => {
      const currentlySelectedImageIndex = _.findIndex( imageList, image => image.visible );
      const selectedImageIndex = options.imageSelectionFunction( position, currentlySelectedImageIndex );
      imageList.forEach( ( image, index ) => {
        image.visible = selectedImageIndex === index;
      } );
      textOffset = textOffsets[ selectedImageIndex ];
    } );

    super( pointController, options );

    const absoluteValueLine = new Path( null, { stroke: pointController.color, lineWidth: 2 } );

    // This assumes that numberLinePoints only has one active numberLinePoint at a time. When a point is removed the
    // property will have a value of null.
    const currentNumberLinePointValueProperty = new Property( null );

    // This DynamicProperty allows our pattern strings to track the value property of the active number line point.
    const pointValueProperty = new DynamicProperty( currentNumberLinePointValueProperty );

    pointController.numberLinePoints.addItemAddedListener( point => {
      assert && assert(
        pointController.numberLinePoints.length === 1,
        'ElevationPointControllerNode should only have one numberLinePoint'
      );
      currentNumberLinePointValueProperty.set( point.valueProperty );
    } );

    // Handle removal of the controlled point from the number line.
    pointController.numberLinePoints.addItemRemovedListener( () => {
      currentNumberLinePointValueProperty.set( null );
    } );

    const amountAboveTextVisibleProperty = new BooleanProperty( false );
    const amountAboveText = new Text(
      new PatternStringProperty( amountAboveSeaLevelStringProperty, { value: pointValueProperty } ),
      {
        font: new PhetFont( 18 ),
        fill: pointController.color,
        maxWidth: DISTANCE_TEXT_MAX_WIDTH,
        visibleProperty: amountAboveTextVisibleProperty
      }
    );

    const amountBelowTextVisibleProperty = new BooleanProperty( false );
    const amountBelowText = new Text(
      new PatternStringProperty( amountBelowSeaLevelStringProperty, { value: pointValueProperty }, {
        maps: {
          value: value => Math.abs( value )
        }
      } ),
      {
        font: new PhetFont( 18 ),
        fill: pointController.color,
        maxWidth: DISTANCE_TEXT_MAX_WIDTH,
        visibleProperty: amountBelowTextVisibleProperty
      }
    );

    const seaLevelTextVisibleProperty = new BooleanProperty( false );
    const seaLevelText = new Text(
      new PatternStringProperty( seaLevelStringProperty, { value: pointValueProperty } ),
      {
        font: new PhetFont( 18 ),
        fill: pointController.color,
        maxWidth: DISTANCE_TEXT_MAX_WIDTH,
        visibleProperty: seaLevelTextVisibleProperty
      }
    );
    const distanceTextWrapper = new Node( {
      children: [ amountAboveText, amountBelowText, seaLevelText ],
      excludeInvisibleChildrenFromBounds: true
    } );

    const distanceLabel = new BackgroundNode( distanceTextWrapper, NLCConstants.LABEL_BACKGROUND_OPTIONS );
    this.addChild( absoluteValueLine );
    this.addChild( distanceLabel );
    absoluteValueLine.moveToBack();
    const numberLine = pointController.numberLines[ 0 ];

    // Update the absolute value representation and associated text. There is no need to unlink this since the elevation
    // point controllers don't come and go.
    Multilink.multilink(
      [ numberLine.showAbsoluteValuesProperty, pointController.positionProperty ],
      showAbsoluteValues => {
        if ( showAbsoluteValues
             && pointController.overElevationAreaProperty.value
             && pointController.isControllingNumberLinePoint() ) {

          // Update the line that goes between the image and sea level.
          absoluteValueLine.shape = new Shape()
            .moveTo( compositeImageNode.x, compositeImageNode.y )
            .lineTo( compositeImageNode.x, seaLevel );

          // Update the visibility of the labels that describe the absolute value in text.
          seaLevelTextVisibleProperty.value = pointValueProperty.value === 0;
          amountAboveTextVisibleProperty.value = pointValueProperty.value > 0;
          amountBelowTextVisibleProperty.value = pointValueProperty.value < 0;

          // Update parent label node's position and visibility.
          distanceLabel.visible = true;
          distanceLabel.leftCenter = compositeImageNode.rightCenter.plus( textOffset );
        }
        else {
          absoluteValueLine.shape = null;
          distanceLabel.visible = false;
        }
      }
    );
  }
}

numberLineIntegers.register( 'ElevationPointControllerNode', ElevationPointControllerNode );
export default ElevationPointControllerNode;
