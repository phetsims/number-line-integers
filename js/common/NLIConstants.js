// Copyright 2019, University of Colorado Boulder

/**
 * Shared constants for the Number Line: Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const ScreenView = require( 'JOIST/ScreenView' );

  const NLIConstants = {
    NLI_LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

    // The amount, in model and view coordinates, of space between the end of the number lines display range and the end
    // of the number line itself.
    GENERIC_SCREEN_DISPLAYED_RANGE_INSET: 40
  };

  return numberLineIntegers.register( 'NLIConstants', NLIConstants );
} );