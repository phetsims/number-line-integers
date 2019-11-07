// Copyright 2019, University of Colorado Boulder

/**
 * the 'Generic' screen in the Number Line: Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIGenericModel = require( 'NUMBER_LINE_INTEGERS/generic/model/NLIGenericModel' );
  const NLIGenericScreenView = require( 'NUMBER_LINE_INTEGERS/generic/view/NLIGenericScreenView' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const genericScreenHomeIcon = require( 'image!NUMBER_LINE_INTEGERS/generic-screen-home.png' );
  const genericScreenNavIcon = require( 'image!NUMBER_LINE_INTEGERS/generic-screen-nav.png' );

  // strings
  const screenGenericString = require( 'string!NUMBER_LINE_INTEGERS/screen.generic' );

  class NLIGenericScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenGenericString,
        backgroundColorProperty: new Property( 'rgb( 245, 255, 254 )' ),
        homeScreenIcon: new Image( genericScreenHomeIcon ),
        navigationBarIcon: new Image( genericScreenNavIcon ),
        tandem: tandem
      };

      super( () => new NLIGenericModel(), model => new NLIGenericScreenView( model ), options );
    }
  }

  return numberLineIntegers.register( 'NLIGenericScreen', NLIGenericScreen );
} );
