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
    NLI_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS
  };

  return numberLineIntegers.register( 'NLIConstants', NLIConstants );
} );