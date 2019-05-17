// Copyright 2019, University of Colorado Boulder

/**
 * Model of a number line.  This is (perhaps rather obviously) a very central class for the Number Line suite of
 * simulations.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants

  // perpendicular distance from number line in model/view coords where points get created
  const POINT_CREATION_PERPENDICULAR_DISTANCE = 60;

  // distance from the end of the number line in model/view coords where points get created
  const POINT_CREATION_END_DISTANCE = 20;

  // perpendicular distance from number line in model/view coords where points get removed
  const POINT_REMOVAL_PERPENDICULAR_DISTANCE = 90;

  // distance from the end of the number line in model/view coords where points get removed
  const POINT_REMOVAL_END_DISTANCE = 25;

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
        labelsInitiallyVisible: false,

        // {boolean} - whether tick marks should be initially displayed
        tickMarksInitiallyVisible: false,

        // {boolean} - whether absolute value indicators should be initially displayed
        absoluteValuesInitiallyVisible: false,

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
      this.labelsVisibleProperty = new BooleanProperty( options.labelsInitiallyVisible );

      // @public {BooleanProperty} - controls whether tick marks should be displayed to the user
      this.tickMarksVisibleProperty = new BooleanProperty( options.tickMarksInitiallyVisible );

      // @public {BooleanProperty} - controls whether tick marks should be displayed to the user
      this.showAbsoluteValuesProperty = new BooleanProperty( options.absoluteValuesInitiallyVisible );

      // @public {BooleanProperty} - controls whether tick marks should be displayed to the user
      this.oppositesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - controls whether point labels are displayed to the user
      this.showPointLabels = new BooleanProperty( options.pointLabelsInitiallyShown );

      // @public (read-only) {ObservableArray<NumberLinePoint>} - array of points on this number line
      this.residentPoints = new ObservableArray();

      // hook up a listener to make sure that the points don't land on top of one another
      this.residentPoints.addItemAddedListener( addedPoint => {

        // listener to make sure point lands in a good point when released
        const pointDragListener = dragging => {
          if ( !dragging ) {
            if ( this.getPointsAt( addedPoint.valueProperty.value ).length > 1 ) {

              // there is already a point at this location, so we have to choose another
              addedPoint.valueProperty.set( this.getNearestUnoccupiedValue( addedPoint.mostRecentlyProposedValue ) );
            }
          }
        };
        addedPoint.isDraggingProperty.link( pointDragListener );

        // remove the listener when the point is removed from the number line
        this.residentPoints.addItemRemovedListener( removedPoint => {
          if ( removedPoint === addedPoint ) {
            removedPoint.isDraggingProperty.unlink( pointDragListener );
          }
        } );
      } );

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
    get isHorizontal() {
      return this.orientationProperty.value === NumberLineOrientation.HORIZONTAL;
    }

    /**
     * whether this number line is in the horizontal orientation
     * @returns {boolean}
     * @public
     */
    get isVertical() {
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
      if ( this.isHorizontal ) {
        numberLineValue = ( modelPosition.x - this.centerPosition.x ) * this.modelToPositonScale.x;
      }
      else {
        numberLineValue = ( modelPosition.y - this.centerPosition.y ) * -this.modelToPositonScale.y;
      }

      // round the value to an integer
      return numberLineValue;
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
        assert && assert( !this.hasPointAt( pointSpec.initialValue ), 'a point already exists at the specified location' );
        this.addPoint( new NumberLinePoint( pointSpec.initialValue, pointSpec.color, this ) );
      } );
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
          this.modelProjectionBounds.maxY + endDistance,
        );
      }
      return testBounds.containsPoint( pointControllerPosition );
    }

    /**
     * whether any point on the number line already exists at the provided value
     * @param {number} value
     * @returns {boolean}
     * @public
     */
    hasPointAt( value ) {
      return _.some( this.residentPoints.getArray(), point => point.valueProperty.value === value );
    }

    /**
     * get a list of all points at the provided value
     * @param {number} value
     * @returns {NumberLinePoint[]}
     * @private
     */
    getPointsAt( value ) {
      return _.filter( this.residentPoints.getArray(), point => point.valueProperty.value === value );
    }

    /**
     * get the closest valid value that isn't already occupied by a point
     * @param {number} value
     */
    getNearestUnoccupiedValue( value ) {
      const roundedValue = Util.roundSymmetric( value );
      let nearestUnoccupiedValue = roundedValue;
      if ( this.hasPointAt( roundedValue ) ) {
        let nearestLargerValue = null;
        for ( let i = roundedValue + 1; i <= this.displayedRangeProperty.value.max; i++ ) {
          if ( !this.hasPointAt( i ) ) {
            nearestLargerValue = i;
            break;
          }
        }
        let nearestSmallerValue = null;
        for ( let i = roundedValue - 1; i >= this.displayedRangeProperty.value.min; i-- ) {
          if ( !this.hasPointAt( i ) ) {
            nearestSmallerValue = i;
            break;
          }
        }
        if ( Math.abs( value - nearestLargerValue ) < Math.abs( value - nearestSmallerValue ) ) {
          nearestUnoccupiedValue = nearestLargerValue;
        }
        else {
          nearestUnoccupiedValue = nearestSmallerValue;
        }
      }
      return nearestUnoccupiedValue;
    }

    /**
     * reset to initial state
     * @public
     */
    reset() {
      this.residentPoints.clear();
      this.showAbsoluteValuesProperty.reset();
      this.orientationProperty.reset();
      this.displayedRangeProperty.reset();
      this.labelsVisibleProperty.reset();
      this.tickMarksVisibleProperty.reset();
      this.oppositesVisibleProperty.reset();
      this.showPointLabels.reset();
      this.addInitialPoints();
    }
  }

  return numberLineIntegers.register( 'NumberLine', NumberLine );
} );