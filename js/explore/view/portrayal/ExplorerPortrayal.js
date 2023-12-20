// Copyright 2023, University of Colorado Boulder

/**
 * The ExplorerPortrayal defines what is needed for each portrayal in Number Line Integers.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import NumberLinePortrayal from '../../../../../number-line-common/js/explore/view/NumberLinePortrayal.js';
import numberLineIntegers from '../../../numberLineIntegers.js';

export default class ExplorerPortrayal extends NumberLinePortrayal {
  /**
   *
   * @param label { LocalizedStringProperty }
   * @param flying { HTMLImageElement }
   * @param hiking { HTMLImageElement }
   * @param swimming { HTMLImageElement }
   * @param screenHomeIcon { HTMLImageElement }
   * @param screenNavIcon { HTMLImageElement }
   * @param queryParameterValue { string }
   */
  constructor( label,
               flying, hiking, swimming,
               screenHomeIcon, screenNavIcon, queryParameterValue ) {
    super( label, screenHomeIcon, screenNavIcon, queryParameterValue );

    this.flying = flying;
    this.hiking = hiking;
    this.swimming = swimming;
  }
}

numberLineIntegers.register( 'ExplorerPortrayal', ExplorerPortrayal );