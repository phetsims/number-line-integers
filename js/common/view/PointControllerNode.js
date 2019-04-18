// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add, remove, and control points on a number line
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  // constants
  const DEFAULT_SPHERE_RADIUS = 10; // in screen coords, radius of sphere that is used if no controller node is provided

  class PointControllerNode extends Node {

    /**
     * TODO: document when finalized
     */
    constructor( pointController, options ) {

      options = _.extend( {

        // radius in screen coordinates
        radius: DEFAULT_SPHERE_RADIUS,

        cursor: 'pointer'

      }, options );

      super( options );

      this.addChild( new ShadedSphereNode( options.radius * 2, {
        mainColor: pointController.color
      } ) );

      // monitor the point controller and adjust position to match
      pointController.positionProperty.link( position => {
        this.center = position;
      } );

      // drag handler
      this.addInputListener( new DragListener( {
        dragBoundsProperty: new Property( this.layoutBounds ),
        start: event => {
          pointController.draggingProperty.set( true );
          pointController.positionProperty.set( this.globalToParentPoint( event.pointer.point ) );
        },
        drag: event => {
          pointController.positionProperty.set( this.globalToParentPoint( event.pointer.point ) );
        },
        end: () => {
          pointController.draggingProperty.set( false );
        }
      } ) );
    }
  }

  return numberLineIntegers.register( 'PointControllerNode', PointControllerNode );
} );