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
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
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

      // @private
      this.offsetFromHorizontalNumberLine = options.offsetFromHorizontalNumberLine;
      this.offsetFromVerticalNumberLine = options.offsetFromVerticalNumberLine;
      this.numberLine = numberLine;
      this.pointValueChangeHandler = null;
    }

    /**
     * associate this controller with a point on the number line
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    associateWithNumberLinePoint( numberLinePoint ) {
      this.numberLinePoint = numberLinePoint;
      this.pointValueChangeHandler = () => {
        const currentPointPosition = this.numberLinePoint.getPositionInModelSpace();
        this.setPositionRelativeToPoint( currentPointPosition );
      };
      numberLinePoint.valueProperty.link( this.pointValueChangeHandler );
    }

    /**
     * remove the association between this controller and the point on the number line that it was controlling
     * @public
     */
    clearNumberLinePoint() {
      if ( this.pointValueChangeHandler ) {
        this.numberLinePoint.valueProperty.unlink( this.pointValueChangeHandler );
        this.pointValueChangeHandler = null;
      }
      this.numberLinePoint = null;
    }

    /**
     * propose a new position to this point controller, may or may not actually update the position depending on whether
     * a point on the number line is being controlled and how that point moves
     * @param {Vector2} proposedPosition
     * @public
     */
    proposePosition( proposedPosition ) {

      // mapped the proposed position to a value on the number line
      const proposedNumberLineValue = this.numberLine.modelPositionToValue( proposedPosition );

      if ( this.numberLinePoint ) {

        // determine whether to propose a new value for the point or to detach and remove the point
        if ( this.numberLine.withinPointRemovalDistance( proposedPosition ) &&
             this.numberLine.displayedRangeProperty.value.contains( proposedNumberLineValue ) ) {
          this.numberLinePoint.proposeValue( proposedNumberLineValue );
        }
        else {
          this.numberLine.removePoint( this.numberLinePoint );
          this.clearNumberLinePoint();
        }
      }
      else {

        // check if a point should be created and added based on the proposed position
        if ( this.numberLine.withinPointCreationDistance( proposedPosition ) &&
             this.numberLine.displayedRangeProperty.value.contains( proposedNumberLineValue ) ) {
          const numberLinePoint = new NumberLinePoint( proposedNumberLineValue, this.color, this.numberLine, this );
          this.numberLine.addPoint( numberLinePoint );
          this.associateWithNumberLinePoint( numberLinePoint );
        }
        else {

          // just accept the proposed position, no other action is necessary
          this.positionProperty.set( proposedPosition );
        }
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