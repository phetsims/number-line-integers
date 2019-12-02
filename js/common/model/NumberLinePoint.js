// Copyright 2019, University of Colorado Boulder

/**
 * NumberLinePoint defines points on a number line in the "Number Line" suite of sims
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );

  class NumberLinePoint {

    /**
     * {number} initialValue - the value on the number line
     * {Color} color - the color that should be used to portray this point in the view
     * {NumberLine} numberLine - the number line on which this point exists
     * {PointController} [controller] - the controller that will move this point
     * @public
     */
    constructor( initialValue, color, numberLine, controller = null ) {

      // @public {NumberProperty} - portrayed value on the number line
      this.valueProperty = new NumberProperty( initialValue );

      // @public {PaintColorProperty}
      this.colorProperty = new PaintColorProperty( color );

      // @public {BooleanProperty} - indicates whether this is being dragged by the user
      this.isDraggingProperty = new BooleanProperty( false );

      // @private {NumberLine} - the number line on which this point resides
      this.numberLine = numberLine;

      // @private {PointController|null} - a "point controller" that controls where this point is, can be null
      this.controller = controller;

      // @public (read-only) {number|null} - the most recently proposed value, used when deciding where to land on number line
      this.mostRecentlyProposedValue = null;
    }

    /**
     * get the position of this number line point in model space
     * @returns {Vector2}
     * @public
     */
    getPositionInModelSpace() {
      return this.numberLine.valueToModelPosition( this.valueProperty.value );
    }

    /**
     * given the proposed value, set the value of this number line point to the closest valid value on the number line
     * @param {number} numberLineValue - value on number line, doesn't have to be constrained to integer values
     * @public
     */
    proposeValue( numberLineValue ) {
      const constrainedValue = this.numberLine.getConstrainedValue( numberLineValue );
      if ( constrainedValue !== this.valueProperty.value ) {
        this.valueProperty.value = constrainedValue;
      }
      this.mostRecentlyProposedValue = numberLineValue;
    }
  }

  return numberLineIntegers.register( 'NumberLinePoint', NumberLinePoint );
} );