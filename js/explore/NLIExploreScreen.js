// Copyright 2019, University of Colorado Boulder

/**
 * the 'Explore' screen in the Number Line: Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIExploreModel = require( 'NUMBER_LINE_INTEGERS/explore/model/NLIExploreModel' );
  const NLIExploreScreenView = require( 'NUMBER_LINE_INTEGERS/explore/view/NLIExploreScreenView' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const exploreScreenHomeIcon = require( 'image!NUMBER_LINE_INTEGERS/explore-screen-home.png' );
  const exploreScreenNavIcon = require( 'image!NUMBER_LINE_INTEGERS/explore-screen-nav.png' );

  // strings
  const screenExploreString = require( 'string!NUMBER_LINE_INTEGERS/screen.explore' );

  class NLIExploreScreen extends Screen {

    /**
     * @param {Tandem} tandem
     * @public
     */
    constructor( tandem ) {

      const options = {
        name: screenExploreString,
        backgroundColorProperty: new Property( 'rgb( 254, 247, 233 )' ),
        homeScreenIcon: new Image( exploreScreenHomeIcon ),
        navigationBarIcon: new Image( exploreScreenNavIcon ),
        tandem: tandem
      };

      super( () => new NLIExploreModel(), model => new NLIExploreScreenView( model ), options );
    }
  }

  return numberLineIntegers.register( 'NLIExploreScreen', NLIExploreScreen );
} );
