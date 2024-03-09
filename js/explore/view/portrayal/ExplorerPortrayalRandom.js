// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import dotRandom from '../../../../../dot/js/dotRandom.js';
import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { RANDOM_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';
import ExplorerPortrayalAfrica from './ExplorerPortrayalAfrica.js';
import ExplorerPortrayalAfricaModest from './ExplorerPortrayalAfricaModest.js';
import ExplorerPortrayalAsia from './ExplorerPortrayalAsia.js';
import ExplorerPortrayalLatinAmerica from './ExplorerPortrayalLatinAmerica.js';
import ExplorerPortrayalOceania from './ExplorerPortrayalOceania.js';
import ExplorerPortrayalUSA from './ExplorerPortrayalUSA.js';


const RANDOM_CHARACTER_SET = dotRandom.sample( [
  ExplorerPortrayalUSA,
  ExplorerPortrayalAfrica,
  ExplorerPortrayalAfricaModest,
  ExplorerPortrayalAsia,
  ExplorerPortrayalLatinAmerica,
  ExplorerPortrayalOceania
] );

const ExplorerPortrayalRandom = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.randomStringProperty,
  RANDOM_CHARACTER_SET.flying,
  RANDOM_CHARACTER_SET.hiking,
  RANDOM_CHARACTER_SET.swimming,
  RANDOM_CHARACTER_SET.screenHomeIcon,
  RANDOM_CHARACTER_SET.screenNavIcon,
  RANDOM_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalRandom;