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
  const NLIScenesScreen = require( 'NUMBER_LINE_INTEGERS/scenes/NLIScenesScreen' );

  // strings
  const numberLineIntegersTitleString = require( 'string!NUMBER_LINE_INTEGERS/number-line-integers.title' );

  const simOptions = {
    credits: {
      //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'John Blanco, Chris Klusendorf',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  // launch the sim - beware that scenery Image nodes created outside of SimLauncher.launch() will have zero bounds
  // until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
  SimLauncher.launch( () => {
    const screens = [
      new NLIScenesScreen( Tandem.rootTandem.createTandem( 'scenesScreen' ) ),
      new NLIGenericScreen( Tandem.rootTandem.createTandem( 'genericScreen' ) )
    ];
    const sim = new Sim( numberLineIntegersTitleString, screens, simOptions );
    sim.start();
  } );
} );