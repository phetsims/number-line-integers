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

      // set up the node that the user will drag to move this around
      let draggableNode = options.node || new ShadedSphereNode( SPHERE_RADIUS * 2, {
        mainColor: pointController.color
      } );
      this.addChild( draggableNode );

      // account for offset for nodes with (0,0) point not in center
      const draggableNodeXOffset = draggableNode.centerX;
      const draggableNodeYOffset = draggableNode.centerY;

      // monitor the point controller and adjust positions to match
      const handlePointControllerPositionChange = position => {
        if ( options.connectorLine && pointController.numberLinePoint ) {
          if ( pointController.color !== pointController.numberLinePoint.colorProperty.value && options.node === null ) {

            // draggableNode must be removed and readded with new colors
            this.removeChild( draggableNode );
            pointController.color = pointController.numberLinePoint.colorProperty.value;
            draggableNode = new ShadedSphereNode( SPHERE_RADIUS * 2, { mainColor: pointController.color } );
            this.addChild( draggableNode );
          }
          const pointPosition = pointController.numberLinePoint.getPositionInModelSpace();
          connectorLine.setLine( position.x, position.y, pointPosition.x, pointPosition.y );
          connectorLine.visible = true;
        }
        else {
          connectorLine.visible = false;
        }
        const scaleVector = draggableNode.getScaleVector();
        draggableNode.centerX = position.x + ( draggableNodeXOffset * scaleVector.x );
        draggableNode.centerY = position.y + ( draggableNodeYOffset * scaleVector.y );
      };
      pointController.positionProperty.link( handlePointControllerPositionChange );

      const handlePointControllerScaleChange = scale => {
        draggableNode.setScaleMagnitude( scale );
      };
      pointController.scaleProperty.link( handlePointControllerScaleChange );

      // pop to the front of the z-order when dragged
      const dragStateChangeHandler = dragging => {
        if ( dragging ) {
          this.moveToFront();
        }
      };
      pointController.isDraggingProperty.link( dragStateChangeHandler );

      // don't allow the point controller node to be grabbed if the point controller is animating somewhere
      const inProgressAnimationChangedHandler = inProgressAnimation => {
        this.pickable = inProgressAnimation === null;
      };
      pointController.inProgressAnimationProperty.link( inProgressAnimationChangedHandler );

      // drag handler if intended to be dragged
      if ( options.pickable !== false ) {
        this.addInputListener( new DragListener( {
          dragBoundsProperty: new Property( this.layoutBounds ),
          start: event => {
            pointController.isDraggingProperty.value = true;
            pointController.scaleProperty.value = 1.0;
            pointController.proposePosition( this.globalToParentPoint( event.pointer.point ) );
          },
          drag: event => {
            pointController.proposePosition( this.globalToParentPoint( event.pointer.point ) );
          },
          end: () => {
            pointController.isDraggingProperty.value = false;
          }
        } ) );
      }

      this.disposePointControllerNode = () => {
        pointController.positionProperty.unlink( handlePointControllerPositionChange );
        pointController.isDraggingProperty.unlink( dragStateChangeHandler );
        pointController.inProgressAnimationProperty.unlink( inProgressAnimationChangedHandler );
      };
    }

    /**
     * clean up any linkages or other references that could lead to memory leaks
     * @public
     */
    dispose() {
      this.disposePointControllerNode();
      super.dispose();
    }
  }

  return numberLineIntegers.register( 'PointControllerNode', PointControllerNode );
} );