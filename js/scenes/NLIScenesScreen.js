// Copyright 2019, University of Colorado Boulder

/**
 * the 'Scenes' screen in the Number Line: Integers simulation
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const NLIScenesModel = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScenesModel' );
  const NLIScenesScreenView = require( 'NUMBER_LINE_INTEGERS/scenes/view/NLIScenesScreenView' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );
  const RandomIconFactory = require( 'NUMBER_LINE_INTEGERS/RandomIconFactory' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  // TODO: Put this in with the strings!!!!!!!!!!!!!
  const scenesString = 'Scenes';

  // TODO: Just for fun
  const iconFactory = new RandomIconFactory( 158 );

  class NLIScenesScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: scenesString,
        backgroundColorProperty: new Property( 'rgb( 254, 247, 233 )' ),
        homeScreenIcon: iconFactory.createIcon(),
        tandem: tandem
      };

      super( () => new NLIScenesModel(), model => new NLIScenesScreenView( model ), options );
    }
  }

  return numberLineIntegers.register( 'NLIScenesScreen', NLIScenesScreen );
} );
