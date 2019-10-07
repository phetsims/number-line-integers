// Copyright 2019, University of Colorado Boulder

/**
 * A point controller is a model element that is used to control points on a number line, but can exist independently
 * too. It can be locked to a number line, or can be set such that it can be dragged away, thus removing the associated
 * number line point from the number line.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Easing = require( 'TWIXT/Easing' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // const
  const AVERAGE_ANIMATION_SPEED = 1000; // screen coordinates per second
  const MIN_ANIMATION_TIME = 0.3; // in seconds

  class PointController {

    /**
     * TODO: constructor changed: update all new PointController calls
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {

        // color used when represented in the view
        color: 'black',

        // {number} - offset in model coords from a horizontal number line when controlling a point
        offsetFromHorizontalNumberLine: 50,

        // {number} - offset in model coords from a vertical number line when controlling a point
        offsetFromVerticalNumberLine: 52,

        // {number} - scale of controller node when animated back into box
        scaleInBox: 1.0,

        // {string} - Controls whether this point controller is, or can, lock to the number line.  Valid values
        // are 'always', 'never', and 'whenClose'.
        lockToNumberLine: 'whenClose',

        // {NumberLine[]}  the number lines on which this controller can add NumberLinePoints
        numberLines: [],

        // {NumberLinePoint[]} - the points on the number line that will be controlled
        controlledNumberLinePoints: [],

        // {NumberLinePoint[]} - the points on the number line that will be controlled and that can control this
        associatedNumberLinePoints: []
      }, options );

      //TODO: below is temoprary
      assert && assert(options.numberLinePoints === undefined);

      // @private
      this.offsetFromHorizontalNumberLine = options.offsetFromHorizontalNumberLine;
      this.offsetFromVerticalNumberLine = options.offsetFromVerticalNumberLine;
      this.numberLines = options.numberLines;
      this.pointValueChangeHandlers = []; // only relevant for associated number line points
      this.lockToNumberLine = options.lockToNumberLine;

      // @public (read-only) {Vector2Property} - position of this point in model space
      this.positionProperty = new Vector2Property( Vector2.ZERO, {

        // allowing reentry is necessary because of two-way position relationship with number line points
        reentrant: true
      } );

      this.scaleInBox = options.scaleInBox;

      // @public (read-only) {NumberProperty} - scale of this point
      this.scaleProperty = new NumberProperty( this.scaleInBox );

      // @public {BooleanProperty} - indicates whether this is being dragged by the user
      this.isDraggingProperty = new BooleanProperty( false );

      // @public (read-only) {Animation|null} - tracks any animation that is currently in progress
      this.inProgressAnimationProperty = new Property( null );

      // @public (read-only) {NumberLinePoint[]} - points on the number line being controlled
      this.controlledNumberLinePoints = [];

      // @public (read-only) {NumberLinePoint[]} - points on the number line that this controls and that controls this
      this.associatedNumberLinePoints = [];

      options.controlledNumberLinePoints.forEach( point => { this.controlNumberLinePoint( point ); } );
      options.associatedNumberLinePoints.forEach( point => { this.associateWithNumberLinePoint( point ); } );

      // &public (read-only) {Color}
      this.color = options.color;

      // if the displayed range of the number line changes while controlling a point, the position must be updated
      const displayedRangeChangeHandlers = [];
      options.numberLines.forEach( numberLine => {
        const handler = () => {
          const relevantPoint = _.find( this.associatedNumberLinePoints, point => point.numberLine === numberLine );
          relevantPoint && this.setPositionRelativeToPoint( relevantPoint );
        };
        displayedRangeChangeHandlers.push( handler );
        numberLine.displayedRangeProperty.lazyLink( handler );
      } );

      assert && assert( displayedRangeChangeHandlers.length === options.numberLines.length );

      // set our point to match point controller's dragging state
      this.isDraggingProperty.link( isDragging => {
        this.controlledNumberLinePoints.concat( this.associatedNumberLinePoints ).forEach( point => {
          point.isDraggingProperty.value = isDragging;
        } );
      } );

      // @private
      this.disposePointController = () => {
        options.numberLines.forEach( ( numberLine, i ) => {
          numberLine.displayedRangeProperty.unlink( displayedRangeChangeHandlers[ i ] );
        } );
      };
    }

    /**
     * clean up any linkages or other associations that could cause memory leaks
     * @public
     */
    dispose() {
      this.disposePointController();
    }

    /**
     * returns whether this point controller controls a number line point or is even associated with a number line point
     * @returns {boolean}
     * @public
     */
    controlsNumberLinePoint() {
      return this.associatedNumberLinePoints.length !== 0 || this.controlledNumberLinePoints.length !== 0;
    }

    /**
     * allows the point controller to update and control the given number line point
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    controlNumberLinePoint( numberLinePoint ) {
      this.controlledNumberLinePoints.push( numberLinePoint );
      numberLinePoint.isDraggingProperty.value = this.isDraggingProperty.value;

      assert && assert(
        !_.some( this.controlledNumberLinePoints, point => _.includes( this.associatedNumberLinePoints, point ) ),
        'A number line point shouldn\'t both be controlled and associated'
      );
    }

    /**
     * associate this controller with a point on the number line
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    associateWithNumberLinePoint( numberLinePoint ) {
      this.associatedNumberLinePoints.push( numberLinePoint );
      const handler = () => {
        this.setPositionRelativeToPoint( numberLinePoint );
      };
      this.pointValueChangeHandlers.push( handler );
      numberLinePoint.valueProperty.link( handler );
      numberLinePoint.isDraggingProperty.value = this.isDraggingProperty.value;

      assert && assert(
        this.associatedNumberLinePoints.length === this.pointValueChangeHandlers.length,
        'There should be as many associated points as there are pointValueChangeHandlers'
      );
      assert && assert(
        this.associatedNumberLinePoints.length === _.uniq( this.associatedNumberLinePoints.map( point => point.numberLine ) ).length,
        'There shouldn\'t be more than one associated point from the same number line'
      );
      assert && assert(
        !_.some( this.controlledNumberLinePoints, point => _.includes( this.associatedNumberLinePoints, point ) ),
        'A number line point shouldn\'t both be controlled and associated'
      );
    }

    /**
     * remove the association between this controller and the point on the number line that it was controlling
     * @public
     */
    clearNumberLinePoints() {
      this.controlledNumberLinePoints.forEach( point => {
        point.isDraggingProperty.value = false;
      } );
      this.associatedNumberLinePoints.forEach( ( point, i ) => {
        point.isDraggingProperty.value = false;
        point.valueProperty.unlink( this.pointValueChangeHandlers[ i ] );
      } );
      this.controlledNumberLinePoints = [];
      this.associatedNumberLinePoints = [];
      this.pointValueChangeHandlers = [];
    }

    /**
     * TODO: this was refactored badly: look into this and redo
     *
     * propose a new position to this point controller, may or may not actually update the position depending on whether
     * a point on the number line is being controlled and how that point moves
     * @param {Vector2} proposedPosition
     * @public
     */
    proposePosition( proposedPosition ) {

      if ( this.controlsNumberLinePoint() ) {
        this.controlledNumberLinePoints.concat( this.associatedNumberLinePoints ).forEach( point => {

          // mapped the proposed position to a value on the number line
          const proposedNumberLineValue = point.numberLine.modelPositionToValue( proposedPosition );

          if ( this.lockToNumberLine === 'always' ) {
            point.proposeValue( proposedNumberLineValue );
          }
          else if ( this.lockToNumberLine === 'never' ) {

            // this will update the number line point and move it in the orientation of the number line
            point.proposeValue( proposedNumberLineValue );

            // move the point controller in the direction perpendicular to the number line
            if ( point.numberLine.isHorizontal ) {
              this.positionProperty.value = new Vector2( this.positionProperty.value.x, proposedPosition.y );
            }
            else {
              this.positionProperty.value = new Vector2( proposedPosition.x, this.positionProperty.value.y );
            }
          }
          else if ( this.lockToNumberLine === 'whenClose' ) {

            // determine whether to propose a new value for the point or to detach and remove the point
            if ( point.numberLine.isWithinPointRemovalDistance( proposedPosition ) ) {
              point.proposeValue( proposedNumberLineValue );
            }
            else {
              point.numberLine.removePoint( point );
              this.clearNumberLinePoints(); // TODO: should just remove point, not all points
            }
          }
        } );
      }
      else {

        assert && assert(
          this.lockToNumberLine !== 'always',
          'should not be in this situation if controller is always locked to a point'
        );

        if ( this.lockToNumberLine === 'whenClose' ) {

          // check if a point should be created and added based on the proposed position
          const numberLinesInRange = this.numberLines.filter( numberLine => numberLine.isWithinPointCreationDistance( proposedPosition ) );

          const constrainedValues = numberLinesInRange.map(
            numberLine => numberLine.getConstrainedValue( numberLine.modelPositionToValue( proposedPosition ) )
          );
          if ( numberLinesInRange.length > 0 ) {
            numberLinesInRange.forEach( ( numberLine, i ) => {
              const numberLinePoint = new NumberLinePoint( constrainedValues[ i ], this.color, numberLine, this );
              numberLine.addPoint( numberLinePoint );
              this.associateWithNumberLinePoint( numberLinePoint );
            } );
          }
          else {

            // just accept the proposed position, no other action is necessary
            this.goToPosition( proposedPosition );
          }
        }
        else {

          // no restraint is needed, be free and go wherever you want
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
          targets: [

            // scale
            {
              to: this.scaleInBox,
              property: this.scaleProperty,
              easing: Easing.CUBIC_IN_OUT
            },

            // position
            {
              property: this.positionProperty,
              easing: Easing.CUBIC_IN_OUT,
              to: position
            } ]
        } );
        this.inProgressAnimationProperty.value = animation;
        animation.start();

        // remove the animation from the list when it finishes or is stopped
        animation.finishEmitter.addListener( () => {
          this.inProgressAnimationProperty.value = null;
        } );
        animation.stopEmitter.addListener( () => {
          this.inProgressAnimationProperty.value = null;
        } );
      }
      else {

        // go straight to the specified position
        this.positionProperty.value = position;
      }
    }

    /**
     * given a number line point's position in model space, set this point controller to that value, but offset from the
     * number line
     * @param {NumberLinePoint} point
     * @public
     */
    setPositionRelativeToPoint( point ) {
      const pointPosition = point.getPositionInModelSpace();
      let x;
      let y;
      if ( point.numberLine.isHorizontal ) {
        x = pointPosition.x;
        if ( this.lockToNumberLine === 'always' || this.lockToNumberLine === 'whenClose' ) {
          y = pointPosition.y + this.offsetFromHorizontalNumberLine;
        }
        else {
          y = this.positionProperty.value.y;
        }
      }
      else {
        y = pointPosition.y;
        if ( this.lockToNumberLine === 'always' || this.lockToNumberLine === 'whenClose' ) {
          x = pointPosition.x + this.offsetFromVerticalNumberLine;
        }
        else {
          x = this.positionProperty.value.x;
        }
      }
      this.goToPosition( new Vector2( x, y ) );
    }

    /**
     * stop the current animation if one is happening, do nothing if not
     * @public
     */
    stopAnimation() {
      if ( this.inProgressAnimationProperty.value ) {
        this.inProgressAnimationProperty.value.stop();
        this.inProgressAnimationProperty.value = null;
      }
    }

    /**
     * restore initial state
     * @public
     */
    reset() {
      this.clearNumberLinePoints();
      this.stopAnimation();
      this.positionProperty.reset();
      this.scaleProperty.reset();
    }
  }

  return numberLineIntegers.register( 'PointController', PointController );
} );
