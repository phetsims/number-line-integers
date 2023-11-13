// Copyright 2019-2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import NLIQueryParameters from './common/NLIQueryParameters.js';
import ExplorerImages from './common/view/ExplorerImages.js';
import NLIExploreScreen from './explore/NLIExploreScreen.js';
import NLIGenericScreen from './generic/NLIGenericScreen.js';
import NumberLineIntegersStrings from './NumberLineIntegersStrings.js';

const numberLineIntegersTitleStringProperty = NumberLineIntegersStrings[ 'number-line-integers' ].titleStringProperty;

const preferencesModel = new PreferencesModel( {
  localizationOptions: {
    characterSets: ExplorerImages.EXPLORER_CHARACTER_SETS,
    queryParameterValue: NLIQueryParameters.regionAndCulture
  }
} );

const simOptions = {
  preferencesModel: preferencesModel,
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'John Blanco, Chris Klusendorf, Saurabh Totey',
    team: 'Ariel Paul, Kathy Perkins, and in cooperation with the Next-Lab project',
    qualityAssurance: 'Logan Bray, Liam Mulhall, Jacob Romero, Kathryn Woessner',
    graphicArts: 'Megan Lai',
    soundDesign: '',
    thanks: ''
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const screens = [
    new NLIExploreScreen( preferencesModel, Tandem.ROOT.createTandem( 'exploreScreen' ) ),
    new NLIGenericScreen( Tandem.ROOT.createTandem( 'genericScreen' ) )
  ];
  const sim = new Sim( numberLineIntegersTitleStringProperty, screens, simOptions );
  sim.start();
} );