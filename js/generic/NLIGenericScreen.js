// Copyright 2019, University of Colorado Boulder

/**
 * the 'Generic' screen in the Number Line: Integers simulation
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const NLIGenericModel = require( 'NUMBER_LINE_INTEGERS/generic/model/NLIGenericModel' );
  const NLIGenericScreenView = require( 'NUMBER_LINE_INTEGERS/generic/view/NLIGenericScreenView' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );
  const RandomIconFactory = require( 'NUMBER_LINE_INTEGERS/RandomIconFactory' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  // TODO: Put this in with the strings!!!!!!!!!!!!!
  const genericString = 'Generic';

  // TODO: Just for fun
  const iconFactory = new RandomIconFactory( 199584 );

  class NLIGenericScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: genericString,
        backgroundColorProperty: new Property( 'rgb( 245, 255, 254 )' ),
        homeScreenIcon: iconFactory.createIcon(),
        tandem: tandem
      };

      super( () => new NLIGenericModel(), model => new NLIGenericScreenView( model ), options );
    }
  }

  return numberLineIntegers.register( 'NLIGenericScreen', NLIGenericScreen );
} );
