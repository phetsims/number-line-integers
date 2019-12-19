// Copyright 2019, University of Colorado Boulder

/**
 * enum of possible decoration values for the piggy banks
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  return numberLineIntegers.register( 'PiggyBankDecoration', Enumeration.byKeys( [ 'LIGHTNING', 'FLOWERS' ] ) );
} );
