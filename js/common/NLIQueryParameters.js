// Copyright 2019, University of Colorado Boulder

/**
 * query parameters supported by this simulation
 *
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  const NLIQueryParameters = QueryStringMachine.getAll( {

    // changes default units of temperature to celsius
    defaultCelsius: { type: 'flag' },

    // TODO: temp for demo and review
    dynamicColorTemperatureReadout: { type: 'flag' }

  } );

  return numberLineIntegers.register( 'NLIQueryParameters', NLIQueryParameters );
} );
