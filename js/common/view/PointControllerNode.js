// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add, remove, and control points on a number line
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  // constants
  const DEFAULT_SPHERE_RADIUS = 7.5; // in screen coords, radius of sphere that is used if no controller node is provided

  class PointControllerNode extends Node {

    /**
     * TODO: document when finalized
     */
    constructor( options ) {

      options = _.extend( {

        // radius in screen coordinates
        radius: DEFAULT_SPHERE_RADIUS,

        // base color from which the other colors with be derived
        baseColor: new Color( 'pink' ),

        cursor: 'pointer'

      }, options );

      super( options );

      this.addChild( new ShadedSphereNode( options.radius * 2, {
        mainColor: options.baseColor
      } ) );

      // allow dragging of the points
      this.addInputListener( new DragListener( {
        translateNode: true,
        dragBoundsProperty: new Property( this.layoutBounds )
      } ) );
    }
  }

  return numberLineIntegers.register( 'PointControllerNode', PointControllerNode );
} );