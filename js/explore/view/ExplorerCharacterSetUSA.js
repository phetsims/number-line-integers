// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import exploreScreenHome_png from '../../../images/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/exploreScreenNav_png.js';
import girlHiking_png from '../../../images/usa/girlHiking_png.js';
import girlInAir_png from '../../../images/usa/girlInAir_png.js';
import girlInWater_png from '../../../images/usa/girlInWater_png.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';
import { Image } from '../../../../scenery/js/imports.js';


const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
  NumberLineIntegersStrings.unitedStatesOfAmericaStringProperty,
  new Image( girlHiking_png ),
  girlInAir_png,
  girlHiking_png,
  girlInWater_png,
  exploreScreenHome_png,
  exploreScreenNav_png,
  'usa'
);

export default ExplorerCharacterSetUSA;