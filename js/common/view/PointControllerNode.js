// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add, remove, and control points on a number line
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Line = require( 'SCENERY/nodes/Line' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  // constants
  const SPHERE_RADIUS = 10; // in screen coords, radius of sphere that is used if no controller node is provided

  class PointControllerNode extends Node {

    /**
     * @param {PointController} pointController
     * @param {Object} [options]
     */
    constructor( pointController, options ) {

      options = _.extend( {

        // node used for the view representation, a shaded sphere is created if no node is provided
        node: null,

        // controls whether there is a line drawn from this controller to the number line
        connectorLine: true,

        cursor: 'pointer'

      }, options );

      super( options );

      // create and add the line that will connect to the number line point, if present
      const connectorLine = new Line( 0, 0, 0, 0, { stroke: 'gray' } );
      connectorLine.visible = false;
      this.addChild( connectorLine );

      // create and add the shaded sphere
      const node = options.node || new ShadedSphereNode( SPHERE_RADIUS * 2, {
        mainColor: pointController.color
      } );
      this.addChild( node );

      // monitor the point controller and adjust positions to match
      pointController.positionProperty.link( position => {
        node.center = position;

        if ( options.connectorLine && pointController.numberLinePoint ) {
          const pointPosition = pointController.numberLinePoint.getPositionInModelSpace();
          connectorLine.setLine( position.x, position.y, pointPosition.x, pointPosition.y );
          connectorLine.visible = true;
        }
        else {
          connectorLine.visible = false;
        }
      } );

      // pop to the front of the z-order when dragged
      pointController.isDraggingProperty.link( dragging => {
        if ( dragging ) {
          this.moveToFront();
        }
      } );

      // don't allow the point controller node to be grabbed if the point controller is animating somewhere
      pointController.inProgressAnimationProperty.link( inProgressAnimation => {
        this.pickable = inProgressAnimation === null;
      } );

      // drag handler
      this.addInputListener( new DragListener( {
        dragBoundsProperty: new Property( this.layoutBounds ),
        start: event => {
          pointController.isDraggingProperty.set( true );
          pointController.proposePosition( this.globalToParentPoint( event.pointer.point ) );
        },
        drag: event => {
          pointController.proposePosition( this.globalToParentPoint( event.pointer.point ) );
        },
        end: () => {
          pointController.isDraggingProperty.set( false );
        }
      } ) );
    }
  }

  return numberLineIntegers.register( 'PointControllerNode', PointControllerNode );
} );