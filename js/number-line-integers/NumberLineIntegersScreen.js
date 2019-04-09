// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineIntegersModel = require( 'NUMBER_LINE_INTEGERS/number-line-integers/model/NumberLineIntegersModel' );
  const NumberLineIntegersScreenView = require( 'NUMBER_LINE_INTEGERS/number-line-integers/view/NumberLineIntegersScreenView' );

  class NumberLineIntegersScreen extends Screen {

    constructor() {

      const options = {
        backgroundColorProperty: new Property( 'white' )
      };

      super(
        () => new NumberLineIntegersModel(),
        ( model ) => new NumberLineIntegersScreenView( model ),
        options
      );
    }
  }

  return numberLineIntegers.register( 'NumberLineIntegersScreen', NumberLineIntegersScreen );
} );