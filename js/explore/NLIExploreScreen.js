// Copyright 2019-2020, University of Colorado Boulder

/**
 * the 'Explore' screen in the Number Line: Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Image from '../../../scenery/js/nodes/Image.js';
import exploreScreenHomeIcon from '../../images/explore-screen-home_png.js';
import exploreScreenNavIcon from '../../images/explore-screen-nav_png.js';
import numberLineIntegersStrings from '../number-line-integers-strings.js';
import numberLineIntegers from '../numberLineIntegers.js';
import NLIExploreModel from './model/NLIExploreModel.js';
import NLIExploreScreenView from './view/NLIExploreScreenView.js';

const screenExploreString = numberLineIntegersStrings.screen.explore;

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

numberLineIntegers.register( 'NLIExploreScreen', NLIExploreScreen );
export default NLIExploreScreen;