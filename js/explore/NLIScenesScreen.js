// Copyright 2019, University of Colorado Boulder

/**
 * the 'Scenes' screen in the Number Line: Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIScenesModel = require( 'NUMBER_LINE_INTEGERS/explore/model/NLIScenesModel' );
  const NLIScenesScreenView = require( 'NUMBER_LINE_INTEGERS/explore/view/NLIScenesScreenView' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const scenesScreenHomeIcon = require( 'image!NUMBER_LINE_INTEGERS/scenes-screen-home.png' );
  const scenesScreenNavIcon = require( 'image!NUMBER_LINE_INTEGERS/scenes-screen-nav.png' );

  // strings
  const exploreString = require( 'string!NUMBER_LINE_INTEGERS/explore' );

  class NLIScenesScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: exploreString,
        backgroundColorProperty: new Property( 'rgb( 254, 247, 233 )' ),
        homeScreenIcon: new Image( scenesScreenHomeIcon ),
        navigationBarIcon: new Image( scenesScreenNavIcon ),
        tandem: tandem
      };

      super( () => new NLIScenesModel(), model => new NLIScenesScreenView( model ), options );
    }
  }

  return numberLineIntegers.register( 'NLIScenesScreen', NLIScenesScreen );
} );
