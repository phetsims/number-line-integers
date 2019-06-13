// Copyright 2019, University of Colorado Boulder

/**
 * a point controller with some extensions that are specific to the "Elevation" scene
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );

  class ElevationPointController extends PointController {

    /**
     * {Vector2} initialPosition
     * {Bounds2} elevationAreaBounds
     * {NumberLine} numberLine - the number line on which this controller will be moving points
     */
    constructor( numberLine, elevationAreaBounds, options ) {

      options = _.extend( {

        // this style of point controller never locks to the number line
        lockToNumberLine: 'never'

      }, options );

      super( numberLine, options );

      // @private {Bounds2}
      this.elevationsAreaBounds = elevationAreaBounds;

      // local property that tracks whether this point controller is in the area where it should be controlling a point
      const overElevationAreaProperty = new BooleanProperty( false );

      // as of this writing, these point controllers are never disposed, so no unlinking is needed
      this.positionProperty.link( position => {
        overElevationAreaProperty.set( elevationAreaBounds.containsPoint( position ) );
      } );

      // create/remove number line points based on whether we're over the elevation area
      overElevationAreaProperty.lazyLink( over => {
        if ( over && this.isDraggingProperty.value ) {

          // state checking
          assert( !this.numberLinePoint, 'should not already have a point' );

          // create a new point on the number line
          const numberLinePoint = new NumberLinePoint(
            this.numberLine.modelPositionToValue( this.positionProperty.value ),
            this.color,
            this.numberLine,
            this
          );
          this.numberLine.addPoint( numberLinePoint );
          this.associateWithNumberLinePoint( numberLinePoint );
        }
        else if ( !over && this.numberLinePoint ) {

          // remove our point from the number line
          this.numberLine.removePoint( this.numberLinePoint );
          this.clearNumberLinePoint();
        }

      } );
    }

    /**
     * do essentially what the base class does, but then allow any X direction motion
     * @param {Vector2} proposedPosition
     * @override - see base class for more information
     */
    proposePosition( proposedPosition ) {

      if ( this.numberLinePoint && !this.elevationsAreaBounds.containsPoint( proposedPosition ) ) {

        // The user has dragged the controller outside of the elevation bounds, so allow the motion.  Listeners in
        // other places will remove the point from the number line.
        this.positionProperty.set( proposedPosition );
      }
      else {
        super.proposePosition( proposedPosition );
      }
    }
  }


  return numberLineIntegers.register( 'ElevationPointController', ElevationPointController );
} );