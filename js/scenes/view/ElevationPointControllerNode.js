// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to control point positions in the "Elevation" scene of the Number Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const amountAboveSeaLevelString = require( 'string!NUMBER_LINE_INTEGERS/amountAboveSeaLevel' );
  const amountBelowSeaLevelString = require( 'string!NUMBER_LINE_INTEGERS/amountBelowSeaLevel' );

  class ElevationPointControllerNode extends PointControllerNode {

    /**
     * @param {ElevationPointController} pointController
     * @param {Image[]} imageList - an array of images used to depict this node
     * @param {number} seaLevel - the y value in view coordinates of the sea level
     * @param {Vector2[]} textOffsets - the offsets for the centerLeft positions of the absolute value texts relative to the image rightCenter
     * @param {Object} [options]
     */
    constructor( pointController, imageList, seaLevel, textOffsets, options ) {

      assert && assert( !options || !options.node, 'options should not include a node for this constructor' );

      // create a node with all the images that will be used to depict this elevatable item
      const compositeImageNode = new Node( { children: imageList } );

      options = _.extend( {

        // pass in the parent node that includes all images as the mode that will control the point
        node: compositeImageNode
      }, options );

      let textOffset;

      // update the visibility of the images as the position changes
      pointController.positionProperty.link( position => {
        const selectedImageIndex = options.imageSelectionFunction( position );
        imageList.forEach( ( image, index ) => {
          image.visible = selectedImageIndex === index;
        } );
        textOffset = textOffsets[ selectedImageIndex ];
      } );

      super( pointController, options );

      // handling of what the point controller does when the absolute value checkbox is checked
      const absoluteValueLine = new Path( null, { stroke: pointController.color, lineWidth: 2 } );
      const distanceText = new Text( '', { font: new PhetFont( 12 ), fill: pointController.color } );
      const distanceTextBackgroundRectangle = new Rectangle( 0, 0, 0, 0, 3, 3, {
          fill: 'white',
          opacity: 0.75
      } );
      this.addChild( absoluteValueLine );
      this.addChild( distanceTextBackgroundRectangle );
      this.addChild( distanceText );
      absoluteValueLine.moveToBack();

      Property.multilink( [ pointController.numberLine.showAbsoluteValuesProperty, pointController.positionProperty ], () => {
        if ( pointController.numberLine.showAbsoluteValuesProperty.value
             && pointController.overElevationAreaProperty.value
             && pointController.numberLinePoint ) {

          absoluteValueLine.shape = new Shape()
            .moveTo( compositeImageNode.x, compositeImageNode.y )
            .lineTo( compositeImageNode.x, seaLevel );

          const value = pointController.numberLinePoint.valueProperty.value;
          distanceText.text = StringUtils.fillIn( value < 0 ? amountBelowSeaLevelString : amountAboveSeaLevelString, {
            value: Math.abs( value )
          } );
          distanceTextBackgroundRectangle.visible = true;
          distanceText.visible = true;

          distanceTextBackgroundRectangle.setRect( 0, 0, distanceText.width + 5, distanceText.height + 5 );
          distanceTextBackgroundRectangle.leftCenter = compositeImageNode.rightCenter.plus( textOffset );
          distanceText.center = distanceTextBackgroundRectangle.center;

        }
        else {
          absoluteValueLine.shape = null;
          distanceTextBackgroundRectangle.visible = false;
          distanceText.visible = false;
        }
      } );
    }
  }

  return numberLineIntegers.register( 'ElevationPointControllerNode', ElevationPointControllerNode );
} );