// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to control point positions in the "Elevation" scene of the Number Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );

  class ElevationPointControllerNode extends PointControllerNode {

    /**
     * @param {PointController} pointController
     * @param {Image[]} imageList - an array of images used to depict this node
     * @param {Object} [options]
     */
    constructor( pointController, imageList, options ) {

      assert && assert( !options || !options.node, 'options should not include a node for this constructor' );

      // create a node with all the images that will be used to depict this elevatable item
      const compositeImageNode = new Node( { children: imageList } );

      options = _.extend( {

        // pass in the parent node that includes all images as the mode that will control the point
        node: compositeImageNode,

        // function to select the currently active image
        imageSelectionFunction: () => 0
      }, options );

      // update the visibility of the images as the position changes
      pointController.positionProperty.link( position => {
        const selectedImageIndex = options.imageSelectionFunction( position );
        imageList.forEach( ( image, index ) => {
          image.visible = selectedImageIndex === index;
        } );
      } );

      super( pointController, options );
    }
  }

  return numberLineIntegers.register( 'ElevationPointControllerNode', ElevationPointControllerNode );
} );