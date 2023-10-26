// Copyright 2023, University of Colorado Boulder

/**
 * The ExplorerCharacterSet defines what is needed for each character set in Number Line Integers.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import RegionAndCulturePortrayal from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import numberLineIntegers from '../../numberLineIntegers.js';

export default class ExplorerCharacterSet extends RegionAndCulturePortrayal {
  /**
   *
   * @param labelString { LocalizedStringProperty }
   * @param headshotIcon { Image }
   * @param flying { HTMLImageElement }
   * @param hiking { HTMLImageElement }
   * @param swimming { HTMLImageElement }
   * @param screenHomeIcon { HTMLImageElement }
   * @param screenNavIcon { HTMLImageElement }
   */
  constructor( labelString, headshotIcon,
               flying, hiking, swimming,
               screenHomeIcon, screenNavIcon ) {
   super( headshotIcon, labelString, {} );

   this.flying = flying;
   this.hiking = hiking;
   this.swimming = swimming;
   this.screenHomeIcon = screenHomeIcon;
   this.screenNavIcon = screenNavIcon;
  }
}

numberLineIntegers.register( 'ExplorerCharacterSet', ExplorerCharacterSet );