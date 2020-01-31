// Copyright 2019, University of Colorado Boulder

/**
 * SpatializedNumberLine is a model of a number line that is projected into 2D space.  It also tracks a number of other
 * pieces of information that control how the number line is displayed when presented to the user.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants

  // perpendicular distance from number line in model/view coords where points get created
  const POINT_CREATION_PERPENDICULAR_DISTANCE = 60;

  // distance from the end of the number line in model/view coords where points get created
  const POINT_CREATION_END_DISTANCE = 20;

  // perpendicular distance from number line in model/view coords where points get removed
  const POINT_REMOVAL_PERPENDICULAR_DISTANCE = 120;

  // distance from the end of the number line in model/view coords where points get removed
  const POINT_REMOVAL_END_DISTANCE = 25;

  class SpatializedNumberLine extends NumberLine {

    /**
     * {Vector2} zeroPosition - the location in model space of the zero point on the number line
     * {Object} [options]
     * @public
     */
    constructor( zeroPosition, options ) {

      super( options );

      options = merge( {

        // {string} - whether the number line is initially oriented in the horizontal or vertical direction
        initialOrientation: Orientation.HORIZONTAL,

        // {Range} - range of values to be displayed
        initialDisplayedRange: new Range( -10, 10 ),

        // {boolean} - whether point labels should initially be shown
        labelsInitiallyVisible: false,

        // {boolean} - whether tick marks should be initially displayed
        tickMarksInitiallyVisible: false,

        // {boolean} - whether absolute value indicators should be initially displayed
        absoluteValuesInitiallyVisible: false,

        // {number} - The width and height values used when projecting the number line into model space. The default
        // values are pretty arbitrary and at least one of these will generally need to be set. However, if the number
        // line is only ever shown in one orientation, the value corresponding to the other orientation can be left at
        // the default value.
        widthInModelSpace: 100,
        heightInModelSpace: 100

      }, options );

      // @public (read-only) {Vector2} - center in model space where this number line exists
      this.centerPosition = zeroPosition;

      // @public {Property} - the value used to scale from model coordinates to number line distance
      this.orientationProperty = new EnumerationProperty( Orientation, options.initialOrientation );

      // @public {Property<Range>} - the range of values that should be displayed to the user
      this.displayedRangeProperty = new Property( options.initialDisplayedRange, { valueType: Range } );

      // @public {BooleanProperty} - controls whether point labels are displayed to the user
      this.showLabelsProperty = new BooleanProperty( options.labelsInitiallyVisible );

      // @public {BooleanProperty} - controls whether tick marks should be displayed to the user
      this.showTickMarksProperty = new BooleanProperty( options.tickMarksInitiallyVisible );

      // @public {BooleanProperty} - controls whether tick marks should be displayed to the user
      this.showAbsoluteValuesProperty = new BooleanProperty( options.absoluteValuesInitiallyVisible );

      // @public {BooleanProperty} - controls whether tick marks should be displayed to the user
      this.showOppositesProperty = new BooleanProperty( false );

      // @private - 2D scale for transforming between model coordinates and number line position
      this.modelToPositonScale = Vector2.ZERO.copy();
      this.displayedRangeProperty.link( displayedRange => {
        this.modelToPositonScale = new Vector2(
          displayedRange.getLength() / options.widthInModelSpace,
          displayedRange.getLength() / options.heightInModelSpace
        );
      } );

      // @public (read-only) {Bounds2} - The bounds into which the number line display range is projected when being
      // displayed in the view.
      this.modelProjectionBounds = new Bounds2(
        this.displayedRangeProperty.value.min / this.modelToPositonScale.x + zeroPosition.x,
        this.displayedRangeProperty.value.max / -this.modelToPositonScale.y + zeroPosition.y,
        this.displayedRangeProperty.value.max / this.modelToPositonScale.x + zeroPosition.x,
        this.displayedRangeProperty.value.min / -this.modelToPositonScale.y + zeroPosition.y
      );
    }

    /**
     * whether this number line is in the horizontal orientation
     * @returns {boolean}
     * @public
     */
    get isHorizontal() {
      return this.orientationProperty.value === Orientation.HORIZONTAL;
    }

    /**
     * whether this number line is in the horizontal orientation
     * @returns {boolean}
     * @public
     */
    get isVertical() {
      return this.orientationProperty.value === Orientation.VERTICAL;
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
      if ( this.isHorizontal ) {
        numberLineValue = ( modelPosition.x - this.centerPosition.x ) * this.modelToPositonScale.x;
      }
      else {
        numberLineValue = ( modelPosition.y - this.centerPosition.y ) * -this.modelToPositonScale.y;
      }

      return numberLineValue;
    }

    /**
     * convert a value on the number line to a position in 2D model space
     * @param {number} numberLineValue
     * @returns {Vector2}
     * @public
     */
    valueToModelPosition( numberLineValue ) {

      let modelPosition;
      if ( this.isHorizontal ) {
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
     * whether the provided point controller position is within range for a number line point to be created
     * @param {Vector2} pointControllerPosition
     * @returns {boolean}
     * @public
     */
    isWithinPointCreationDistance( pointControllerPosition ) {
      return this.isWithinDistance( pointControllerPosition, POINT_CREATION_PERPENDICULAR_DISTANCE, POINT_CREATION_END_DISTANCE );
    }

    /**
     * whether the provided point controller position is within range for a number line point to be removed
     * @param {Vector2} pointControllerPosition
     * @returns {boolean}
     * @public
     */
    isWithinPointRemovalDistance( pointControllerPosition ) {
      return this.isWithinDistance( pointControllerPosition, POINT_REMOVAL_PERPENDICULAR_DISTANCE, POINT_REMOVAL_END_DISTANCE );
    }

    /**
     * whether the provided position is within range of the provided distance
     * @param {Vector2} pointControllerPosition
     * @param {number} perpendicularDistance
     * @param {number} endDistance
     * @returns {boolean}
     * @public
     */
    isWithinDistance( pointControllerPosition, perpendicularDistance, endDistance ) {
      let testBounds;
      if ( this.isHorizontal ) {
        testBounds = new Bounds2(
          this.modelProjectionBounds.minX - endDistance,
          this.centerPosition.y - perpendicularDistance,
          this.modelProjectionBounds.maxX + endDistance,
          this.centerPosition.y + perpendicularDistance
        );
      }
      else {
        testBounds = new Bounds2(
          this.centerPosition.x - perpendicularDistance,
          this.modelProjectionBounds.minY - endDistance,
          this.centerPosition.x + perpendicularDistance,
          this.modelProjectionBounds.maxY + endDistance
        );
      }
      return testBounds.containsPoint( pointControllerPosition );
    }

    /**
     * reset to initial state
     * @public
     */
    reset() {
      super.reset();
      this.showAbsoluteValuesProperty.reset();
      this.orientationProperty.reset();
      this.displayedRangeProperty.reset();
      this.showLabelsProperty.reset();
      this.showTickMarksProperty.reset();
      this.showOppositesProperty.reset();
    }
  }

  return numberLineIntegers.register( 'SpatializedNumberLine', SpatializedNumberLine );
} );
