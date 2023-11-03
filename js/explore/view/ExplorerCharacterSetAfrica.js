// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import ExplorerCharacterSet from './ExplorerCharacterSet.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import girlHiking_png from '../../../images/africa/girlHiking_png.js';
import { Image } from '../../../../scenery/js/imports.js';
import girlInAir_png from '../../../images/africa/girlInAir_png.js';
import girlInWater_png from '../../../images/africa/girlInWater_png.js';
import exploreScreenHome_png from '../../../images/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/exploreScreenNav_png.js';


const ExplorerCharacterSetAfrica = new ExplorerCharacterSet(
    NumberLineIntegersStrings.africaStringProperty,
    new Image( girlHiking_png ),
    girlInAir_png,
    girlHiking_png,
    girlInWater_png,
    exploreScreenHome_png,
    exploreScreenNav_png,
    'africa'
);

export default ExplorerCharacterSetAfrica;