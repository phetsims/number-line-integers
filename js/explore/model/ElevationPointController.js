// Copyright 2019, University of Colorado Boulder

/**
 * a point controller with some extensions that are specific to the "Elevation" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const LockToNumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/LockToNumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Utils = require( 'DOT/Utils' );

  class ElevationPointController extends PointController {

    /**
     * @param {NumberLine} numberLine - the number line on which this controller will be moving points
     * @param {Bounds2} elevationAreaBounds
     * @param {Object} [options]
     * @public
     */
    constructor( numberLine, elevationAreaBounds, options ) {

      options = merge( {

        // this style of point controller never locks to the number line
        lockToNumberLine: LockToNumberLine.NEVER,

        numberLines: [ numberLine ]

      }, options );

      super( options );

      // @private {Bounds2}
      this.elevationsAreaBounds = elevationAreaBounds;

      // @public (read-only) property that tracks whether this point controller is in the area where it should be controlling a point
      this.overElevationAreaProperty = new BooleanProperty( false );

      // these point controllers are never disposed, so no unlinking is needed
      this.positionProperty.link( position => {
        this.overElevationAreaProperty.value = elevationAreaBounds.containsPoint( position );
      } );

      // create/remove number line points based on whether we're over the elevation area
      this.overElevationAreaProperty.lazyLink( over => {
        if ( over && this.isDraggingProperty.value ) {

          // state checking
          assert && assert( !this.isControllingNumberLinePoint(), 'should not already have a point' );

          // create a new point on the number line
          const numberLinePoint = new NumberLinePoint(
            Utils.roundSymmetric( numberLine.modelPositionToValue( this.positionProperty.value ) ),
            this.color,
            numberLine,
            this
          );
          numberLine.addPoint( numberLinePoint );
          this.associateWithNumberLinePoint( numberLinePoint );
        }
        else if ( !over && this.isControllingNumberLinePoint() ) {

          // remove our point(s) from the number line and disassociate from them
          this.removePointsFromNumberLines();
          this.clearNumberLinePoints();
        }
      } );
    }

    /**
     * do essentially what the base class does, but then allow any X direction motion
     * @param {Vector2} proposedPosition
     * @override - see base class for more information
     * @public
     */
    proposePosition( proposedPosition ) {

      if ( this.isControllingNumberLinePoint() && !this.elevationsAreaBounds.containsPoint( proposedPosition ) ) {

        // The user has dragged the controller outside of the elevation bounds, so allow the motion.  Listeners in
        // other places will remove the point from the number line.
        this.positionProperty.value = proposedPosition;
      }
      else {
        super.proposePosition( proposedPosition );
      }
    }
  }


  return numberLineIntegers.register( 'ElevationPointController', ElevationPointController );
} );
