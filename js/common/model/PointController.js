// Copyright 2019, University of Colorado Boulder

/**
 * A point controller is a model element that is used to control points on a number line, but can exist independently
 * too.  It can be locked to a number line, or can be set such that it can be dragged away, thus removing the associated
 * number line point from the number line.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class PointController {

    /**
     * {Vector2} initialPosition
     * {NumberLine} numberLine - the number line on which this controller will be moving points
     */
    constructor( initialPosition, numberLine, options ) {

      options = _.extend( {

        // color used when represented in the view
        color: 'black',

        // {Vector2} - a "second home" for the point controller, used when the number lines with which it interacts can
        // be in multiple orientations
        alternativeHome: null,

        // {number} - offset in model coords from a horizontal number line
        offsetFromHorizontalNumberLine: 50,

        // {number} - offset in model coords from a vertical number line
        offsetFromVerticalNumberLine: 52
      }, options );

      // @public (read-only) {Vector2Property} - position of this point in model space
      this.positionProperty = new Vector2Property( initialPosition );

      // @public {BooleanProperty} - indicates whether this is being dragged by the user
      this.draggingProperty = new BooleanProperty( false );

      // @public (read-only) {Vector2}
      this.alternativeHome = options.alternativeHome;

      // @public (read-only) {NumberLinePoint|null} - point on the number line being controlled, null if no point
      this.numberLinePoint = null;

      // &public (read-only) {Color}
      this.color = options.color;

      // when moved, update the number line point position (if we have one)
      this.positionProperty.link( position => {
        if ( this.numberLinePoint ) {
          this.numberLinePoint.valueProperty.set( numberLine.modelPositionToValue( position ) );
        }
      } );

      // @private
      this.offsetFromHorizontalNumberLine = options.offsetFromHorizontalNumberLine;
      this.offsetFromVerticalNumberLine = options.offsetFromVerticalNumberLine;
      this.numberLine = numberLine;
    }

    /**
     * associate this controller with a point on the number line
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    associateWithNumberLinePoint( numberLinePoint ) {
      this.numberLinePoint = numberLinePoint;
    }

    /**
     * remove the association between this controller and the point on the number line that it was controlling
     * @public
     */
    clearNumberLinePoint() {
      this.numberLinePoint = null;
    }

    /**
     * propose a new position to this point controller, may or may not actually update the position depending on whether
     * a point on the number line is being controlled and how that point moves
     * @param {Vector2} proposedPosition
     * @public
     */
    proposePosition( proposedPosition ) {
      if ( this.numberLinePoint && this.numberLine.withinPointCreationDistance( proposedPosition ) ) {

        this.numberLinePoint.proposeValue( this.numberLine.modelPositionToValue( proposedPosition ) );
        const currentPointPosition = this.numberLinePoint.getPositionInModelSpace();

        // this point controller is currently controlling a point, so its motion is somewhat constrained
        this.setPositionRelativeToPoint( currentPointPosition );
      }
      else {

        // no point is being controlled, so the proposed position is always acccepted
        this.positionProperty.set( proposedPosition );
      }
    }

    /**
     * given a number line point's position in model space, set this point controller to that value, but offset from the
     * number line
     * @param {Vector2} pointPosition
     * @public
     */
    setPositionRelativeToPoint( pointPosition ) {
      if ( this.numberLine.isHorizontal() ) {
        this.positionProperty.set( new Vector2( pointPosition.x, pointPosition.y + this.offsetFromHorizontalNumberLine ) );
      }
      else {
        this.positionProperty.set( new Vector2( pointPosition.x + this.offsetFromVerticalNumberLine, pointPosition.y ) );
      }
    }

    /**
     * reset to initial state
     * @public
     */
    reset() {
      this.clearNumberLinePoint();
      this.positionProperty.reset();
    }

    /**
     * set this point to its alternative home position
     * @public
     */
    goToAlternativeHome() {
      assert && assert( this.alternativeHome, 'no alternative home set' );
      this.positionProperty.set( this.alternativeHome );
    }
  }

  return numberLineIntegers.register( 'PointController', PointController );
} );