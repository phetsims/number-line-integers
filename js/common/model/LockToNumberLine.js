// Copyright 2019, University of Colorado Boulder

/**
 * Represents when a point controller should lock to a number line
 * Is passed in to point controllers as an option during construction
 *
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  // @public
  const LockToNumberLine = Enumeration.byKeys( [ 'ALWAYS', 'NEVER', 'WHEN_CLOSE' ] );

  return numberLineIntegers.register( 'LockToNumberLine', LockToNumberLine );
} );
