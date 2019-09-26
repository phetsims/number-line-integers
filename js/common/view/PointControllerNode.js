// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add, remove, and control points on a number line
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Line = require( 'SCENERY/nodes/Line' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  // constants
  const SPHERE_RADIUS = 10; // in screen coords, radius of sphere that is used if no controller node is provided
  const ALWAYS_TRUE_PROPERTY = new BooleanProperty( true );

  class PointControllerNode extends Node {

    /**
     * @param {PointController} pointController
     * @param {Object} [options]
     */
    constructor( pointController, options ) {

      options = _.extend( {

        // The node used for the view representation.  It's X and Y position will be set based on the position of the
        // corresponding point controller, so it should be set up with the appropriate offset bounds.  A shaded sphere
        // is created if no node is provided.
        node: null,

        // controls whether there is a line drawn from this controller to the number line
        connectorLine: true,

        // if the connector line is present, a property can optionally be provided to control its visibility
        connectorLineVisibleProperty: ALWAYS_TRUE_PROPERTY,

        cursor: 'pointer'

      }, options );

      super( options );

      // create and add the line that will connect to the number line point
      const connectorLine = new Line( 0, 0, 0, 0, { stroke: 'gray' } );
      connectorLine.visible = false;
      this.addChild( connectorLine );

      // set up the node that the user will drag to move the point controller around
      this.draggableNode = options.node || new ShadedSphereNode( SPHERE_RADIUS * 2, {
        mainColor: pointController.color
      } );
      this.addChild( this.draggableNode );

      // function to update the visibility of the connector line
      const updateConnectorLineVisibility = () => {
        connectorLine.visible = options.connectorLineVisibleProperty.value && !!pointController.numberLinePoint;
      };

      // handle changes to the point controller position
      const handlePointControllerPositionChange = position => {
        if ( options.connectorLine && pointController.numberLinePoint ) {
          const pointPosition = pointController.numberLinePoint.getPositionInModelSpace();
          connectorLine.setLine( position.x, position.y, pointPosition.x, pointPosition.y );
        }
        updateConnectorLineVisibility();
        this.draggableNode.translation = position;
      };
      pointController.positionProperty.link( handlePointControllerPositionChange );

      if ( options.connectorLineVisibleProperty !== ALWAYS_TRUE_PROPERTY ) {
        assert && assert( options.connectorLine, 'must have connector line turned on for the viz property to make sense' );
        options.connectorLineVisibleProperty.link( updateConnectorLineVisibility );
      }

      const handlePointControllerScaleChange = scale => {
        this.draggableNode.setScaleMagnitude( scale );
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
        let pointOffset;
        this.addInputListener( new DragListener( {
          dragBoundsProperty: new Property( this.layoutBounds ),
          start: event => {
            pointController.isDraggingProperty.value = true;
            const point = this.draggableNode.globalToParentPoint( event.pointer.point ); // pointer in parent frame
            const relativePoint = point.minus( this.draggableNode ); // pointer in local frame
            const startingOffset = relativePoint
              .dividedScalar( pointController.scaleProperty.value )
              .minus( relativePoint ); // if node has a scale, find offset of node after it is set to 1.0 scale
            pointController.scaleProperty.value = 1.0;
            pointController.proposePosition(
              this.draggableNode.translation.minus( startingOffset ) // if node had scale, move node back to where pointer clicked
            );
            pointOffset = point.minus( this.draggableNode );
          },
          drag: event => {
            pointController.isDraggingProperty.value = true; // necessary in case isDraggingProperty is changed while dragging
            const parentPoint = this.globalToParentPoint( event.pointer.point );
            pointController.proposePosition( parentPoint.minus( pointOffset ) );
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
        if ( options.connectorLineVisibleProperty.hasListener( updateConnectorLineVisibility ) ) {
          options.connectorLineVisibleProperty.unlink( updateConnectorLineVisibility );
        }
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