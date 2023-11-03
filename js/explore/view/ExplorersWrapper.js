// Copyright 2023, University of Colorado Boulder

/**
 * The ExplorersWrapper creates the images  of each version of the explorer ( flying, hiking, and swimming), as well
 * as defines the visibility of each individual image based on the regionAndCulturePortrayalProperty.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import ExplorerImages from '../../common/view/ExplorerImages.js';
import numberLineIntegers from '../../numberLineIntegers.js';

export default class ExplorersWrapper {
  /**
   *
   * @param { ElevationSceneModel } sceneModel
   */
  constructor( sceneModel ) {

    const explorerSets = ExplorerImages.EXPLORER_CHARACTER_SETS;
    const regionAdnCulturePortrayalProperty = sceneModel.regionAndCulturePortrayalProperty;

    const createVisibleProperty = set => {
      return new DerivedProperty( [ regionAdnCulturePortrayalProperty ], portrayal => {
        return portrayal === set;
      } );
    };

    const flyingImages = explorerSets.map( set => new Image( set.flying,
      {
        visibleProperty: createVisibleProperty( set ),
        maxWidth: 90,
        center: new Vector2( 6, -25 )
      } ) );
    const hikingImages = explorerSets.map( set => new Image( set.hiking,
      {
        visibleProperty: createVisibleProperty( set ),
        maxWidth: 30,
        center: new Vector2( 0, 0 )
      } ) );
    const swimmingImages = explorerSets.map( set => new Image( set.swimming,
      {
        visibleProperty: createVisibleProperty( set ),
        maxWidth: 85,
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

numberLineIntegers.register( 'ExplorersWrapper', ExplorersWrapper );