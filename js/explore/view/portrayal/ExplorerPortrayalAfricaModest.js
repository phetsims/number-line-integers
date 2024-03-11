// Copyright 2023-2024, University of Colorado Boulder
/**
 * This file instantiates the Africa Modest region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import africaModestExploreScreenHome_png from '../../../../images/africaModest/africaModestExploreScreenHome_png.js';
import africaModestExploreScreenNav_png from '../../../../images/africaModest/africaModestExploreScreenNav_png.js';
import africaModestGirlHiking_png from '../../../../images/africaModest/africaModestGirlHiking_png.js';
import africaModestGirlInAir_png from '../../../../images/africaModest/africaModestGirlInAir_png.js';
import africaModestGirlInWater_png from '../../../../images/africaModest/africaModestGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAfricaModest = new ExplorerPortrayal(
    'africaModest',
    africaModestGirlInAir_png,
    africaModestGirlHiking_png,
    africaModestGirlInWater_png,
    africaModestExploreScreenHome_png,
    africaModestExploreScreenNav_png
);

export default ExplorerPortrayalAfricaModest;