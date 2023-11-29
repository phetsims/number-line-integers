// Copyright 2023, University of Colorado Boulder

/**
 * The ExplorerCharacters creates the images  of each version of the explorer ( flying, hiking, and swimming), as well
 * as defines the visibility of each individual image based on the regionAndCulturePortrayalProperty.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import ExplorerImages from './ExplorerImages.js';
import numberLineIntegers from '../../numberLineIntegers.js';

export default class ExplorerCharacters {
  /**
   *
   * @param { ElevationSceneModel } sceneModel
   */
  constructor( sceneModel ) {

    const explorerSets = ExplorerImages.EXPLORER_CHARACTER_SETS;
    const regionAdnCulturePortrayalProperty = sceneModel.regionAndCulturePortrayalProperty;

    const flyingImages = explorerSets.map( set => new Image( set.flying,
      {
        visibleProperty: DerivedProperty.valueEqualsConstant( regionAdnCulturePortrayalProperty, set ),
        maxHeight: 116,
        center: new Vector2( 6, -25 )
      } ) );
    const hikingImages = explorerSets.map( set => new Image( set.hiking,
      {
        visibleProperty: DerivedProperty.valueEqualsConstant( regionAdnCulturePortrayalProperty, set ),
        maxHeight: 71,
        center: new Vector2( 0, 0 )
      } ) );
    const swimmingImages = explorerSets.map( set => new Image( set.swimming,
      {
        visibleProperty: DerivedProperty.valueEqualsConstant( regionAdnCulturePortrayalProperty, set ),
        maxHeight: 40,
        center: new Vector2( 3, 5 )
      } ) );

    const flyingNode = new Node( { children: flyingImages } );
    const hikingNode = new Node( { children: hikingImages } );
    const swimmingNode = new Node( { children: swimmingImages } );

    /**
     * @public
     * @type {Node[]}
     */
    this.explorerNodes = [ flyingNode, hikingNode, swimmingNode ];
  }
}

numberLineIntegers.register( 'ExplorerCharacters', ExplorerCharacters );