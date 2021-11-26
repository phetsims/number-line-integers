// Copyright 2019-2020, University of Colorado Boulder

/**
 * the 'Generic' screen in the Number Line: Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import genericScreenHomeIcon from '../../images/generic-screen-home_png.js';
import genericScreenNavIcon from '../../images/generic-screen-nav_png.js';
import numberLineIntegers from '../numberLineIntegers.js';
import numberLineIntegersStrings from '../numberLineIntegersStrings.js';
import NLIGenericModel from './model/NLIGenericModel.js';
import NLIGenericScreenView from './view/NLIGenericScreenView.js';

const screenGenericString = numberLineIntegersStrings.screen.generic;

class NLIGenericScreen extends Screen {

  /**
   * @param {Tandem} tandem
   * @public
   */
  constructor( tandem ) {

    const options = {
      name: screenGenericString,
      backgroundColorProperty: new Property( 'rgb( 245, 255, 254 )' ),
      homeScreenIcon: new ScreenIcon( new Image( genericScreenHomeIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( genericScreenNavIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super( () => new NLIGenericModel(), model => new NLIGenericScreenView( model ), options );
  }
}

numberLineIntegers.register( 'NLIGenericScreen', NLIGenericScreen );
export default NLIGenericScreen;