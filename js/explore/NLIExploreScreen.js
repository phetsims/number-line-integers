// Copyright 2019-2023, University of Colorado Boulder

/**
 * The 'Explore' screen in the Number Line: Integers simulation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ExplorerImages from './view/ExplorerImages.js';
import numberLineIntegers from '../numberLineIntegers.js';
import NumberLineIntegersStrings from '../NumberLineIntegersStrings.js';
import NLIExploreModel from './model/NLIExploreModel.js';
import ExploreScreenIcon from '../../../number-line-common/js/explore/view/ExploreScreenIcon.js';
import NLIExploreScreenView from './view/NLIExploreScreenView.js';

class NLIExploreScreen extends Screen {

  /**
   * @param { PreferencesModel } preferencesModel
   * @param {Tandem} tandem
   * @public
   */
  constructor( preferencesModel, tandem ) {

    const options = {
      name: NumberLineIntegersStrings.screen.exploreStringProperty,
      backgroundColorProperty: new Property( 'rgb( 254, 247, 233 )' ),
      homeScreenIcon: new ExploreScreenIcon( ExplorerImages.EXPLORER_CHARACTER_SETS, preferencesModel.localizationModel.regionAndCulturePortrayalProperty, 'home' ),
      navigationBarIcon: new ExploreScreenIcon( ExplorerImages.EXPLORER_CHARACTER_SETS, preferencesModel.localizationModel.regionAndCulturePortrayalProperty, 'nav' ),
      tandem: tandem
    };

    super( () => new NLIExploreModel( preferencesModel ), model => new NLIExploreScreenView( model ), options );
  }
}

numberLineIntegers.register( 'NLIExploreScreen', NLIExploreScreen );
export default NLIExploreScreen;