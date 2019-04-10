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
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

  class NumberLine {

    /**
     * {Vector2} centerPosition - the location in model space of the zero point on the number line
     */
    constructor( centerPosition, options ) {

      options = _.extend( {

        // {number} - the multiplier from model space to number line distance
        initialScale: 10,

        // {string} - whether the number line is initially oriented in the horizontal or vertical direction
        initialOrientation: 'horizontal',

        // {Range} - range of values to be displayed
        initialDisplayedRange: new Range( -10, 10 ),

        // {boolean} - whether tick marks should be initially displayed
        tickMarksInitiallyDisplayed: false,

        // {number} - initial spacing between tick marks
        initialTickMarkSpacing: 1,

        // {boolean} - whether point labels should initially be shown
        pointLabelsInitiallyShown: false

      }, options );

      // @public (read-only) {Vector2} - center in model space where this number line exists
      this.centerPosition = centerPosition;

      // @public {NumberProperty} - the value used to scale from model coordinates to number line distance
      this.scaleProperty = new NumberProperty( options.initialScale );

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
    }

    /**
     * reset to initial state
     */
    reset() {
      this.positionProperty.reset();
    }
  }

  return numberLineIntegers.register( 'NumberLine', NumberLine );
} );