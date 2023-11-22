// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import dotRandom from '../../../../dot/js/dotRandom.js';
import JoistStrings from '../../../../joist/js/JoistStrings.js';
import { MULTICULTURAL_REGION_AND_CULTURE_ID } from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';
import ExplorerCharacterSetAfrica from './ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetAfricaModest from './ExplorerCharacterSetAfricaModest.js';
import ExplorerCharacterSetAsia from './ExplorerCharacterSetAsia.js';
import ExplorerCharacterSetLatinAmerica from './ExplorerCharacterSetLatinAmerica.js';
import ExplorerCharacterSetOceania from './ExplorerCharacterSetOceania.js';
import ExplorerCharacterSetUSA from './ExplorerCharacterSetUSA.js';


const RANDOM_CHARACTER_SET = dotRandom.sample( [
  ExplorerCharacterSetUSA,
  ExplorerCharacterSetAfrica,
  ExplorerCharacterSetAfricaModest,
  ExplorerCharacterSetAsia,
  ExplorerCharacterSetLatinAmerica,
  ExplorerCharacterSetOceania
] );

const ExplorerCharacterSetMulticultural = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.multiculturalStringProperty,
  RANDOM_CHARACTER_SET.flying,
  RANDOM_CHARACTER_SET.hiking,
  RANDOM_CHARACTER_SET.swimming,
  RANDOM_CHARACTER_SET.screenHomeIcon,
  RANDOM_CHARACTER_SET.screenNavIcon,
  MULTICULTURAL_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetMulticultural;