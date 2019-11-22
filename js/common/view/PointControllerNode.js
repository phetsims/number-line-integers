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
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Orientation = require( 'PHET_CORE/Orientation' );
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

      options = merge( {

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

      // Set up the node that the user will drag to move the point controller around.  If a node is not provided by the
      // client, a default node is created.
      this.draggableNode = options.node || new ShadedSphereNode( SPHERE_RADIUS * 2, {
        mainColor: pointController.color
      } );
      this.addChild( this.draggableNode );

      // function to update the visibility of the connector line
      const updateConnectorLineVisibility = () => {
        connectorLine.visible = options.connectorLineVisibleProperty.value && pointController.isControllingNumberLinePoint();
      };

      // handle changes to the point controller position
      const updateAppearanceOnPositionChange = position => {
        if ( options.connectorLine && pointController.isControllingNumberLinePoint() ) {

          // As of this writing (Nov 2019), PointControllerNode only handles drawing connector lines to a single point.
          // It would be possible to handle multiple points, but this has not been needed thus far and is therefor not
          // handled. If you need it, please add it.
          assert && assert( pointController.numberLinePoints.length === 1, 'incorrect number of points controlled' );

          // update the connector line
          const pointPosition = pointController.numberLinePoints[ 0 ].getPositionInModelSpace();
          connectorLine.setLine( position.x, position.y, pointPosition.x, pointPosition.y );
        }
        updateConnectorLineVisibility();
        this.draggableNode.translation = position;
        this.moveToFront(); // make sure that the most recently moved point controller is at the front of the z-order
      };
      pointController.positionProperty.link( updateAppearanceOnPositionChange );

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

      // If the default point controller node is being used, create and hook up the listener that will update touch
      // areas as the orientation changes such that the point controllers can be easily grabbed by a user's finger
      // without covering them up.
      const numberLine = pointController.numberLines[ 0 ];
      let setTouchDilationBasedOnOrientation;
      if ( !options.node ) {
        setTouchDilationBasedOnOrientation = orientation => {
          const nominalBounds = this.draggableNode.localBounds;
          let touchAreaBounds;
          if ( orientation === Orientation.HORIZONTAL ) {
            const dilatedBounds = nominalBounds.dilateXY( SPHERE_RADIUS / 2, SPHERE_RADIUS * 2 );
            touchAreaBounds = dilatedBounds.shiftedY( SPHERE_RADIUS * 1.5 );
          }
          else {
            const dilatedBounds = nominalBounds.dilateXY( SPHERE_RADIUS * 2, SPHERE_RADIUS / 2 );
            touchAreaBounds = dilatedBounds.shiftedX( SPHERE_RADIUS * 1.5 );
          }
          this.draggableNode.setTouchArea( touchAreaBounds );
        };
        numberLine.orientationProperty.link( setTouchDilationBasedOnOrientation );
      }

      this.disposePointControllerNode = () => {
        pointController.positionProperty.unlink( updateAppearanceOnPositionChange );
        pointController.isDraggingProperty.unlink( dragStateChangeHandler );
        pointController.inProgressAnimationProperty.unlink( inProgressAnimationChangedHandler );
        if ( options.connectorLineVisibleProperty.hasListener( updateConnectorLineVisibility ) ) {
          options.connectorLineVisibleProperty.unlink( updateConnectorLineVisibility );
        }
        if ( !options.node ) {
          numberLine.orientationProperty.unlink( setTouchDilationBasedOnOrientation );
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
