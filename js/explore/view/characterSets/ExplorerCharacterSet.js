// Copyright 2023, University of Colorado Boulder

/**
 * The ExplorerCharacterSet defines what is needed for each character set in Number Line Integers.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import NumberLineCharacterSet from '../../../../../number-line-common/js/explore/view/NumberLineCharacterSet.js';
import numberLineIntegers from '../../../numberLineIntegers.js';

export default class ExplorerCharacterSet extends NumberLineCharacterSet {
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

numberLineIntegers.register( 'ExplorerCharacterSet', ExplorerCharacterSet );