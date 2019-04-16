// Copyright 2019, University of Colorado Boulder

/**
 * Possible orientations for a Number Line
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  return numberLineIntegers.register( 'NumberLineOrientation', new Enumeration( [ 'HORIZONTAL', 'VERTICAL' ] ) );
} );
