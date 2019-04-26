// Copyright 2019, University of Colorado Boulder

/**
 * Model of a number line.  This is (perhaps rather obviously) a very central class for the Number Line suite of
 * simulations.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const POINT_CREATION_DISTANCE = 60; // distance from number line in model/view coords where points get created
  const POINT_REMOVAL_DISTANCE = 90; // distance from number line in model/view coords where points get removed

  class NumberLine {

    /**
     * {Vector2} centerPosition - the location in model space of the zero point on the number line
     */
    constructor( centerPosition, options ) {

      options = _.extend( {

        // {string} - whether the number line is initially oriented in the horizontal or vertical direction
        initialOrientation: NumberLineOrientation.HORIZONTAL,

        // {Range} - range of values to be displayed
        initialDisplayedRange: new Range( -10, 10 ),

        // {boolean} - whether tick marks should be initially displayed
        tickMarksInitiallyDisplayed: false,

        // {number} - initial spacing between tick marks
        initialTickMarkSpacing: 1,

        // {boolean} - whether point labels should initially be shown
        pointLabelsInitiallyShown: false,

        // {Bounds2|null} - the model bounds over which this number line's full range will be displayed, must be set if
        // the methods that transform between model space and number line positions are to be employed
        modelProjectionBounds: null,

        // {Object{ initialValue, color}[]} - array of point specifications that describe what points should exist on
        // the number line when constructed and after a reset
        initialPointSpecs: []
      }, options );

      // @public (read-only) {Vector2} - center in model space where this number line exists
      this.centerPosition = centerPosition;

      // @public {Property} - the value used to scale from model coordinates to number line distance
      this.orientationProperty = new Property( options.initialOrientation );

      // @public {Property<Range>} - the range of values that should be displayed to the user
      this.displayedRangeProperty = new Property( options.initialDisplayedRange );

      // @public {BooleanProperty} - controls whether tick marks should be displayed to the user
      this.tickMarksVisibleProperty = new BooleanProperty( options.tickMarksInitiallyDisplayed );

      // @public {NumberProperty} - the spacing, in number line units, between the tick marks
      this.tickMarkSpacingProperty = new NumberProperty( options.initialTickMarkSpacing );

      // @public {BooleanProperty} - controls whether point labels are displayed to the user
      this.showPointLabels = new BooleanProperty( options.pointLabelsInitiallyShown );

      // @public (read-only) {ObservableArray<NumberLinePoint>} - array of points on this number line
      this.residentPoints = new ObservableArray();

      // @private {Object{ initialValue, color}[]} - array of point specifications that describe what points should
      // exist on the number line when constructed and after a reset
      this.initialPointSpecs = options.initialPointSpecs;

      // @public (read-only) {Bounds2|null} - The bounds into which the number line display range is projected when
      // being displayed in the view.  If not set, points can still be added, but values outside of model space can't
      // be projected.
      this.modelProjectionBounds = options.modelProjectionBounds;

      // @private - 2D scale for transforming between model coordinates and number line position
      this.modelToPositonScale = Vector2.ZERO.copy();
      this.displayedRangeProperty.link( displayedRange => {
        if ( options.modelProjectionBounds !== null ) {
          this.modelToPositonScale = new Vector2(
            displayedRange.getLength() / options.modelProjectionBounds.width,
            displayedRange.getLength() / options.modelProjectionBounds.height
          );
        }
      } );

      // add the initial points
      this.addInitialPoints();
    }

    /**
     * whether this number line is in the horizontal orientation
     * @returns {boolean}
     * @public
     */
    isHorizontal() {
      return this.orientationProperty.value === NumberLineOrientation.HORIZONTAL;
    }

    /**
     * whether this number line is in the horizontal orientation
     * @returns {boolean}
     * @public
     */
    isVertical() {
      return this.orientationProperty.value === NumberLineOrientation.VERTICAL;
    }

    /**
     * project a position in model space into a 1D value on the number line
     * @param {Vector2} modelPosition
     * @returns {number}
     * @public
     */
    modelPositionToValue( modelPosition ) {
      assert && assert(
        !this.modelToPositonScale.equals( Vector2.ZERO ),
        'must set model display bounds if using this method'
      );
      let numberLineValue;
      if ( this.isHorizontal() ) {
        numberLineValue = ( modelPosition.x - this.centerPosition.x ) * this.modelToPositonScale.x;
      }
      else {
        numberLineValue = ( modelPosition.y - this.centerPosition.y ) * -this.modelToPositonScale.y;
      }

      // round the value based on the current tick mark spacing
      return Util.roundToInterval( numberLineValue, this.tickMarkSpacingProperty.value );
    }

    /**
     * convert a value on the number line to a position in 2D model space
     * @param {number} numberLineValue
     * @returns {Vector2}
     * @public
     */
    valueToModelPosition( numberLineValue ) {

      // state and parameter checking
      assert && assert(
        !this.modelToPositonScale.equals( Vector2.ZERO ),
        'must set model display bounds if using this method'
      );

      let modelPosition;
      if ( this.isHorizontal() ) {
        modelPosition = new Vector2(
          numberLineValue / this.modelToPositonScale.x + this.centerPosition.x,
          this.centerPosition.y
        );
      }
      else {
        modelPosition = new Vector2(
          this.centerPosition.x,
          numberLineValue / -this.modelToPositonScale.y + this.centerPosition.y
        );
      }
      return modelPosition;
    }

    /**
     * add a point to the number line
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    addPoint( numberLinePoint ) {
      this.residentPoints.add( numberLinePoint );
    }

    /**
     * remove a point from the number line
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    removePoint( numberLinePoint ) {
      this.residentPoints.remove( numberLinePoint );
    }

    /**
     * add the initial set of points to the number line, used during construction and reset
     * @private
     */
    addInitialPoints() {
      this.initialPointSpecs.forEach( pointSpec => {
        this.addPoint( new NumberLinePoint( pointSpec.initialValue, pointSpec.color, this ) );
      } );
    }

    /**
     * whether the provided point controller position is within range for a number line point to be created
     * @param {Vector2} pointControllerPosition
     * @returns {boolean}
     * @public
     */
    withinPointCreationDistance( pointControllerPosition ) {
      return this.withinDistance( pointControllerPosition, POINT_CREATION_DISTANCE );
    }

    /**
     * whether the provided point controller position is within range for a number line point to be removed
     * @param {Vector2} pointControllerPosition
     * @returns {boolean}
     * @public
     */
    withinPointRemovalDistance( pointControllerPosition ) {
      return this.withinDistance( pointControllerPosition, POINT_REMOVAL_DISTANCE );
    }

    /**
     * whether the provided position is within range of the provided distance
     * @param {Vector2} pointControllerPosition
     * @param {number} distance
     * @returns {boolean}
     */
    withinDistance( pointControllerPosition, distance ) {
      if ( this.isHorizontal() ) {
        return Math.abs( pointControllerPosition.y - this.centerPosition.y ) <= distance;
      }
      else {
        return Math.abs( pointControllerPosition.x - this.centerPosition.x ) <= distance;
      }
    }

    /**
     * reset to initial state
     * @public
     */
    reset() {
      this.residentPoints.clear();
      this.orientationProperty.reset();
      this.displayedRangeProperty.reset();
      this.tickMarksVisibleProperty.reset();
      this.tickMarkSpacingProperty.reset();
      this.showPointLabels.reset();
      this.addInitialPoints();
    }
  }

  return numberLineIntegers.register( 'NumberLine', NumberLine );
} );