// Copyright 2019, University of Colorado Boulder

/**
 * enum of possible scene values for the Number Line: Integers "Explore" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  return numberLineIntegers.register( 'NLIScene', Enumeration.byKeys( [ 'ELEVATION', 'BANK', 'TEMPERATURE' ] ) );
} );
