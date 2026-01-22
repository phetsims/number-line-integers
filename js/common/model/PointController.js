// Copyright 2019-2020, University of Colorado Boulder

/**
 * A PointController is a model element that is used to control points on a number line, but can exist independently
 * too. In some use cases, it will create a point on a number line when it gets within a certain distance of it.  In
 * other use cases, it is permanently locked to a number line and a point that it is controlling.
 *
 * One implication of the fact that point controllers can attach to and detach from number lines is that sometimes,
 * despite the name, an instance can be in a state where it isn't controlling any points.
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
  const LockToNumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/LockToNumberLine' );
  const merge = require( 'PHET_CORE/merge' );
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
     * @param {Object} [options]
     * @public
     */
    constructor( options ) {

      options = merge( {

        // color used when represented in the view
        color: 'black',

        // {number} - offset in model coords from a horizontal number line when controlling a point
        offsetFromHorizontalNumberLine: 50,

        // {number} - offset in model coords from a vertical number line when controlling a point
        offsetFromVerticalNumberLine: 52,

        // {number} - scale of controller node when animated back into box
        scaleInBox: 1.0,

        // {LockToNumberLine} - Controls whether this point controller is, or can, lock to the number line.
        lockToNumberLine: LockToNumberLine.WHEN_CLOSE,

        // {NumberLine[]} - the number lines on which this controller can add points, can be empty if this controller
        // never adds or removes points from the number line
        numberLines: [],

        // {NumberLinePoint[]} - the points on the number line that are currently being controlled, can be empty
        numberLinePoints: [],

        // {boolean} - controls whether movements of the controlled number line point(s) should cause this point
        // controller to also move
        bidirectionalAssociation: true

      }, options );

      // @private
      this.offsetFromHorizontalNumberLine = options.offsetFromHorizontalNumberLine;
      this.offsetFromVerticalNumberLine = options.offsetFromVerticalNumberLine;
      this.pointToValueChangeHandlerMap = new Map();
      this.lockToNumberLine = options.lockToNumberLine;
      this.bidirectionalAssociation = options.bidirectionalAssociation;

      // @public (read-only) {NumberLine[]}
      this.numberLines = options.numberLines;

      // @public (read-only) {Vector2Property} - position of this point in model space
      this.positionProperty = new Vector2Property( Vector2.ZERO, {

        // allowing reentry is necessary because of two-way position relationship with number line points
        reentrant: true
      } );

      // @private - the scale of this point controller when stored away
      this.scaleInBox = options.scaleInBox;

      // @public (read-only) {NumberProperty} - scale of this point
      this.scaleProperty = new NumberProperty( this.scaleInBox );

      // @public {BooleanProperty} - indicates whether this is being dragged by the user
      this.isDraggingProperty = new BooleanProperty( false );

      // @public (read-only) {Animation|null} - tracks any animation that is currently in progress
      this.inProgressAnimationProperty = new Property( null );

      // @public (read-only) {NumberLinePoint[]} - points on the number line that this controls
      this.numberLinePoints = [];

      // add the initial number line points
      options.numberLinePoints.forEach( point => { this.associateWithNumberLinePoint( point ); } );

      // @public (read-only) {Color}
      this.color = options.color;

      // if the displayed range of the number line changes while controlling a point, the position must be updated
      const displayedRangeChangeHandlers = [];
      options.numberLines.forEach( numberLine => {
        const handler = () => {
          const relevantPoint = _.find( this.numberLinePoints, point => point.numberLine === numberLine );
          relevantPoint && this.setPositionRelativeToPoint( relevantPoint );
        };
        displayedRangeChangeHandlers.push( handler );
        numberLine.displayedRangeProperty.lazyLink( handler );
      } );

      assert && assert( displayedRangeChangeHandlers.length === options.numberLines.length );

      // set our number line points to match this point controller's dragging state
      this.isDraggingProperty.link( isDragging => {
        this.numberLinePoints.forEach( point => {
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
     * returns whether this point controller is controlling one or more number line points
     * @returns {boolean}
     * @public
     */
    isControllingNumberLinePoint() {
      return this.numberLinePoints.length > 0;
    }

    /**
     * associate this controller with a point on the number line
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    associateWithNumberLinePoint( numberLinePoint ) {
      this.numberLinePoints.push( numberLinePoint );

      if ( this.bidirectionalAssociation ) {
        const positionUpdater = () => {
          this.setPositionRelativeToPoint( numberLinePoint );
        };
        this.pointToValueChangeHandlerMap.set( numberLinePoint, positionUpdater );
        numberLinePoint.valueProperty.link( positionUpdater );
      }

      // set initial drag state, there is a link elsewhere that will make subsequent updates
      numberLinePoint.isDraggingProperty.value = this.isDraggingProperty.value;

      assert && assert(
        !this.bidirectionalAssociation || this.numberLinePoints.length === this.pointToValueChangeHandlerMap.size,
        'There should be as many associated points as there are pointToValueChangeHandlerMap entries'
      );
      assert && assert(
        this.numberLinePoints.length === _.uniq( this.numberLinePoints.map( point => point.numberLine ) ).length,
        'There shouldn\'t be more than one associated point from the same number line'
      );
    }

    /**
     * Remove the association between this point controller and a number line point.  This does not remove the point
     * from the number line.
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    dissociateFromNumberLinePoint( numberLinePoint ) {

      // verify that the point is being controlled
      assert && assert(
        this.numberLinePoints.indexOf( numberLinePoint ) >= 0,
        'point is not controlled by this point controller'
      );

      // since the point will no longer be controlled, it can't be dragging
      numberLinePoint.isDraggingProperty.value = false;

      // unhook any listeners that were added
      if ( this.bidirectionalAssociation ) {
        const valueChangeHandler = this.pointToValueChangeHandlerMap.get( numberLinePoint );
        assert && assert( valueChangeHandler );
        numberLinePoint.valueProperty.unlink( valueChangeHandler );
        this.pointToValueChangeHandlerMap.delete( numberLinePoint );
      }

      // remove the point from the list of controlled points
      this.numberLinePoints = _.without( this.numberLinePoints, numberLinePoint );
    }

    /**
     * Remove the association between this controller and number line points that it was controlling.  Note that this
     * does NOT remove the points from the number line(s) - there is a different method for that.
     * @public
     */
    clearNumberLinePoints() {
      this.numberLinePoints.forEach( point => {
        this.dissociateFromNumberLinePoint( point );
      } );
    }

    /**
     * remove all controlled points from the number line on which each one resides
     * @public
     */
    removePointsFromNumberLines() {
      this.numberLinePoints.forEach( numberLinePoint => {
        numberLinePoint.numberLine.removePoint( numberLinePoint );
      } );
    }

    /**
     * propose a new position to this point controller, may or may not actually update the position depending on whether
     * a point on the number line is being controlled and how that point moves
     * @param {Vector2} proposedPosition
     * @public
     */
    proposePosition( proposedPosition ) {

      if ( this.isControllingNumberLinePoint() ) {
        this.numberLinePoints.forEach( point => {

          // map the proposed position to a value on the number line
          const proposedNumberLineValue = point.numberLine.modelPositionToValue( proposedPosition );

          if ( this.lockToNumberLine === LockToNumberLine.ALWAYS ) {
            point.proposeValue( proposedNumberLineValue );
          }
          else if ( this.lockToNumberLine === LockToNumberLine.NEVER ) {

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
          else if ( this.lockToNumberLine === LockToNumberLine.WHEN_CLOSE ) {

            // determine whether to propose a new value for the point or to detach and remove the point
            if ( point.numberLine.isWithinPointRemovalDistance( proposedPosition ) ) {
              point.proposeValue( proposedNumberLineValue );
            }
            else {
              point.numberLine.removePoint( point );
              this.dissociateFromNumberLinePoint( point );
            }
          }
        } );
      }
      else {

        assert && assert(
          this.lockToNumberLine !== LockToNumberLine.ALWAYS,
          'should not be in this situation if controller is always locked to a point'
        );

        if ( this.lockToNumberLine === LockToNumberLine.WHEN_CLOSE ) {

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
     * @public
     */
    goToPosition( position, animate = false ) {

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
        if ( this.lockToNumberLine === LockToNumberLine.ALWAYS || this.lockToNumberLine === LockToNumberLine.WHEN_CLOSE ) {
          y = pointPosition.y + this.offsetFromHorizontalNumberLine;
        }
        else {
          y = this.positionProperty.value.y;
        }
      }
      else {
        y = pointPosition.y;
        if ( this.lockToNumberLine === LockToNumberLine.ALWAYS || this.lockToNumberLine === LockToNumberLine.WHEN_CLOSE ) {
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
