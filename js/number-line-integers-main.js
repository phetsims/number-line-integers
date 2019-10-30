// Copyright 2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );
  const NLIGenericScreen = require( 'NUMBER_LINE_INTEGERS/generic/NLIGenericScreen' );
  const NLIExploreScreen = require( 'NUMBER_LINE_INTEGERS/explore/NLIExploreScreen' );

  // strings
  const numberLineIntegersTitleString = require( 'string!NUMBER_LINE_INTEGERS/number-line-integers.title' );

  const simOptions = {
    credits: {
      //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'John Blanco, Chris Klusendorf',
      team: 'Ariel Paul, Kathy Perkins, and in cooperation with the Next-Lab project',
      qualityAssurance: '',
      graphicArts: 'Megan Lai',
      soundDesign: '',
      thanks: ''
    }
  };

  // launch the sim - beware that scenery Image nodes created outside of SimLauncher.launch() will have zero bounds
  // until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
  SimLauncher.launch( () => {
    const screens = [
      new NLIExploreScreen( Tandem.rootTandem.createTandem( 'scenesScreen' ) ),
      new NLIGenericScreen( Tandem.rootTandem.createTandem( 'genericScreen' ) )
    ];
    const sim = new Sim( numberLineIntegersTitleString, screens, simOptions );
    sim.start();
  } );
} );