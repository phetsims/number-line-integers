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
  const Animation = require( 'TWIXT/Animation' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Easing = require( 'TWIXT/Easing' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // const
  const AVERAGE_ANIMATION_SPEED = 1000; // screen coordinates per second
  const MIN_ANIMATION_TIME = 0.3; // in seconds

  class PointController {

    /**
     * {Vector2} initialPosition
     * {NumberLine} numberLine - the number line on which this controller will be moving points
     */
    constructor( numberLine, options ) {

      options = _.extend( {

        // color used when represented in the view
        color: 'black',

        // {number} - offset in model coords from a horizontal number line when controlling a point
        offsetFromHorizontalNumberLine: 50,

        // {number} - offset in model coords from a vertical number line when controlling a point
        offsetFromVerticalNumberLine: 52,

        // {string} - Controls whether this point controller is, or can, lock to the number line.  Valid values
        // are 'always', 'never', and 'whenClose'.
        lockToNumberLine: 'whenClose'
      }, options );

      // @public (read-only) {Vector2Property} - position of this point in model space
      this.positionProperty = new Vector2Property( Vector2.ZERO );

      // @public {BooleanProperty} - indicates whether this is being dragged by the user
      this.isDraggingProperty = new BooleanProperty( false );

      // @public (read-only) {Animation|null} - tracks any animation that is currently in progress
      this.inProgressAnimationProperty = new Property( null );

      // @public (read-only) {NumberLinePoint|null} - point on the number line being controlled, null if none
      this.numberLinePoint = null;

      // &public (read-only) {Color}
      this.color = options.color;

      // if the displayed range of the number line changes while controlling a point, the position must be updated
      numberLine.displayedRangeProperty.lazyLink( () => {
        if ( this.numberLinePoint ) {
          this.setPositionRelativeToPoint( this.numberLinePoint.getPositionInModelSpace() );
        }
      } );

      // @private
      this.offsetFromHorizontalNumberLine = options.offsetFromHorizontalNumberLine;
      this.offsetFromVerticalNumberLine = options.offsetFromVerticalNumberLine;
      this.numberLine = numberLine;
      this.pointValueChangeHandler = null;
      this.lockToNumberLine = options.lockToNumberLine;

      // set our point to match point controller's dragging state
      this.isDraggingProperty.link( isDragging => {
        if ( this.numberLinePoint ) {
          this.numberLinePoint.isDraggingProperty.value = isDragging;
        }
      } );
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
      numberLinePoint.isDraggingProperty.value = this.isDraggingProperty.value;
    }

    /**
     * remove the association between this controller and the point on the number line that it was controlling
     * @public
     */
    clearNumberLinePoint() {
      if ( this.numberLinePoint ) {
        this.numberLinePoint.isDraggingProperty.value = false;
        if ( this.pointValueChangeHandler ) {
          this.numberLinePoint.valueProperty.unlink( this.pointValueChangeHandler );
          this.pointValueChangeHandler = null;
        }
        this.numberLinePoint = null;
      }
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
        if ( this.numberLine.isWithinPointRemovalDistance( proposedPosition ) ) {
          this.numberLinePoint.proposeValue( proposedNumberLineValue );
        }
        else {
          this.numberLine.removePoint( this.numberLinePoint );
          this.clearNumberLinePoint();
        }
      }
      else {
        const constrainedValue = this.numberLine.getConstrainedValue( proposedNumberLineValue );

        // check if a point should be created and added based on the proposed position
        if ( this.numberLine.isWithinPointCreationDistance( proposedPosition ) ) {
          const numberLinePoint = new NumberLinePoint( constrainedValue, this.color, this.numberLine, this );
          this.numberLine.addPoint( numberLinePoint );
          this.associateWithNumberLinePoint( numberLinePoint );
        }
        else {

          // just accept the proposed position, no other action is necessary
          this.goToPosition( proposedPosition );
        }
      }
    }

    /**
     * go to the specified position, either immediately or via an animation
     * @param {Vector2} position
     * @param {boolean} [animate]
     */
    goToPosition( position, animate = false ) {

      // TODO: I (jbphet) want to know if the position is ever being set when an animation is in progress, because the
      // design intent is that it shouldn't happen, so this logs a warning.  This should be removed before  publication.
      if ( this.inProgressAnimationProperty.value ) {
        console.warn( 'cancelling in-progress animation for point controller' );
      }

      // if there is an active animation, stop it
      this.stopAnimation();

      if ( animate ) {

        // animate the point controller's return to its home position
        const animation = new Animation( {
          duration: Math.max(
            MIN_ANIMATION_TIME,
            this.positionProperty.value.distance( position ) / AVERAGE_ANIMATION_SPEED
          ),
          targets: [ {
            property: this.positionProperty,
            easing: Easing.CUBIC_IN_OUT,
            to: position
          } ]
        } );
        this.inProgressAnimationProperty.set( animation );
        animation.start();

        // remove the animation from the list when it finishes or is stopped
        animation.finishEmitter.addListener( () => {
          this.inProgressAnimationProperty.set( null );
        } );
        animation.stopEmitter.addListener( () => {
          this.inProgressAnimationProperty.set( null );
        } );
      }
      else {

        // go straight to the specified position
        this.positionProperty.set( position );
      }
    }

    /**
     * given a number line point's position in model space, set this point controller to that value, but offset from the
     * number line
     * @param {Vector2} pointPosition
     * @public
     */
    setPositionRelativeToPoint( pointPosition ) {
      if ( this.numberLine.isHorizontal ) {
        this.goToPosition( new Vector2( pointPosition.x, pointPosition.y + this.offsetFromHorizontalNumberLine ) );
      }
      else {
        this.goToPosition( new Vector2( pointPosition.x + this.offsetFromVerticalNumberLine, pointPosition.y ) );
      }
    }

    /**
     * stop the current animation if one is happening, do nothing if not
     * @public
     */
    stopAnimation() {
      if ( this.inProgressAnimationProperty.value ) {
        this.inProgressAnimationProperty.value.stop();
        this.inProgressAnimationProperty.set( null );
      }
    }

    /**
     * restore initial state
     * @public
     */
    reset() {
      this.clearNumberLinePoint();
      this.stopAnimation();
      this.positionProperty.reset();
    }
  }

  return numberLineIntegers.register( 'PointController', PointController );
} );