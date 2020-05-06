// Copyright 2019-2020, University of Colorado Boulder

/**
 * enum of possible scene values for the Number Line: Integers "Explore" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberLineIntegers from '../../numberLineIntegers.js';

const NLIScene = Enumeration.byKeys( [ 'ELEVATION', 'BANK', 'TEMPERATURE' ] );
numberLineIntegers.register( 'NLIScene', NLIScene );
export default NLIScene;