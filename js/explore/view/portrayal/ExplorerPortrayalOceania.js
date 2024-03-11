// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the Oceania region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import oceaniaExploreScreenHome_png from '../../../../images/oceania/oceaniaExploreScreenHome_png.js';
import oceaniaExploreScreenNav_png from '../../../../images/oceania/oceaniaExploreScreenNav_png.js';
import oceaniaGirlHiking_png from '../../../../images/oceania/oceaniaGirlHiking_png.js';
import oceaniaGirlInAir_png from '../../../../images/oceania/oceaniaGirlInAir_png.js';
import oceaniaGirlInWater_png from '../../../../images/oceania/oceaniaGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalOceania = new ExplorerPortrayal(
  'oceania',
  oceaniaGirlInAir_png,
  oceaniaGirlHiking_png,
  oceaniaGirlInWater_png,
  oceaniaExploreScreenHome_png,
  oceaniaExploreScreenNav_png
);

export default ExplorerPortrayalOceania;