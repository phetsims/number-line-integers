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
  const BackgroundNode = require( 'SCENERY_PHET/BackgroundNode' );
  const merge = require( 'PHET_CORE/merge' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const IMAGE_DILATION = 20;
  const DISTANCE_TEXT_MAX_WIDTH = 250;

  // strings
  const amountAboveSeaLevelString = require( 'string!NUMBER_LINE_INTEGERS/amountAboveSeaLevel' );
  const amountBelowSeaLevelString = require( 'string!NUMBER_LINE_INTEGERS/amountBelowSeaLevel' );
  const seaLevelString = require( 'string!NUMBER_LINE_INTEGERS/seaLevel' );

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

      // dilates each image's touch area
      imageList.forEach( image => { image.touchArea = image.localBounds.dilated( IMAGE_DILATION ); } );

      // create a node with all the images that will be used to depict this elevatable item
      const compositeImageNode = new Node( { children: imageList } );

      options = merge( {

        // pass in the parent node that includes all images as the mode that will control the point
        node: compositeImageNode
      }, options );

      let textOffset;

      // update the visibility of the images as the position changes
      pointController.positionProperty.link( position => {
        const currentlySelectedImageIndex = _.findIndex( imageList, image => image.visible );
        const selectedImageIndex = options.imageSelectionFunction( position, currentlySelectedImageIndex );
        imageList.forEach( ( image, index ) => {
          image.visible = selectedImageIndex === index;
        } );
        textOffset = textOffsets[ selectedImageIndex ];
      } );

      super( pointController, options );

      // handling of what the point controller does when the absolute value checkbox is checked
      const absoluteValueLine = new Path( null, { stroke: pointController.color, lineWidth: 2 } );
      const distanceText = new Text( '', { font: new PhetFont( 18 ), fill: pointController.color, maxWidth: DISTANCE_TEXT_MAX_WIDTH } );
      const distanceLabel = new BackgroundNode( distanceText, NLIConstants.LABEL_BACKGROUND_OPTIONS );
      this.addChild( absoluteValueLine );
      this.addChild( distanceLabel );
      absoluteValueLine.moveToBack();
      const numberLine = pointController.numberLines[ 0 ];

      Property.multilink( [ numberLine.showAbsoluteValuesProperty, pointController.positionProperty ], () => {
        if ( numberLine.showAbsoluteValuesProperty.value
             && pointController.overElevationAreaProperty.value
             && pointController.isControllingNumberLinePoint() ) {

          absoluteValueLine.shape = new Shape()
            .moveTo( compositeImageNode.x, compositeImageNode.y )
            .lineTo( compositeImageNode.x, seaLevel );

          const value = pointController.numberLinePoints[ 0 ].valueProperty.value;
          let seaLevelText = seaLevelString;
          if ( value < 0 ) {
            seaLevelText = StringUtils.fillIn( amountBelowSeaLevelString, { value: Math.abs( value ) } );
          }
          else if ( value > 0 ) {
            seaLevelText = StringUtils.fillIn( amountAboveSeaLevelString, { value: value } );
          }
          distanceText.text = seaLevelText;
          distanceLabel.visible = true;
          distanceLabel.leftCenter = compositeImageNode.rightCenter.plus( textOffset );
        }
        else {
          absoluteValueLine.shape = null;
          distanceLabel.visible = false;
        }
      } );
    }
  }

  return numberLineIntegers.register( 'ElevationPointControllerNode', ElevationPointControllerNode );
} );
